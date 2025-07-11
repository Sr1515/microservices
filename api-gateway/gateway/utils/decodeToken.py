from rest_framework_simplejwt.backends import TokenBackend
from rest_framework_simplejwt.exceptions import TokenError
from django.conf import settings

def decode_token_simplejwt(token: str) -> bool:
    try:
        token_backend = TokenBackend(
            algorithm=settings.SIMPLE_JWT["ALGORITHM"],
            signing_key=settings.SIMPLE_JWT["SIGNING_KEY"]
        )
        payload = token_backend.decode(token, verify=True)
        return True
    except TokenError:
        return False
