import os
import requests
import environ
from .decode import decode_token_simplejwt
from rest_framework.views import APIView
from rest_framework.response import Response
from ..permissions import HasValidJWT


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
env = environ.Env()
environ.Env.read_env(os.path.join(BASE_DIR, '.environment', '.env.django'))
SOCIAL_SERVICE = env('SOCIAL_SERVICE', default='http://localhost:3000')


class PostListCreateView(APIView):
    permission_classes = [HasValidJWT]

    def get(self, request):
        token = request.jwt_token
        headers = {"Authorization": f"Bearer {token}"}

        res = requests.get(f'{SOCIAL_SERVICE}/posts', headers=headers)
        return Response(res.json(), status=res.status_code)

    def post(self, request):
        token = request.jwt_token
        headers = {"Authorization": f"Bearer {token}"}

        data = request.data.copy()
        files = request.FILES

        res = requests.post(
            f'{SOCIAL_SERVICE}/posts',
            headers=headers,
            data=data,
            files=files
        )

        return Response(res.json(), status=res.status_code)


class PostsDetailView(APIView):
    permission_classes = [HasValidJWT]

    def get(self, request, post_id):
        token = request.jwt_token
        headers = {"Authorization": f"Bearer {token}"}

        res = requests.get(f"{SOCIAL_SERVICE}/posts/{post_id}/", headers=headers)
        return Response(res.json(), status=res.status_code)
    
    def patch(self, request, post_id):
        token = request.jwt_token
        headers = {"Authorization": f"Bearer {token}"}

        data = request.data.copy()
        files = request.FILES

        res = requests.patch(
            f'{SOCIAL_SERVICE}/posts/{post_id}/',
            headers=headers,
            data=data,
            files=files
        )

        return Response(res.json(), status=res.status_code)

    def delete(self, request, post_id):
        token = request.jwt_token
        headers = {"Authorization": f"Bearer {token}"}

        res = requests.delete(f"{SOCIAL_SERVICE}/posts/{post_id}/", headers=headers)

        try:
            if res.status_code == 404:
                data = {"message": "Post não encontrado ou já foi apagado"}
            elif res.content and res.headers.get("Content-Type") == "application/json":
                data = res.json()
            else:
                data = {"message": "Post deletado com sucesso"}
        except ValueError:
            data = {"message": "Post deletado com sucesso"}

        return Response(data, status=res.status_code)


