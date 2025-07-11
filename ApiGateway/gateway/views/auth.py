import os 
import environ
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from ..permissions import HasValidJWT

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
env = environ.Env()
environ.Env.read_env(os.path.join(BASE_DIR, '.environment', '.env.django'))
AUTH_SERVICE = env('AUTH_SERVICE', default='http://localhost:3003')

class SignUpView(APIView):

    def post(self, request):
        res = requests.post(f'{AUTH_SERVICE}/auth/signup', json = request.data)
        return Response(res.json(), status = res.status_code)
    
class SignInView(APIView):

    def post(self, request):
        resp = requests.post(f"{AUTH_SERVICE}/auth/signin", json=request.data)
        return Response(resp.json(), status = resp.status_code)

class UserListView(APIView):
    permission_classes = [HasValidJWT]

    def get(self, request):
        token = request.jwt_token
        
        headers = {
            "Authorization": f"Bearer {token}"
        }

        res = requests.get(f"{AUTH_SERVICE}/auth/users", headers=headers)

        return Response(res.json(), status=res.status_code)
        
class UserDetailView(APIView):
    permission_classes = [HasValidJWT]

    def get(self, request, user_id):
        token = request.jwt_token
        
        headers = {
            "Authorization": f"Bearer {token}"
        }

        res = requests.get(f"{AUTH_SERVICE}/auth/users/{user_id}/", headers=headers)

        return Response(res.json(), status = res.status_code)

    def delete(self, request, user_id):
        token = request.jwt_token
        
        headers = {
            "Authorization": f"Bearer {token}"
        }

        res = requests.delete(f"{AUTH_SERVICE}/auth/users/{user_id}/", headers=headers)

        return Response(res.json(), status = res.status_code)