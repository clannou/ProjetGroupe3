from marshmallow import fields, Schema
import datetime
from . import db

from werkzeug.security import check_password_hash, generate_password_hash

class Document(db.Model):
    """
    Document Model
    """
    __tablename__ = 'document'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)

    # class constructor
    def __init__(self, name, path):
        """
        Class constructor
        """
        self.name = name
        self.path = path


    def __repr(self):
        return '<id {}>'.format(self.id)


