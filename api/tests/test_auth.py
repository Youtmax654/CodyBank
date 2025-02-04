from fastapi import status
from uuid import UUID


class TestAuth:
    def test_full_registration_flow(self, client):
        # Test d'inscription valide
        response = client.post(
            "/register",
            json={
                "email": "new.user@domain.com",
                "password": "Str0ngP@ssword!",
                "first_name": "Émilie",
                "last_name": "Durand",
            },
        )
        assert response.status_code == status.HTTP_201_CREATED
        assert UUID(response.json()["id"]) is not None

    def test_login_failure(self, client):
        # Test avec mot de passe incorrect
        response = client.post(
            "/login",
            json={"email": "nonexistent@test.com", "password": "WrongPassword123"},
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_password_security(self, client):
        # Test mot de passe trop faible
        response = client.post(
            "/register",
            json={
                "email": "weak.pass@test.com",
                "password": "1234",
                "first_name": "Test",
                "last_name": "User",
            },
        )
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
