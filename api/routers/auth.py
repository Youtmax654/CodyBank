from fastapi.responses import JSONResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from api.core.db import get_session
from fastapi import APIRouter, Depends, HTTPException
from passlib.hash import pbkdf2_sha256

from api.models.Transaction import TransactionStatus, TransactionType
from api.models.Account import Account
from api.models.User import User
from api.schemas.user import (
    CreateUserBody,
    LoginUserBody,
    UpdatePasswordBody,
    UserResponse,
)
from api.services.transaction_service import create_transaction
from api.services.user_service import generate_token
from api.core.db import get_session

router = APIRouter()
bearer_scheme = HTTPBearer()


@router.post("/register", response_model=UserResponse, status_code=201)
def create_user(body: CreateUserBody, session=Depends(get_session)) -> UserResponse:
    if not body.email:
        raise HTTPException(status_code=422, detail="Email is required")

    existing_user = session.query(User).filter(User.email == body.email).first()
    if existing_user:
        raise HTTPException(status_code=409, detail="Email already exists")

    if not body.password or len(body.password) < 8:
        raise HTTPException(
            status_code=422, detail="Password must be at least 8 characters long"
        )

    user = User(
        first_name=body.first_name,
        last_name=body.last_name,
        email=body.email,
        password_hash=pbkdf2_sha256.hash(body.password),
    )
    session.add(user)
    session.commit()
    session.refresh(user)

    account = Account(
        user_id=user.id,
        balance=100.00,
        is_primary=True,
        name="Compte principal",
    )
    session.add(account)
    session.commit()
    session.refresh(account)

    transaction = create_transaction(
        session,
        account.id,
        100.00,
        None,
        TransactionType.DEPOSIT,
        TransactionStatus.CONFIRMED,
    )
    session.add(transaction)
    session.commit()

    return UserResponse(
        id=user.id,
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        created_at=user.created_at,
    )


@router.post("/login")
def login(body: LoginUserBody, session=Depends(get_session)):
    user = session.query(User).filter_by(email=body.email).first()
    if not user or not pbkdf2_sha256.verify(body.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    content = {"token": generate_token(str(user.id))}
    response = JSONResponse(content=content)
    response.set_cookie(key="token", value=content["token"])
    return response


@router.put("/password")
def update_password(
    body: UpdatePasswordBody,
    session=Depends(get_session),
    authorization: HTTPAuthorizationCredentials = Depends(bearer_scheme),
):
    decoded_token = jwt.decode(
        authorization.credentials, secret_key, algorithms=[algorithm]
    )
    user_id = decoded_token["user_id"]

    user = session.query(User).filter(User.id == UUID(user_id)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not pbkdf2_sha256.verify(body.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid password")

    user.password_hash = pbkdf2_sha256.hash(body.new_password)
    session.commit()
    session.refresh(user)

    return JSONResponse(content={"message": "Password updated"}).delete_cookie("token")
