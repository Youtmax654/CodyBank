from fastapi import APIRouter, Depends, HTTPException
from passlib.hash import pbkdf2_sha256

from core.db import get_session
from models.Account import Account
from models.User import User
from schemas.user import CreateUserBody, UserResponse


router = APIRouter()


@router.post("/register")
def create_user(body: CreateUserBody, session=Depends(get_session)) -> UserResponse:
    existing_user = session.query(User).filter(User.email == body.email).first()
    if existing_user:
        raise HTTPException(status_code=409, detail="Email already exists")

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

    return UserResponse(
        id=user.id,
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        created_at=user.created_at,
    )
