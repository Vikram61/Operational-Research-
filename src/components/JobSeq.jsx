import React, { useState, useEffect } from 'react';
import axios from 'axios';

const JobSeq = () => {
  const [machines, setMachines] = useState(3);
  const [jobs, setJobs] = useState(4);
  const [matrix, setMatrix] = useState([
    [2, 3, 4, 5],
    [1, 2, 3, 4],
    [3, 4, 2, 1]
  ]);
  const [output, setOutput] = useState('');

  const updateMatrix = (newMachines, newJobs) => {
    setMatrix((prevMatrix) =>
      Array.from({ length: newMachines }, (_, i) =>
        Array.from({ length: newJobs }, (_, j) => prevMatrix[i]?.[j] ?? 0)
      )
    );
  };

  useEffect(() => {
    updateMatrix(machines, jobs);
  }, [machines, jobs]);

  const handleMatrixChange = (e, row, col) => {
    const updated = [...matrix];
    updated[row][col] = parseInt(e.target.value, 10);
    setMatrix(updated);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/schedule', {
        machines,
        jobs,
        matrix,
      });
      setOutput(response.data);
    } catch (error) {
      console.error('Error connecting to backend', error);
      setOutput('Could not connect to backend.');
    }
  };
  return (
    <div style={styles.container}>
      <h1 style={styles.header}><u>Job Scheduling System</u></h1>

      <div style={styles.inputGroup}>
        <label style={styles.label}>
          Number of Machines:
          <input
            type="number"
            value={machines}
            onChange={(e) => setMachines(Number(e.target.value))}
            min="1"
            style={styles.input}
          />
        </label>

        <label style={styles.label}>
          Number of Jobs:
          <input
            type="number"
            value={jobs}
            onChange={(e) => setJobs(Number(e.target.value))}
            min="1"
            style={styles.input}
          />
        </label>
      </div>
      <div>
        <h3 style={styles.subheading}>Matrix (Processing Times)</h3>
        {matrix.map((row, rowIndex) => (
          <div key={rowIndex} style={styles.row}>
            <strong style={styles.machineLabel}>Machine {rowIndex + 1}:</strong>
            {row.map((value, colIndex) => (
              <input
                key={colIndex}
                type="number"
                value={value}
                onChange={(e) => handleMatrixChange(e, rowIndex, colIndex)}
                style={styles.matrixInput}
              />
            ))}
          </div>
        ))}
      </div>

    
      <div style={{ marginTop: '20px' }}>
        <button style={styles.button} onClick={handleSubmit}>
          Submit
        </button>
      </div>

      {output && (
        <div style={styles.outputBox}>
          <h3 style={styles.outputTitle}>Output</h3>
          <pre style={styles.outputText}>{output}</pre>
        </div>
      )}
    </div>
  );
};


const styles = {
  container: {
    maxWidth: '800px',
    margin: '40px auto',
    padding: '30px',
    borderRadius: '12px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    textAlign: 'center',
    fontSize: '28px',
    marginBottom: '30px',
    color: '#333',
  },
  inputGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '20px',
    marginBottom: '25px',
  },
  label: {
    flex: 1,
    fontSize: '16px',
    color: '#444',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginTop: '8px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    transition: 'border-color 0.3s ease',
  },
  subheading: {
    fontSize: '18px',
    marginBottom: '10px',
    color: '#222',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  },
  machineLabel: {
    width: '120px',
    color: '#555',
  },
  matrixInput: {
    width: '60px',
    padding: '8px',
    marginRight: '8px',
    borderRadius: '6px',
    border: '1px solid #bbb',
    transition: 'border-color 0.3s ease',
  },
  button: {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '12px 20px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
  },
  outputBox: {
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    padding: '20px',
    marginTop: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  },
  outputTitle: {
    fontSize: '18px',
    marginBottom: '10px',
    color: '#222',
  },
  outputText: {
    fontSize: '15px',
    whiteSpace: 'pre-wrap',
    lineHeight: '1.6',
    color: '#333',
  },
};

export default JobSeq;
