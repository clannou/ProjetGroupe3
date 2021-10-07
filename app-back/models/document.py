import datetime
from . import db
from models.user import User
from sqlalchemy.orm import relationship


class Document(db.Model):
    """
    Document Model
    """
    __tablename__ = 'document'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    path = db.Column(db.String(255), unique=True, nullable=False)
    created = db.Column(db.DateTime)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    # class constructor
    def __init__(self, name, path, user_id):
        """
        Class constructor
        """
        self.name = name
        self.path = path
        self.created = datetime.datetime.utcnow()
        self.user_id = user_id

    @staticmethod
    def list_documents_by_user_id(user_id):
        return Document.query.filter_by(user_id=user_id).all()

    @staticmethod
    def check_document_already_exist(path):
        document = Document.query.filter_by(path=path).first()
        if document:
            return True
        return False

    @staticmethod
    def document_path_belong_to_user_id(path, user_id):
        user = User.get_one_user(user_id)
        admin = user.admin
        if admin:
            return True
        document = Document.query.filter_by(path=path).first()
        if document is None:
            return False
        if document.user_id == user_id:
            return True
        return False

    @staticmethod
    def file_exist(path):
        document = Document.query.filter_by(path=path).first()
        if document is None:
            return False
        return True

    @staticmethod
    def document_to_dict(document_sql):
        if document_sql is not None:
            return {
                'id': document_sql.id,
                'name': document_sql.name,
                'path': document_sql.path,
                'created': document_sql.created,
                'user_id': document_sql.user_id
            }
        else:
            return None

    def __repr(self):
        return '<id {}>'.format(self.id)


