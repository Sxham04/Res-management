import React, { useState, useEffect } from 'react';
import api from './api';
import { useAuth } from './AuthContext';

function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [results, setResults] = useState([]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [subjectName, setSubjectName] = useState('');

  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [marks, setMarks] = useState('');

  const [editResultId, setEditResultId] = useState('');
  const [editMarks, setEditMarks] = useState('');

  const [message, setMessage] = useState('');

  const { logout } = useAuth();

  useEffect(() => {
    loadStudents();
    loadSubjects();
    loadResults();
  }, []);

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(''), 3000);
  };

  const loadStudents = async () => {
    try {
      const response = await api.get('/students');
      setStudents(response.data);
    } catch (error) {
      showMessage('failed to get students');
    }
  };

  const loadSubjects = async () => {
    try {
      const response = await api.get('/subjects');
      setSubjects(response.data);
    } catch (error) {
      showMessage('failed to get subjects');
    }
  };

  const loadResults = async () => {
    try {
      const response = await api.get('/results');
      setResults(response.data);
    } catch (error) {
      showMessage('failed to get results');
    }
  };

  const getStudentName = (id) => {
    for (let i = 0; i < students.length; i++) {
      if (students[i].id === id) return students[i].name;
    }
    return id;
  };

  const getSubjectName = (id) => {
    for (let i = 0; i < subjects.length; i++) {
      if (subjects[i].id === id) return subjects[i].name;
    }
    return id;
  };

  const handleAddStudent = async (event) => {
    event.preventDefault();
    try {
      await api.post('/register', { name, email, password, role: 'student' });
      showMessage('student registered successfully');
      setName('');
      setEmail('');
      setPassword('');
      loadStudents();
    } catch (error) {
      showMessage('failed to register student');
    }
  };

  const handleDeleteStudent = async (id) => {
    try {
      await api.delete('/students/' + id);
      showMessage('student deleted');
      loadStudents();
    } catch (error) {
      showMessage('failed to delete student');
    }
  };

  const handleAddSubject = async (event) => {
    event.preventDefault();
    try {
      await api.post('/subjects', { name: subjectName });
      showMessage('subject added');
      setSubjectName('');
      loadSubjects();
    } catch (error) {
      showMessage('failed to add subject');
    }
  };

  const handleDeleteSubject = async (id) => {
    try {
      await api.delete('/subjects/' + id);
      showMessage('subject deleted');
      loadSubjects();
    } catch (error) {
      showMessage('failed to delete subject');
    }
  };

  const handleAssignMarks = async (event) => {
    event.preventDefault();
    try {
      await api.post('/results', {
        student_id: parseInt(selectedStudent),
        subject_id: parseInt(selectedSubject),
        marks: parseFloat(marks)
      });
      showMessage('marks assigned');
      setMarks('');
      loadResults();
    } catch (error) {
      showMessage('failed to assign marks');
    }
  };

const handleUpdateMarks = async () => {
    try {
      await api.put('/results/' + editResultId, {
        marks: parseFloat(editMarks)
      });
      showMessage('marks updated');
      setEditResultId('');
      setEditMarks('');
      loadResults();
    } catch (error) {
      showMessage('failed to update marks');
    }
  };

  const handleDeleteResult = async () => {
    try {
      await api.delete('/results/' + editResultId);
      showMessage('result deleted');
      setEditResultId('');
      setEditMarks('');
      loadResults();
    } catch (error) {
      showMessage('failed to delete result');
    }
  };

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>
      <button className="logout" onClick={logout}>Log Out</button>

      {message && <div className="message">{message}</div>}

      {/* add student */}
      <div className="section">
        <h3>Add New Student</h3>
        <form onSubmit={handleAddStudent}>
          <div className="form-row">
            <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit">Add Student</button>
          </div>
        </form>

        <table>
          <thead>
            <tr><th>ID</th><th>Name</th><th>Email</th><th>Action</th></tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td><button className="delete" onClick={() => handleDeleteStudent(student.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* add subject */}
      <div className="section">
        <h3>Add Subject</h3>
        <form onSubmit={handleAddSubject}>
          <div className="form-row">
            <input placeholder="Subject Name" value={subjectName} onChange={(e) => setSubjectName(e.target.value)} required />
            <button type="submit">Add Subject</button>
          </div>
        </form>

        <table>
          <thead>
            <tr><th>ID</th><th>Name</th><th>Action</th></tr>
          </thead>
          <tbody>
            {subjects.map((subject) => (
              <tr key={subject.id}>
                <td>{subject.id}</td>
                <td>{subject.name}</td>
                <td><button className="delete" onClick={() => handleDeleteSubject(subject.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* assign marks */}
      <div className="section">
        <h3>Assign Marks</h3>
        <form onSubmit={handleAssignMarks}>
          <div className="form-row">
            <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)} required>
              <option value="">Select Student</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} required>
              <option value="">Select Subject</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <input type="number" placeholder="Marks" value={marks} onChange={(e) => setMarks(e.target.value)} required />
            <button type="submit">Save Marks</button>
          </div>
        </form>
      </div>

      {/* all results */}
      <div className="section">
        <h3>All Results</h3>
        <table>
          <thead>
            <tr><th>Result ID</th><th>Student</th><th>Subject</th><th>Marks</th></tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{getStudentName(r.student_id)}</td>
                <td>{getSubjectName(r.subject_id)}</td>
                <td>{r.marks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* edit or delete result */}
      <div className="section">
        <h3>Edit / Delete Result</h3>
        <p style={{ color: 'gray', marginBottom: '10px', fontSize: '13px' }}>enter the result id from the table above</p>
        <div className="form-row">
          <input type="number" placeholder="Result ID" value={editResultId} onChange={(e) => setEditResultId(e.target.value)} />
          <input type="number" placeholder="New Marks" value={editMarks} onChange={(e) => setEditMarks(e.target.value)} />
          <button onClick={handleUpdateMarks}>Update Marks</button>
          <button className="delete" onClick={handleDeleteResult}>Delete Result</button>
        </div>
      </div>

    </div>
  );
}

export default AdminDashboard;