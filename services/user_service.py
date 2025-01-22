from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from core.config import algorithm, secret_key
import jwt


bearer_scheme = HTTPBearer()


def get_user(authorization: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    return jwt.decode(authorization.credentials, secret_key, algorithms=[algorithm])


def generate_token(user_id: int):
    return jwt.encode({"user_id": user_id}, secret_key, algorithm=algorithm)
