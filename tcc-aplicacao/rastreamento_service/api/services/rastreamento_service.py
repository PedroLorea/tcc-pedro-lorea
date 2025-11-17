import time
import threading
from datetime import datetime
from decimal import Decimal
from api.models import Rastreamento  # ajuste o import conforme seu projeto


class RastreamentoService:

    def __init__(self):
        # Em produção usaria Redis, mas pra MVP dá pra usar dict
        self.fretes_em_rastreamento = {}

    def get_coordenadas(self, frete_uuid):
        """Retorna última posição registrada"""
        ultimo = Rastreamento.objects.filter(frete_uuid=frete_uuid).order_by('-timestamp').first()
        if not ultimo:
            return None
        return {
            "latitude": float(ultimo.latitude),
            "longitude": float(ultimo.longitude),
            "timestamp": ultimo.timestamp
        }

    def rastrear(self, frete_uuid, caminhao_uuid, ponto_inicial, ponto_final):

        if frete_uuid in self.fretes_em_rastreamento:
            print(f"[Rastreamento] Já existe rastreamento ativo para {frete_uuid}")
            return

        pontos = self._gerar_pontos_intermediarios(ponto_inicial, ponto_final, 5)
        self.fretes_em_rastreamento[frete_uuid] = pontos

        print(f"[Rastreamento] Iniciando simulação para frete {frete_uuid}")

        # Thread pra não travar o servidor
        thread = threading.Thread(target=self._simular_movimento, args=(frete_uuid, caminhao_uuid, pontos))
        thread.daemon = True
        thread.start()

    def _gerar_pontos_intermediarios(self, start, end, num_pontos):
        latitudes = [Decimal(start["latitude"]) + (Decimal(end["latitude"]) - Decimal(start["latitude"])) * Decimal(i / (num_pontos + 1)) for i in range(num_pontos + 2)]
        longitudes = [Decimal(start["longitude"]) + (Decimal(end["longitude"]) - Decimal(start["longitude"])) * Decimal(i / (num_pontos + 1)) for i in range(num_pontos + 2)]
        return list(zip(latitudes, longitudes))

    def _simular_movimento(self, frete_uuid, caminhao_uuid, pontos):
        for i, (lat, lon) in enumerate(pontos):
            Rastreamento.objects.create(
                frete_uuid=frete_uuid,
                caminhao_uuid=caminhao_uuid,
                latitude=lat,
                longitude=lon,
                timestamp=datetime.now()
            )
            print(f"[Rastreamento] Posição {i+1}/{len(pontos)} registrada ({lat}, {lon})")
            time.sleep(10)  # Espera 10s antes de ir para o próximo ponto

        print(f"[Rastreamento] Frete {frete_uuid} chegou ao destino.")
        del self.fretes_em_rastreamento[frete_uuid]
