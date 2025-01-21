from pydantic import BaseModel
from fastapi import Depends
from utils.db import get_session
from models.User import User
from passlib.hash import pbkdf2_sha256

class CreateUser(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str

def create_user(body: CreateUser, session = Depends(get_session)) -> User:
    user = User(
        first_name=body.first_name,
        last_name=body.last_name,
        email=body.email,
        password_hash=pbkdf2_sha256.hash(body.password)
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return user