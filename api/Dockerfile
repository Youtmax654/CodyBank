FROM python:3.11-slim

WORKDIR /api

COPY . ./

RUN pip install fastapi[standard] fastapi_utilities passlib sqlmodel pyjwt pytest

CMD ["fastapi", "run", "main.py"]