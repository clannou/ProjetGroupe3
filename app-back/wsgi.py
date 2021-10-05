from modules.app import create_app
import click


@click.command()
@click.option('--host', default='127.0.0.1', help='Host ip address')
@click.option('--port', default=5000, help='Access port')
@click.option('--conf', default='development', help='App configuration type')
def start_server(host, port, conf):
    app = create_app(conf)
    app.run(host=host, port=port)


if __name__ == '__main__':
    start_server()
