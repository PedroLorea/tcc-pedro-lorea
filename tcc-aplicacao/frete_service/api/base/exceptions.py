class FreteError(Exception):
    """Exceção base para erros relacionados ao domínio de frete."""
    status_code = 400

    def __init__(self, message=None):
        if message is not None:
            self.message = message
        super().__init__(getattr(self, "message", "Erro de frete"))

class UnidadeOperacionalIndisponivelError(FreteError):
    status_code = 409
    message = "Nenhuma unidade operacional disponível no momento."

class FreteNotFoundError(FreteError):
    status_code = 404
    message = "Frete não encontrado."

class PagamentoServiceError(FreteError):
    status_code = 502
    message = "Erro no serviço de pagamento."
