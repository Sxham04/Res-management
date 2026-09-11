import React, { useState, useEffect } from 'react';
import api from './api';
import { useAuth } from './AuthContext';

function StudentDashboard() {
  const [results, setResults] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [average, setAverage] = useState(0);
  const { logout } = useAuth();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const resultRes = await api.get('/my-results');
      setResults(resultRes.data.results);
      setAverage(resultRes.data.average);

      const subjectRes = await api.get('/subjects');
      setSubjects(subjectRes.data);
    } catch (error) {
      console.log('error loading data');
    }
  };

  const getSubjectName = (subjectId) => {
    for (let i = 0; i < subjects.length; i++) {
      if (subjects[i].id === subjectId) return subjects[i].name;
    }
    return 'subject ' + subjectId;
  };

  return (
    <div className="container">
      <h2>Student Dashboard</h2>
      <button className="logout" onClick={logout}>Log Out</button>

      <div className="section">
        <h3>My Results</h3>
        {results.length === 0 ? (
          <p style={{ color: 'gray', fontSize: '14px' }}>no results found</p>
        ) : (
          <table>
            <thead>
              <tr><th>Subject</th><th>Marks</th></tr>
            </thead>
            <tbody>
              {results.map((item) => (
                <tr key={item.id}>
                  <td>{getSubjectName(item.subject_id)}</td>
                  <td>{item.marks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <p className="average">Average Marks: {average}</p>
      </div>
    </div>
  );
}

export default StudentDashboard;