from api.core.config import algorithm, secret_key
import jwt
from uuid import UUID


def generate_token(user_id: UUID):
    return jwt.encode({"user_id": user_id}, secret_key, algorithm=algorithm)
