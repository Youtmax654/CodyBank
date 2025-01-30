from uuid import UUID
from fastapi import APIRouter, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
import jwt
from api.core.db import get_session
from api.schemas.user import UpdatePasswordBody, UpdateProfileBody, UserResponse
from api.models.User import User
from fastapi import HTTPException
from api.core.config import algorithm, secret_key

router = APIRouter()
bearer_scheme = HTTPBearer()


@router.get("/me")
def get_current_user(
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

    return UserResponse(
        id=user.id,
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        created_at=user.created_at,
    )


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

    if not pbkdf2_sha256.verify(body.old_password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid password")

    user.password_hash = pbkdf2_sha256.hash(body.new_password)
    session.commit()
    session.refresh(user)

    response = JSONResponse(content={"message": "Password updated"})
    response.delete_cookie("token")
    return response


@router.put("/me")
def update_user(
    body: UpdateProfileBody,
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

    email_exists = session.query(User).filter(User.email == body.email).first()
    if email_exists and email_exists.id != UUID(user_id):
        raise HTTPException(status_code=409, detail="Email already exists")

    user.first_name = body.first_name
    user.last_name = body.last_name
    user.email = body.email
    session.commit()
    session.refresh(user)

    return UserResponse(
        id=user.id,
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        created_at=user.created_at,
    )
