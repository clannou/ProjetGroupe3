from flask import request, Blueprint, jsonify, g
from models.user import User, UserSchema
from modules.useful import custom_response
from modules.controllers import db
from auth.tokens import Auth

user_api = Blueprint('user', __name__)
user_schema = UserSchema()


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
        print(email)
        print(password)

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