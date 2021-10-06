from marshmallow import fields, Schema
import datetime
from . import db
from sqlalchemy.orm import relationship

from werkzeug.security import check_password_hash, generate_password_hash

class User(db.Model):
    """
    User Model
    """
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(48), nullable=False)
    email = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)
    created = db.Column(db.DateTime)
    admin = db.Column(db.BOOLEAN)

    # class constructor
    def __init__(self, username, email, password):
        """
        Class constructor
        """
        self.username = username
        self.email = email
        self.password = password
        self.created = datetime.datetime.utcnow()
        self.admin = False

    def hash_password(password):
        """
            Hash the password passed in parameter
        """
        return generate_password_hash(password)

    def check_password(self, password):
        """
            It will check if password passed in parameter is the same as the password from User
        """
        hashed_pass = self.password
        return check_password_hash(hashed_pass, password)

    def save(self):
        db.session.add(self)
        db.session.commit()

    def update(self, data):
        for key, item in data.items():
            setattr(self, key, item)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    @staticmethod
    def get_all_users():
        return User.query.all()

    @staticmethod
    def get_one_user(id):
        return User.query.filter_by(id=id).first()

    @staticmethod
    def get_user_by_email(email):
        return User.query.filter_by(email=email).first()

    @staticmethod
    def user_is_admin(email):
        user = User.query.filter_by(email=email).first()
        if user.admin == True:
            return True
        return False

    def __repr(self):
        return '<id {}>'.format(self.id)


class UserSchema(Schema):
    """
  User Schema
  """
    id = fields.Int(dump_only=True)
    username = fields.Str(required=True)
    email = fields.Email(required=True)
    password = fields.Str(required=True)
    created = fields.DateTime(dump_only=True)
    admin = fields.Bool(required=True)
