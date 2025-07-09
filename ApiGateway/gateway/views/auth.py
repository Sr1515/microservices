import os 
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status 

AUTH_SERVICE = os.getenv('AUTH_SERVICE')

class SignUpView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        res = requests.post(f'{AUTH_SERVICE}/auth/signup', json = request.data)
        return Response(res.json(), status = res.status_code)
    
class SignInView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        resp = requests.post(f"{AUTH_SERVICE}/auth/signin", json=request.data)
        return Response(resp.json(), status = resp.status_code)

class UserListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        headers = {'Authorization': f'Bearer {request.auth}'}
        print(request.auth)
        res = requests.get(f'{AUTH_SERVICE}/auth/users', headers = headers)
        return Response(res.json(), status = res.status_code)
    
class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        headers = {'Authorization': f'Bearer {request.auth}'}
        resp = requests.get(f"{AUTH_SERVICE}/auth/users/{user_id}", headers=headers)
        return Response(resp.json(), status = resp.status_code)

    def delete(self, request, user_id):
        headers = {'Authorization': f'Bearer {request.auth}'}
        resp = requests.delete(f"{AUTH_SERVICE}/auth/users/{user_id}", headers=headers)
        return Response(resp.json(), status = resp.status_code)