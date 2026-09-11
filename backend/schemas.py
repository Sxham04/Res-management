from pydantic import BaseModel

class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    role: str = "student"

class UserLogin(BaseModel):
    email: str
    password: str

class SubjectCreate(BaseModel):
    name: str

class ResultCreate(BaseModel):
    student_id: int
    subject_id: int
    marks: float

class ResultOut(BaseModel):
    subject_id: int
    marks: float

    class Config:
        from_attributes = True