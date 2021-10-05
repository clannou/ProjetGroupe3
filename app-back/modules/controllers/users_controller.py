from flask import request, Blueprint
from models.user import User, UserSchema
from modules.useful import custom_response
from modules.controllers import db

user_api = Blueprint('user', __name__)
user_schema = UserSchema()


@user_api.route('/register', methods=['POST'])
def create():
    """
        Créer un utilisateur avec les données du body.
    """
    req_data = request.get_json()
    print(req_data['username'])
    print(req_data['email'])
    print(req_data['password'])
    username = req_data['username']
    email = req_data['email']
    password = req_data['password']

    if username and email and password:
        user_in_db = User.get_user_by_email(email)
        print(user_in_db)
        if user_in_db:
            message = {'error': 'Email already existing, use another one.'}
            return custom_response(message, 400)
        password = User.hash_password(req_data['password'])
        print(password)
        new_user = User(username=username, email=email, password=password)
        db.session.add(new_user)
        db.session.commit()
        return custom_response({"success": "User has registred successfully !"}, 201)
    return custom_response({"error": "Someone went wrong with request's data"}, 201)