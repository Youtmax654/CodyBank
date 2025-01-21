from fastapi import APIRouter, Depends
from passlib.hash import pbkdf2_sha256

from models.Account import Account
from models.User import User
from utils.db import get_session
from validator.user import CreateUser


router = APIRouter()


@router.post("/register")
def create_user(body: CreateUser, session=Depends(get_session)):
    user = User(
        first_name=body.first_name,
        last_name=body.last_name,
        email=body.email,
        password_hash=pbkdf2_sha256.hash(body.password),
    )
    session.add(user)
    session.commit()
    session.refresh(user)

    account = Account(user_id=user.id, balance=100.00, is_primary=True, status="active")
    session.add(account)
    session.commit()
    session.refresh(account)

    return {
        "status": "success",
        "user": {
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
        },
    }
