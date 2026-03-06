# Backend Dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY ./api /app/api
COPY ./manage.py /app/
COPY ./backend /app/backend

RUN pip install --no-cache-dir -r /app/api/requirements.txt

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]