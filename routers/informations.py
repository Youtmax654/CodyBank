from fastapi import APIRouter, Depends
from utils.db import get_session
from schemas.user import GetUser
from models.User import User
from fastapi import HTTPException

router = APIRouter()


@router.get("/me")
def get_current_user(user_id: int, session=Depends(get_session)):
    user = session.query(User).get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return GetUser(
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        created_at=user.created_at
    )