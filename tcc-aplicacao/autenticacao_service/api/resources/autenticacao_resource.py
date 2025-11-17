from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from api.serializers.autenticacao_serializer import EntrarSerializer, RegistrarSerializer
import jwt
from datetime import datetime, timedelta, timezone
from django.conf import settings
from autenticacao_service.settings import SECRET_KEY

class AutenticacaoRegistrarView(APIView):
    def post(self, request):
        serializer = RegistrarSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"msg": "Usuário criado"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AutenticacaoEntrarView(APIView):
    def post(self, request):
        serializer = EntrarSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        email = serializer.validated_data["email"]
        senha = serializer.validated_data["senha"]
        
        try:
            user = User.objects.get(email=email)
            if user.check_password(senha):
                payload = {
                    "user_id": user.id,
                    "username": user.username,
                    "role": "usuario",
                    "permissoes": ["frete:ler", "frete:criar"],
                    "exp": datetime.now(timezone.utc) + timedelta(minutes=30)
                }
                token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
                return Response({"token": token}, status=status.HTTP_200_OK)
            else:
                raise User.DoesNotExist
        except User.DoesNotExist:
            return Response({"error": "Credenciais inválidas"}, status=status.HTTP_401_UNAUTHORIZED)