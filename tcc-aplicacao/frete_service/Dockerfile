FROM python:3.12-slim

# Evita geração de .pyc e buffer de output
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Instala dependências do sistema mínimas
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Instala dependências Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia o restante do código
COPY . .

# Exponha a porta (altere conforme necessário)
EXPOSE 8000

# Comando padrão (Django dev server)
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
