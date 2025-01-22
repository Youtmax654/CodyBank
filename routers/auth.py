from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from passlib.hash import pbkdf2_sha256

import jwt
from core.db import get_session
from models.Account import Account
from models.User import User
from schemas.user import CreateUserBody, UserResponse
from utils.validator.user import LoginUser


router = APIRouter()


secret_key = "very_secret_key"
algorithm = "HS256"


bearer_scheme = HTTPBearer()

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



def get_user(authorization: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    return jwt.decode(authorization.credentials, secret_key, algorithms=[algorithm])


def generate_token(user_id: int):
    return jwt.encode({"user_id": user_id}, secret_key, algorithm=algorithm)


@router.post("/login")
def login(body: LoginUser, session = Depends(get_session)):
    user = session.query(User).filter_by(email=body.email).first()
    if not user or not pbkdf2_sha256.verify(body.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {"token": generate_token(user.id)}