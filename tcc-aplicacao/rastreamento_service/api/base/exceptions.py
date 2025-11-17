class PagamentoError(Exception):
    """Exceção base para erros relacionados ao domínio de pagamento."""
    status_code = 400

    def __init__(self, message=None):
        if message is not None:
            self.message = message
        super().__init__(getattr(self, "message", "Erro de pagamento"))

class PagamentoNotFoundError(PagamentoError):
    status_code = 404
    message = "Pagamento não encontrado."