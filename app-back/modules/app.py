from flask import Flask, request
from models import db
from modules import config
from modules.useful import custom_response

from flask_cors import CORS

app = Flask(__name__)
app.config['MANDRILL_API_KEY'] = '...'
app.config['MANDRILL_DEFAULT_FROM'] = '...'
app.config['QOLD_SUPPORT_EMAIL'] = '...'
app.config['CORS_HEADERS'] = 'Content-Type'

UPLOAD_FOLDER = './Resources/uploads/'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def create_app(config_key='development'):
    cors = CORS(app)
    app.config.from_object(config.app_config[config_key])
    db.init_app(app)
    from .controllers.users_controller import user_api as user_blueprint

    app.register_blueprint(user_blueprint, url_prefix='/api/users')

    @app.route('/', methods=['GET'])
    def route():
        methods, links, count = ['PUT', 'GET', 'POST', 'DELETE'], {}, 0
        for rule in app.url_map.iter_rules():
            temp = request.url_root
            new, url_root = list(rule.methods), temp.rsplit('/', 1)
            method = [x for x in new if x != 'OPTIONS' and x != 'HEAD']
            links[count], count = {"Method": method[0], "url": url_root[0] + str(rule)}, count + 1
        return custom_response(links, 200)

    return app

