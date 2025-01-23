from datetime import datetime
from uuid import UUID
from pydantic import BaseModel


class CreateUserBody(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str


class UserResponse(BaseModel):
    id: UUID
    first_name: str
    last_name: str
    email: str
    created_at: datetime


class LoginUserBody(BaseModel):
    email: str
    password: str
