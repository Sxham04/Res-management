import React, { useState, useEffect } from 'react';
import api from './api';
import { useAuth } from './AuthContext';
import './StudentDashboard.css';

function StudentDashboard() {
  const [results, setResults] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [average, setAverage] = useState(0);
  const { logout } = useAuth();

  // get results and subjects when page loads
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // get results of student
      const resultRes = await api.get('/my-results');
      setResults(resultRes.data.results);
      setAverage(resultRes.data.average);

      // get subject list to read names
      const subjectRes = await api.get('/subjects');
      setSubjects(subjectRes.data);
    } catch (error) {
      alert('error loading data');
    }
  };

  // find name of subject from id
  const getSubjectName = (subjectId) => {
    for (let i = 0; i < subjects.length; i++) {
      if (subjects[i].id === subjectId) {
        return subjects[i].name;
      }
    }
    return 'Subject ' + subjectId;
  };

  return (
    <div className="dashboard-container">
      <h2>Student Dashboard</h2>
      <button onClick={logout}>Log Out</button>

      <h3>My Marks</h3>
      <table className="results-table">
        <thead>
          <tr>
            <th>Subject</th>
            <th>Marks</th>
          </tr>
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

      <h3>Average Marks: {average}</h3>
    </div>
  );
}

export default StudentDashboard;