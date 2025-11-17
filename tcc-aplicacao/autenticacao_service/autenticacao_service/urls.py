"""
URL configuration for autenticacao_service project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

from api.resources.autenticacao_resource import AutenticacaoEntrarView, AutenticacaoRegistrarView

urlpatterns = [
    path("autenticacao/registrar/", AutenticacaoRegistrarView.as_view(), name="autenticacao_registrar"),
    path("autenticacao/entrar/", AutenticacaoEntrarView.as_view(), name="autenticacao_entrar"),
]