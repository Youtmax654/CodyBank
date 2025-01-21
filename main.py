from fastapi import FastAPI
from utils.auth import CreateUser, create_user
from utils.db import create_db_and_tables

create_db_and_tables()

app = FastAPI()

@app.post("/register")
def create_user(body: CreateUser):
    create_user(body)