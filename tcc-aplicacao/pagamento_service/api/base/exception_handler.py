from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status

from api.base.exceptions import PagamentoError


def custom_exception_handler(exc, context):
    """
    Manipula exceções de domínio (do tipo FreteError)
    e converte em respostas HTTP padronizadas.
    """

    # Deixa o DRF lidar primeiro com exceções padrões (ex: ValidationError)
    response = exception_handler(exc, context)

    # Se o DRF não souber lidar, tratamos aqui
    if response is None:
        if isinstance(exc, PagamentoError):
            # qualquer erro genérico de frete
            return Response(
                {"error": str(exc)},
                status=getattr(exc, "status_code", status.HTTP_400_BAD_REQUEST)
            )

    return response
