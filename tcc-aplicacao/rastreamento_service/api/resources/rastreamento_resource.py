from rest_framework.response import Response
from api.base.custom_api_view import CustomAPIView
from api.services.rastreamento_service import RastreamentoService


rastreamento_service = RastreamentoService()

class RastreamentoDetailsView(CustomAPIView):
    """Retorna a posição atual do caminhão"""
    def get(self, request, frete_uuid):
        coordenadas = rastreamento_service.get_coordenadas(frete_uuid=frete_uuid)

        if not coordenadas:
            return Response({"erro": "Frete não está sendo rastreado."}, status=404)

        return Response({"Coordenadas": coordenadas}, status=200)


class RastreamentoRastrearView(CustomAPIView):
    """Inicia o rastreamento simulado de um frete"""
    def post(self, request, frete_uuid):
        caminhao_uuid = request.data.get("caminhao_uuid")

        if not caminhao_uuid:
            return Response({"erro": "É necessário informar o caminhao_uuid."}, status=400)

        ponto_inicial = request.data.get("ponto_inicial", {"latitude": -23.5505, "longitude": -46.6333})  # São Paulo
        ponto_final = request.data.get("ponto_final", {"latitude": -22.9068, "longitude": -43.1729})      # Rio de Janeiro

        rastreamento_service.rastrear(
            frete_uuid=frete_uuid,
            caminhao_uuid=caminhao_uuid,
            ponto_inicial=ponto_inicial,
            ponto_final=ponto_final
        )

        return Response({"message": f"Rastreamento iniciado para frete {frete_uuid}."}, status=200)
