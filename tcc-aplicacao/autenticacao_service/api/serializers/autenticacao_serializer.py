from django.contrib.auth.models import User
from rest_framework import serializers

from rest_framework import serializers
from django.contrib.auth.models import User

from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model

User = get_user_model()

class RegistrarSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True, style={'input_type': 'password'})
    cnpj = serializers.CharField(max_length=18, write_only=True)

    class Meta:
        model = User
        fields = ['email', 'password', 'password2', 'cnpj']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    # ---------- Validações ----------
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password2": "As senhas não coincidem."})
        return attrs

    # ---------- Criação ----------
    def create(self, validated_data):
        cnpj = validated_data.pop('cnpj')
        validated_data.pop('password2')

        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            password=validated_data['password'],
        )

        return user

class EntrarSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    senha = serializers.CharField(write_only=True, required=True)