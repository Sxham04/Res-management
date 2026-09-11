from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import engine, get_db, Base
import models, schemas, auth

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# register a new user
@app.post("/register")
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="email already registered")
    new_user = models.User(
        name=user.name,
        email=user.email,
        password=auth.hash_password(user.password),
        role=user.role
    )
    db.add(new_user)
    db.commit()
    return {"message": "user registered successfully"}

# login and get token
@app.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user or not auth.verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="invalid credentials")
    token = auth.create_token({"id": db_user.id, "role": db_user.role})
    return {"access_token": token, "role": db_user.role}

# get all students (admin only)
@app.get("/students")
def get_students(db: Session = Depends(get_db), current_user=Depends(auth.require_admin)):
    students = db.query(models.User).filter(models.User.role == "student").all()
    return students

# delete a student (admin only)
@app.delete("/students/{student_id}")
def delete_student(student_id: int, db: Session = Depends(get_db), current_user=Depends(auth.require_admin)):
    student = db.query(models.User).filter(models.User.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="student not found")
    db.delete(student)
    db.commit()
    return {"message": "student deleted"}

# update student details (admin only)
@app.put("/students/{student_id}")
def update_student(student_id: int, user: schemas.UserCreate, db: Session = Depends(get_db), current_user=Depends(auth.require_admin)):
    student = db.query(models.User).filter(models.User.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="student not found")
    student.name = user.name
    student.email = user.email
    db.commit()
    return {"message": "student updated"}

# add a subject (admin only)
@app.post("/subjects")
def add_subject(subject: schemas.SubjectCreate, db: Session = Depends(get_db), current_user=Depends(auth.require_admin)):
    new_subject = models.Subject(name=subject.name)
    db.add(new_subject)
    db.commit()
    return {"message": "subject added"}

# get all subjects
@app.get("/subjects")
def get_subjects(db: Session = Depends(get_db), current_user=Depends(auth.get_current_user)):
    subjects = db.query(models.Subject).all()
    return subjects

# delete a subject (admin only)
@app.delete("/subjects/{subject_id}")
def delete_subject(subject_id: int, db: Session = Depends(get_db), current_user=Depends(auth.require_admin)):
    subject = db.query(models.Subject).filter(models.Subject.id == subject_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="subject not found")
    db.delete(subject)
    db.commit()
    return {"message": "subject deleted"}

# assign marks to a student (admin only)
@app.post("/results")
def add_result(result: schemas.ResultCreate, db: Session = Depends(get_db), current_user=Depends(auth.require_admin)):
    new_result = models.Result(
        student_id=result.student_id,
        subject_id=result.subject_id,
        marks=result.marks
    )
    db.add(new_result)
    db.commit()
    return {"message": "result added"}

# update a result (admin only)
@app.put("/results/{result_id}")
def update_result(result_id: int, result: schemas.ResultCreate, db: Session = Depends(get_db), current_user=Depends(auth.require_admin)):
    db_result = db.query(models.Result).filter(models.Result.id == result_id).first()
    if not db_result:
        raise HTTPException(status_code=404, detail="result not found")
    db_result.marks = result.marks
    db.commit()
    return {"message": "result updated"}

# delete a result (admin only)
@app.delete("/results/{result_id}")
def delete_result(result_id: int, db: Session = Depends(get_db), current_user=Depends(auth.require_admin)):
    db_result = db.query(models.Result).filter(models.Result.id == result_id).first()
    if not db_result:
        raise HTTPException(status_code=404, detail="result not found")
    db.delete(db_result)
    db.commit()
    return {"message": "result deleted"}

# get results for the logged in student
@app.get("/my-results")
def get_my_results(db: Session = Depends(get_db), current_user=Depends(auth.get_current_user)):
    results = db.query(models.Result).filter(models.Result.student_id == current_user.id).all()
    total = sum(r.marks for r in results)
    average = total / len(results) if results else 0
    return {"results": results, "average": round(average, 2)}