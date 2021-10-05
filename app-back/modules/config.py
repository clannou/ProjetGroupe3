class Development:
    DEBUG = False
    TESTING = False
    JWT_SECRET_KEY = "secret"
    SECRET_KEY = 'secret!'
    MYSQL_HOST = 'localhost'
    MYSQL_USER = 'root'
    MYSQL_PASSWORD = 'iiluskyii75'
    MYSQL_DB = 'PersonnalProject'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = f"mysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}/{MYSQL_DB}"

app_config = {
    'development': Development
}
