import React, { useState, useEffect } from 'react';
import api from './api';
import { useAuth } from './AuthContext';

function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [subjectName, setSubjectName] = useState('');

  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [marks, setMarks] = useState('');

  // for editing an existing result
  const [editResultId, setEditResultId] = useState(null);
  const [editMarks, setEditMarks] = useState('');

  const { logout } = useAuth();

  useEffect(() => {
    loadStudents();
    loadSubjects();
  }, []);

  const loadStudents = async () => {
    try {
      const response = await api.get('/students');
      setStudents(response.data);
    } catch (error) {
      alert('failed to get students');
    }
  };

  const loadSubjects = async () => {
    try {
      const response = await api.get('/subjects');
      setSubjects(response.data);
    } catch (error) {
      alert('failed to get subjects');
    }
  };

  const handleAddStudent = async (event) => {
    event.preventDefault();
    try {
      await api.post('/register', {
        name: name,
        email: email,
        password: password,
        role: 'student'
      });
      alert('student registered');
      setName('');
      setEmail('');
      setPassword('');
      loadStudents();
    } catch (error) {
      alert('failed to register student');
    }
  };

  const handleDeleteStudent = async (id) => {
    try {
      await api.delete('/students/' + id);
      loadStudents();
    } catch (error) {
      alert('failed to delete student');
    }
  };

  const handleAddSubject = async (event) => {
    event.preventDefault();
    try {
      await api.post('/subjects', { name: subjectName });
      setSubjectName('');
      loadSubjects();
    } catch (error) {
      alert('failed to add subject');
    }
  };

  const handleDeleteSubject = async (id) => {
    try {
      await api.delete('/subjects/' + id);
      loadSubjects();
    } catch (error) {
      alert('failed to delete subject');
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
      alert('marks assigned');
      setMarks('');
    } catch (error) {
      alert('failed to assign marks');
    }
  };

  // save updated marks for a result
  const handleUpdateMarks = async (resultId) => {
    try {
      await api.put('/results/' + resultId, {
        student_id: parseInt(selectedStudent),
        subject_id: parseInt(selectedSubject),
        marks: parseFloat(editMarks)
      });
      alert('marks updated');
      setEditResultId(null);
      setEditMarks('');
    } catch (error) {
      alert('failed to update marks');
    }
  };

  const handleDeleteResult = async (id) => {
    try {
      await api.delete('/results/' + id);
      alert('result deleted');
    } catch (error) {
      alert('failed to delete result');
    }
  };

  return (
    <div style={{ margin: '30px auto', width: '700px' }}>
      <h2>Admin Dashboard</h2>
      <button onClick={logout}>Log Out</button>

      {/* add student */}
      <div style={{ marginTop: '30px' }}>
        <h3>Add New Student</h3>
        <form onSubmit={handleAddStudent}>
          <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit">Add Student</button>
        </form>

        <table border="1" cellPadding="8" style={{ marginTop: '10px', width: '100%' }}>
          <thead>
            <tr><th>ID</th><th>Name</th><th>Email</th><th>Action</th></tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>
                  <button onClick={() => handleDeleteStudent(student.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* add subject */}
      <div style={{ marginTop: '30px' }}>
        <h3>Add Subject</h3>
        <form onSubmit={handleAddSubject}>
          <input placeholder="Subject Name" value={subjectName} onChange={(e) => setSubjectName(e.target.value)} required />
          <button type="submit">Add Subject</button>
        </form>

        <table border="1" cellPadding="8" style={{ marginTop: '10px', width: '100%' }}>
          <thead>
            <tr><th>ID</th><th>Name</th><th>Action</th></tr>
          </thead>
          <tbody>
            {subjects.map((subject) => (
              <tr key={subject.id}>
                <td>{subject.id}</td>
                <td>{subject.name}</td>
                <td>
                  <button onClick={() => handleDeleteSubject(subject.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* assign marks */}
      <div style={{ marginTop: '30px' }}>
        <h3>Assign Marks</h3>
        <form onSubmit={handleAssignMarks}>
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
        </form>
      </div>

      {/* edit or delete a result by result id */}
      <div style={{ marginTop: '30px' }}>
        <h3>Edit / Delete Result</h3>
        <p style={{ color: 'gray' }}>enter the result id to edit or delete it</p>

        <input
          type="number"
          placeholder="Result ID"
          value={editResultId || ''}
          onChange={(e) => setEditResultId(e.target.value)}
        />
        <input
          type="number"
          placeholder="New Marks"
          value={editMarks}
          onChange={(e) => setEditMarks(e.target.value)}
        />
        <button onClick={() => handleUpdateMarks(editResultId)}>Update Marks</button>
        <button onClick={() => handleDeleteResult(editResultId)} style={{ marginLeft: '10px' }}>Delete Result</button>
      </div>

    </div>
  );
}

export default AdminDashboard;