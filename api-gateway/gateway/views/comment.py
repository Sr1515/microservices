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


class CommentCreateView(APIView):
    permission_classes = [HasValidJWT]

    def post(self, request):
        token = request.jwt_token
        headers = {"Authorization": f"Bearer {token}"}
        data = request.data 

        res = requests.post(
            f'{SOCIAL_SERVICE}/comments',
            headers = headers,
            data = data
        )

        return Response(res.json(), status = res.status_code) 


class CommentsByPostView(APIView):
        permission_classes = [HasValidJWT]

        def get(self, request, post_id):
            token = request.jwt_token
            headers = {"Authorization": f"Bearer {token}"}

            res = requests.get(
                f'{SOCIAL_SERVICE}/comments/by-post/{post_id}',
                headers = headers
            )

            return Response(res.json(), status=res.status_code)

class CommentDetailView(APIView):
    permission_classes = [HasValidJWT]

    def patch(self, request, comment_id):
        token = request.jwt_token
        headers = {"Authorization": f"Bearer {token}"}
        data = request.data

        res = requests.patch(
            f'{SOCIAL_SERVICE}/comments/{comment_id}/',
            headers=headers,
            data=data,
        )

        return Response(res.json(), status=res.status_code)

    def delete(self, request, comment_id):
        token = request.jwt_token
        headers = {"Authorization": f"Bearer {token}"}

        res = requests.delete(f"{SOCIAL_SERVICE}/comments/{comment_id}/", headers=headers)

        try:
            if res.status_code == 404:
                data = {"message": "Comment não encontrado ou já foi apagado"}
            elif res.content and res.headers.get("Content-Type") == "application/json":
                data = res.json()
            else:
                data = {"message": "Comment deletado com sucesso"}
        except ValueError:
            data = {"message": "Comment deletado com sucesso"}

        return Response(data, status=res.status_code)    