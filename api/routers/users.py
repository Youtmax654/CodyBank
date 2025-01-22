import uuid
from fastapi import APIRouter, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
import jwt
from api.core.db import get_session
from api.schemas.user import UserResponse
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
    body = jwt.decode(authorization.credentials, secret_key, algorithms=[algorithm])
    user_id = body["user_id"]
    user = session.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserResponse(
        id=user.id,
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        created_at=user.created_at,
    )
