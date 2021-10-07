import os
from flask import request, Blueprint, jsonify, send_file
from models.user import User, UserSchema
from models.document import Document
from modules.useful import custom_response
from modules.controllers import db_session
from werkzeug.utils import secure_filename
from modules.app import app
from auth.tokens import Auth
from werkzeug.security import generate_password_hash

from flask_sqlalchemy import SQLAlchemy

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
        db_session.add(new_user)
        db_session.commit()
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
            db_session.add(new_document)
            db_session.commit()
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
        return jsonify({
            'success': user_files
        })
    return custom_response({'error': "Need email in form"}, 400)

@user_api.route('/download_file', methods=['POST'])
def download_file():
    if request.get_json() is None:
        return custom_response({'error': "Need email, filename in form"}, 400)
    req_data = request.get_json()
    user_email = req_data['email']
    user = User.get_user_by_email(user_email)
    if user is None:
        return custom_response({'error': "Email does not exist"}, 400)
    user_id = user.id
    filename = req_data['filename']
    path = app.config['UPLOAD_FOLDER'] + filename
    allow_download_file = Document.document_path_belong_to_user_id(path, user_id)
    if allow_download_file is True:
        """
            Add a '.' before Path to go .. of UPLOAD FOLDER.
        """
        return send_file("." + path, as_attachment=True)
    return custom_response({'error': "You are not allowed to download: " + filename}, 400)

@user_api.route('/delete_file', methods=['DELETE'])
def delete_item():
    req_data = request.get_json()
    mandatory_data = ['email', 'filename']
    missing_data = check_missing_parameter(mandatory_data, req_data)
    if missing_data:
        return custom_response({
            'error': 'Données non envoyé ' + User.user_mandatory_data_to_string(missing_data)
        }, 400)
    user_email = req_data['email']
    user = User.get_user_by_email(user_email)
    if user is None:
        return custom_response({'error': "Email does not exist"}, 400)
    user_id = user.id
    filename = req_data['filename']
    document = Document.query.filter_by(name=req_data['filename']).first()
    path = app.config['UPLOAD_FOLDER'] + filename
    file_exist = Document.file_exist(path)
    if file_exist is False:
        return custom_response({'error': filename + " doesn't exist in our database"}, 400)
    allow_delete_file = Document.document_path_belong_to_user_id(path, user_id)
    if allow_delete_file is False:
        return custom_response({'error': "You are not allowed to delete: " + filename}, 400)
    current_db_sessions = db_session.object_session(document)
    current_db_sessions.delete(document)
    current_db_sessions.commit()
    os.remove(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    return custom_response({'success': "file " + document.name + " deleted successfully"}, 200)

@user_api.route('/username', methods=['PUT'])
def update_username():
    req_data = request.get_json()
    mandatory_data = ['email', 'username']
    missing_data = check_missing_parameter(mandatory_data, req_data)
    if missing_data:
        return custom_response({
            'error': 'Données non envoyé ' + User.user_mandatory_data_to_string(missing_data)
        }, 400)
    user_email = req_data['email']
    user = User.get_user_by_email(user_email)
    if not user:
        return custom_response({
            'error': 'User not found'
        }, 400)
    new_username = req_data['username']
    update_username = user.update(dict(username=new_username))
    db_session.commit()
    return custom_response({
        'success': 'Username changed sucessfully to: ' + new_username
    }, 201)

@user_api.route('/email', methods=['PUT'])
def update_email():
    req_data = request.get_json()
    mandatory_data = ['email', 'new_email']
    missing_data = check_missing_parameter(mandatory_data, req_data)
    if missing_data:
        return custom_response({
            'error': 'Données non envoyé ' + User.user_mandatory_data_to_string(missing_data)
        }, 400)
    user_email = req_data['email']
    user = User.get_user_by_email(user_email)
    if not user:
        return custom_response({
            'error': 'User not found'
        }, 400)
    new_email = req_data['new_email']
    update_email = user.update(dict(email=new_email))
    db_session.commit()
    return custom_response({
        'success': 'Email changed sucessfully to: ' + new_email
    }, 201)

@user_api.route('/password', methods=['PUT'])
def update_user_password():
    req_data = request.get_json()
    mandatory_data = ['password', 'newPassword', 'email']
    missing_data = check_missing_parameter(mandatory_data, req_data)
    if missing_data:
        return custom_response({
            'error': 'Données non envoyé ' + User.user_mandatory_data_to_string(missing_data)
        }, 400)
    user_email = req_data['email']
    user = User.get_user_by_email(user_email)
    if not user:
        return custom_response({
            'error': 'User not found'
        }, 400)
    if not user.check_password(req_data['password']):
        return custom_response({
            'error': 'Actual password incorrect'
        }, 400)
    update_password = user.update(dict(password=generate_password_hash(req_data['newPassword'])))
    db_session.commit()
    return custom_response({
        'success': 'Password changed sucessfully'
    }, 201)

@user_api.route('/list_users', methods=['POST'])
def list_users():
    req_data = request.get_json()
    mandatory_data = ['email']
    missing_data = check_missing_parameter(mandatory_data, req_data)
    if missing_data:
        return custom_response({
            'error': 'Données non envoyé ' + User.user_mandatory_data_to_string(missing_data)
        }, 400)
    user_email = req_data['email']
    user = User.get_user_by_email(user_email)
    if user is None:
        return custom_response({
            'error': 'User not found'
        }, 400)
    user_is_admin = User.user_is_admin(user_email)
    if user_is_admin:
        list_users = []
        users = User.list_all_users()
        for user in users:
            list_users.append(User.user_to_dict(user))
        return jsonify({
            'success': list_users
        })
    return custom_response({'error': 'You are not allowed to call this service'}, 400)

def check_missing_parameter(mandatory_data, req_data):
    missing_data = []
    for m in mandatory_data:
        if m not in req_data:
            missing_data.append(m)
    return missing_data
