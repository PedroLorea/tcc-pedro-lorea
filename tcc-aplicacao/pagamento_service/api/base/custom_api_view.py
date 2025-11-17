from pydantic import ValidationError
from rest_framework.exceptions import ValidationError as DRFValidationError
from rest_framework.views import APIView

class CustomAPIView(APIView):

    input_dto = None  # deve ser definido na subclasse

    def validate_dto(self, data: dict):
        # normaliza dict ou QueryDict
        if not isinstance(data, dict):
            data = data.dict()

        # converte valores vazios para None
        data = {k: (v if v not in ("", {}) else None) for k, v in data.items()}

        if not self.input_dto:
            raise NotImplementedError("input_dto não definido para este recurso")

        try:
            return self.input_dto(**data)
        except ValidationError as e:
            # levanta erro DRF para retornar JSON 400
            raise DRFValidationError(e.errors())
