# from sqlmodel import SQLModel, Field
# from typing import Optional
# from datetime import datetime


# class TransactionLog(SQLModel, table=True):
#     id: int = Field(default=None, primary_key=True)
#     transaction_id: int = Field(foreign_key="transaction.id")
#     action: str = Field(nullable=False)
#     timestamp: datetime = Field(default_factory=datetime.now)
