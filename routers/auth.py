from fastapi import APIRouter, Depends, HTTPException
from passlib.hash import pbkdf2_sha256

from core.db import get_session
from models.Account import Account
from models.User import User
from schemas.user import CreateUserBody, UserResponse


router = APIRouter()


@router.post("/register", response_model=UserResponse, status_code=201)
def create_user(body: CreateUserBody, session=Depends(get_session)) -> UserResponse:
    """
    Crée un nouvel utilisateur et son compte bancaire principal.
    
    Args:
        body: Les informations de l'utilisateur
        session: La session de base de données
    
    Returns:
        UserResponse: Les informations de l'utilisateur créé
        
    Raises:
        HTTPException 409: Si l'email existe déjà
        HTTPException 422: Si les données sont invalides
    """
    # Vérification de l'existence de l'email
    if not body.email:
        raise HTTPException(status_code=422, detail="Email is required")
        
    existing_user = session.query(User).filter(User.email == body.email).first()
    if existing_user:
        raise HTTPException(status_code=409, detail="Email already exists")

    # Vérification du mot de passe
    if not body.password or len(body.password) < 8:
        raise HTTPException(status_code=422, detail="Password must be at least 8 characters long")

    try:
        # Création de l'utilisateur
        user = User(
            first_name=body.first_name,
            last_name=body.last_name,
            email=body.email,
            password_hash=pbkdf2_sha256.hash(body.password),
        )
        session.add(user)
        session.commit()
        session.refresh(user)

        # Création du compte principal
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
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail="Error creating user")
