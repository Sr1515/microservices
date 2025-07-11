from rest_framework.permissions import BasePermission
from rest_framework.exceptions import AuthenticationFailed
from .utils.decodeToken import decode_token_simplejwt

class HasValidJWT(BasePermission):
    def has_permission(self, request, view):
        auth = request.headers.get('Authorization')

        if not auth or not auth.startswith('Bearer'):
            raise AuthenticationFailed("Token não fornecido")

        token = auth.split(" ")[1]
        decoded = decode_token_simplejwt(token)

        if not decoded:
            raise AuthenticationFailed("Token inválido")

        request.jwt_token = token

        return True
