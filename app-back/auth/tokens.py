from flask import json, Response, request, g
import datetime
import jwt

class Auth:
    @staticmethod
    def generate_token(user_id):
        try:
            payload = {'exp': datetime.datetime.utcnow() + (datetime.timedelta(days=1)),
                       'iat': datetime.datetime.utcnow(),
                       'sub': user_id}
            return jwt.encode(payload, 'SpaceArt', 'HS256').decode('utf-8')
        except Exception as e:
            try:
                return Response(mimetype='application/json',
                                response=json.dumps({'error': 'error in generating user token'}),
                                status=400)
            finally:
                e = None
                del e