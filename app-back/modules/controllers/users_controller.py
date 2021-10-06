import os
from flask import request, Blueprint, jsonify, g, Flask
from models.user import User, UserSchema
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
    if 'file' not in request.files:
        print("no file")
        return custom_response({'error': "No file"}, 400)
    file = request.files['file']
    if file.filename == '':
        print("no file selected")
        return custom_response({'error': "No selected file"}, 400)
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        print(filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        return custom_response({'success': "file " + filename + " uploaded successfully " + filename}, 200)
    print("empty form")
    return custom_response({'error': "Empty Form"}, 400)

