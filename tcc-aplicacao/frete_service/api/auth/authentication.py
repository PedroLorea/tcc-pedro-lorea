import jwt
from django.conf import settings
from rest_framework import authentication, exceptions
from django.contrib.auth import get_user_model

User = get_user_model()

class JWTAuthentication(authentication.BaseAuthentication):
    """
    Autenticação via JWT.
    """

    def authenticate(self, request):
        auth_header = request.headers.get("Authorization")

        if not auth_header:
            return None

        # if not auth_header:
        #     class User:
        #         def __init__(self):
        #             self.id = 1
        #             self.username = "dev_user"
        #             self.role = "admin"
        #             self.permissoes = ["all"]
        #             self.is_authenticated = True

        #     return (User(), None)

        try:
            prefix, token = auth_header.split(" ")
            if prefix.lower() != "bearer":
                raise exceptions.AuthenticationFailed("Token inválido")
        except ValueError:
            raise exceptions.AuthenticationFailed("Cabeçalho Authorization mal formado")

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed("Token expirado")
        except jwt.InvalidTokenError:
            raise exceptions.AuthenticationFailed("Token inválido")

        class User:
            def __init__(self, payload):
                self.id = payload.get("user_id")
                self.username = payload.get("username")
                self.role = payload.get("role")
                self.permissoes = payload.get("permissoes", [])
                self.is_authenticated = True

        user = User(payload)
        return (user, None)