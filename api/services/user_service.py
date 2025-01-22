from core.config import algorithm, secret_key
import jwt


def generate_token(user_id: int):
    return jwt.encode({"user_id": user_id}, secret_key, algorithm=algorithm)
