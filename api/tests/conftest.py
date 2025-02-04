from fastapi.testclient import TestClient
from core.db import get_session
from main import app
from sqlmodel import create_engine, SQLModel, Session
import pytest


@pytest.fixture(scope="module")
def test_db():
    engine = create_engine("sqlite:///./test.db?check_same_thread=False")
    SQLModel.metadata.create_all(engine)
    yield engine
    SQLModel.metadata.drop_all(engine)


@pytest.fixture
def test_session(test_db):
    with Session(test_db) as session:
        yield session
        session.rollback()


@pytest.fixture
def client(test_db):
    def override_get_session():
        return Session(test_db)

    app.dependency_overrides[get_session] = override_get_session
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


@pytest.fixture
def auth_token(client):
    client.post(
        "/register",
        json={
            "email": "test.user@bank.com",
            "password": "SecurePass123!",
            "first_name": "Test",
            "last_name": "User",
        },
    )
    response = client.post(
        "/login", json={"email": "test.user@bank.com", "password": "SecurePass123!"}
    )
    return response.json()["token"]
