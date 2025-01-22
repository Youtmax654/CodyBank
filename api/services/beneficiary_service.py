from sqlalchemy.orm import Session
from api.models.User import Beneficiary
from api.models.Account import Account
from api.schemas.beneficiary import CreateBeneficiary

def create_beneficiary(session: Session, beneficiary_data: CreateBeneficiary):
    source_account = session.query(Account).filter(Account.id == beneficiary_data.account_id).first()
    if not source_account:
        raise ValueError("Source account not found")

    beneficiary_account = session.query(Account).filter(Account.id == beneficiary_data.beneficiary_account_id).first()
    if not beneficiary_account:
        raise ValueError("Beneficiary account not found")

    user_accounts = session.query(Account).filter(Account.user_id == source_account.user_id).all()
    
    if beneficiary_account.user_id == source_account.user_id:
        raise ValueError("Beneficiary account cannot be one of the user's own accounts")

    if beneficiary_data.account_id == beneficiary_data.beneficiary_account_id:
        raise ValueError("Source and beneficiary accounts cannot be the same")

    existing_beneficiary = (
        session.query(Beneficiary)
        .filter(
            Beneficiary.account_id == beneficiary_data.account_id,
            Beneficiary.beneficiary_account_id == beneficiary_data.beneficiary_account_id
        )
        .first()
    )
    if existing_beneficiary:
        raise ValueError("Beneficiary already exists")

    new_beneficiary = Beneficiary(
        name=beneficiary_data.name,
        account_id=beneficiary_data.account_id,
        beneficiary_account_id=beneficiary_data.beneficiary_account_id
    )
    
    session.add(new_beneficiary)
    session.commit()
    session.refresh(new_beneficiary)
    
    return new_beneficiary

def get_beneficiaries(session: Session, account_id: int):
    return session.query(Beneficiary).filter(Beneficiary.account_id == account_id).all()
