from uuid import UUID
from api.models.Account import Account
from api.models.Beneficiary import Beneficiary
from fastapi import APIRouter, Depends, HTTPException
from api.core.config import algorithm, secret_key
import jwt
from api.core.db import get_session
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from api.schemas.beneficiary import (
    BeneficiaryBody,
    BeneficiaryResponse,
    BeneficiaryUpdateBody,
)
from api.services.transaction_service import (
    get_account_by_iban,
    get_account_by_id,
)


router = APIRouter()
bearer_scheme = HTTPBearer()


@router.post("/beneficiaries")
def create_beneficiary(
    body: BeneficiaryBody,
    session=Depends(get_session),
    authorization: HTTPAuthorizationCredentials = Depends(bearer_scheme),
):
    decoded_token = jwt.decode(
        authorization.credentials, secret_key, algorithms=[algorithm]
    )
    user_id = UUID(decoded_token["user_id"])

    account = get_account_by_iban(session, body.iban)

    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    if not account.is_active:
        raise HTTPException(status_code=403, detail="Account is inactive")

    beneficiary_account = (
        session.query(Account).filter(Account.iban == body.iban).first()
    )
    if not beneficiary_account:
        raise HTTPException(status_code=404, detail="Account not found")

    accounts = session.query(Account).filter(Account.user_id == user_id).all()
    for account in accounts:
        if account.iban == body.iban:
            raise HTTPException(
                status_code=400,
                detail="You cannot create a beneficiary with your own account",
            )

    beneficiary_exist = (
        session.query(Beneficiary)
        .filter(
            Beneficiary.user_id == user_id,
            Beneficiary.iban == body.iban,
        )
        .first()
    )
    if beneficiary_exist:
        raise HTTPException(status_code=400, detail="Beneficiary already exists")

    if not body.name:
        raise HTTPException(status_code=400, detail="Beneficiary name is required")

    beneficiary = Beneficiary(
        user_id=user_id,
        name=body.name,
        iban=body.iban,
    )

    session.add(beneficiary)
    session.commit()
    session.refresh(beneficiary)
    return beneficiary


@router.get("/beneficiaries")
def get_beneficiaries(
    session=Depends(get_session),
    authorization: HTTPAuthorizationCredentials = Depends(bearer_scheme),
):
    decoded_token = jwt.decode(
        authorization.credentials, secret_key, algorithms=[algorithm]
    )
    user_id = UUID(decoded_token["user_id"])

    beneficiaries = (
        session.query(Beneficiary).filter(Beneficiary.user_id == user_id).all()
    )

    return [
        BeneficiaryResponse(
            id=beneficiary.id,
            name=beneficiary.name,
            user_id=beneficiary.user_id,
            iban=beneficiary.iban,
            created_at=beneficiary.created_at,
        )
        for beneficiary in beneficiaries
    ]


@router.patch("/beneficiaries/{beneficiary_id}")
def update_beneficiary(
    body: BeneficiaryUpdateBody, beneficiary_id: UUID, session=Depends(get_session)
):
    beneficiary = (
        session.query(Beneficiary).filter(Beneficiary.id == beneficiary_id).first()
    )
    if not beneficiary:
        raise HTTPException(status_code=404, detail="Beneficiary not found")

    if not body.name:
        body.name = beneficiary.name

    if not body.account_id:
        body.account_id = beneficiary.account_id

    beneficiary.name = body.name
    beneficiary.account_id = body.account_id

    session.add(beneficiary)
    session.commit()
    session.refresh(beneficiary)

    return beneficiary


@router.delete("/beneficiaries/{beneficiary_id}")
def delete_beneficiary(beneficiary_id: UUID, session=Depends(get_session)):
    beneficiary = (
        session.query(Beneficiary).filter(Beneficiary.id == beneficiary_id).first()
    )
    if not beneficiary:
        raise HTTPException(status_code=404, detail="Beneficiary not found")

    session.delete(beneficiary)
    session.commit()

    return {"message": "Beneficiary deleted successfully"}
