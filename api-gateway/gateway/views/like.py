import os
import environ
import requests
from rest_framework.views import APIView 
from rest_framework.response import Response
from ..permissions import HasValidJWT

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
env = environ.Env()
environ.Env.read_env(os.path.join(BASE_DIR, '.environment', '.env.django'))
SOCIAL_SERVICE = env('SOCIAL_SERVICE', default='http://localhost:3000')


class AddLikeView(APIView):
    permission_classes = [HasValidJWT]

    def post(self, request):
        token = request.jwt_token
        headers = {"Authorization": f"Bearer {token}"}
        data = request.data 

        res = requests.post(
            f'{SOCIAL_SERVICE}/likes',
            headers = headers,
            data = data
        )

        return Response(res.json(), status = res.status_code) 


class LikesByPostView(APIView):
        permission_classes = [HasValidJWT]

        def get(self, request, post_id):
            token = request.jwt_token
            headers = {"Authorization": f"Bearer {token}"}

            res = requests.get(
                f'{SOCIAL_SERVICE}/likes/by-post/{post_id}',
                headers = headers
            )

            return Response(res.json(), status=res.status_code)

class RemoveLikeView(APIView):
    permission_classes = [HasValidJWT]

    def delete(self, request, like_id):
        token = request.jwt_token
        headers = {"Authorization": f"Bearer {token}"}

        res = requests.delete(f"{SOCIAL_SERVICE}/likes/{like_id}/", headers=headers)

        try:
            if res.status_code == 404:
                data = {"message": "Like não encontrado ou já foi retirado"}
            elif res.content and res.headers.get("Content-Type") == "application/json":
                data = res.json()
            else:
                data = {"message": "Like removido com sucesso"}
        except ValueError:
            data = {"message": "Like removido com sucesso"}

        return Response(data, status=res.status_code)    