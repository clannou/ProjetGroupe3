import os
from flask import request, Blueprint, jsonify, send_file
from models.user import User, UserSchema
from models.document import Document
from modules.useful import custom_response
from modules.controllers import db
from werkzeug.utils import secure_filename
from modules.app import app
from auth.tokens import Auth

user_api = Blueprint('user', __name__)
user_schema = UserSchema()

ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}

@user_api.route('/register', methods=['POST'])
def create():
    """
        Créer un utilisateur avec les données du body.
    """
    req_data = request.get_json()
    username = req_data['username']
    email = req_data['email']
    password = req_data['password']

    if username and email and password:
        user_in_db = User.get_user_by_email(email)
        if user_in_db:
            message = {'error': 'Email already existing, use another one.'}
            return custom_response(message, 400)
        password = User.hash_password(req_data['password'])
        new_user = User(username=username, email=email, password=password)
        db.session.add(new_user)
        db.session.commit()
        return custom_response({"success": "User has registred successfully !"}, 201)
    return custom_response({"error": "Someone went wrong with request's data"}, 400)

@user_api.route('/login', methods=['POST'])
def login():
    req_data = request.get_json()
    email = req_data['email']
    password = req_data['password']
    if email and password:

        user = User.get_user_by_email(email)
        if user is None:
            return custom_response({'error': "Incorrect email or password"}, 400)
        password = user.check_password(password)
        if password is False:
            return custom_response({'error': "Incorrect email or password"}, 400)
        isAdmin = user.admin
        return custom_response({'success': "User logged successfully",
                                'admin': isAdmin
                                }, 200)
    return custom_response({'error': "Empty Form Login"}, 400)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@user_api.route('/uploadfile', methods=['POST'])
def upload_file():
    req_form = request.form
    if req_form is None:
        return custom_response({'error': "Empty Form"}, 400)
    user_email = req_form.get('email')
    if user_email:
        user = User.get_user_by_email(user_email)
        if user is None:
            return custom_response({'error': "User does not exist"}, 400)
        user_id = user.id
        if 'file' not in request.files:
            return custom_response({'error': "No file"}, 400)
        file = request.files['file']
        if file.filename == '':
            return custom_response({'error': "No selected file"}, 400)
        if file and allowed_file(file.filename):
            filename = str(user_id) + "_" + secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            name = filename
            path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            if Document.check_document_already_exist(path) is True:
                return custom_response({'error': filename + " has already been uploaded"}, 400)
            new_document = Document(name, path, user_id)
            db.session.add(new_document)
            db.session.commit()
            return custom_response({'success': "file " + filename + " uploaded successfully"}, 200)
    return custom_response({'error': "Empty Form"}, 400)

@user_api.route('/list_uploadfiles', methods=['POST'])
def list_upload_files():
    req_data = request.get_json()
    user_email = req_data['email']
    if user_email:
        user = User.get_user_by_email(user_email)
        if user is None:
            return custom_response({'error': "User does not exist"}, 400)
        user_id = user.id
        files = Document.list_documents_by_user_id(user_id)
        user_files = []
        for file in files:
            user_files.append(Document.document_to_dict(file))
        print(files)
        return jsonify({
            'success': user_files
        })
    return custom_response({'error': "Need email in form"}, 400)

@user_api.route('/download_file', methods=['POST'])
def download_file():
    req_data = request.get_json()
    user_email = req_data['email']
    if user_email:
        user = User.get_user_by_email(user_email)
        if user is None:
            return custom_response({'error': "Email does not exist"}, 400)
        user_id = user.id
        filename = req_data['filename']
        path = app.config['UPLOAD_FOLDER'] + filename
        allow_download_file = Document.document_path_belong_to_user_id(path, user_id)
        if allow_download_file is True:
            return send_file("." + path, as_attachment=True)
        return custom_response({'error': "You are not allowed to download: " + filename}, 400)
    return custom_response({'error': "Need email in form/body"}, 400)

