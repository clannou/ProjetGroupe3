from flask_script import Manager
from flask_migrate import Migrate
from modules.app import create_app, db

app = create_app('development')
migrate = Migrate(app=app, db=db)
manager = Manager(app=app)
manager.add_command('db')

if __name__ == '__main__':
    manager.run()
