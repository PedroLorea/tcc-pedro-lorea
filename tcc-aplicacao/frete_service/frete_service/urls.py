"""
URL configuration for frete_service project.

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

from api.resources.frete_resource import FreteAlteracaoStatus, FreteDecisaoView, FreteDetalhesView, FreteListView, FreteOrcamentoView, FreteSolicitacaoView
from api.resources.motorista_resource import MotoristaCreateView
from api.resources.caminhao_resource import CaminhaoCreateView

urlpatterns = [
    path('fretes/solicitar/', FreteSolicitacaoView.as_view(), name="frete_solicitacao"),
    path('fretes/listar/', FreteListView.as_view(), name="frete_list"),
    path('fretes/detalhes/<str:frete_uuid>/', FreteDetalhesView.as_view(), name="frete_detalhes"),
    path('fretes/altera-status/<str:frete_uuid>/', FreteAlteracaoStatus.as_view(), name="frete_altera_status"),
    path('fretes/decisao/<str:frete_uuid>/', FreteDecisaoView.as_view(), name="frete_decisao"),
    path('fretes/orcamento/<str:frete_uuid>/', FreteOrcamentoView.as_view(), name="frete_orcamento"),

    path('motorista/criar/', MotoristaCreateView.as_view(), name="motorista_create"),

    path('caminhao/criar/', CaminhaoCreateView.as_view(), name="caminhao_create"),
]
