import React, { useState } from 'react';
import axios from 'axios';

const BigMSolver = () => {
  const [objectiveCoeffs, setObjectiveCoeffs] = useState([1, 1]);
  const [constraintMatrix, setConstraintMatrix] = useState([
    [2, 1],
    [1, 2],
  ]);
  const [rhsValues, setRhsValues] = useState([6, 6]);
  const [output, setOutput] = useState('');
  const [iterationTables, setIterationTables] = useState([]);

  // Handle input change for objective coefficients
  const handleObjectiveChange = (e, index) => {
    const newObjectiveCoeffs = [...objectiveCoeffs];
    newObjectiveCoeffs[index] = parseFloat(e.target.value);
    setObjectiveCoeffs(newObjectiveCoeffs);
  };

  // Handle input change for constraint matrix
  const handleMatrixChange = (e, rowIndex, colIndex) => {
    const newConstraintMatrix = [...constraintMatrix];
    newConstraintMatrix[rowIndex][colIndex] = parseFloat(e.target.value);
    setConstraintMatrix(newConstraintMatrix);
  };

  // Handle input change for RHS values
  const handleRhsChange = (e, index) => {
    const newRhsValues = [...rhsValues];
    newRhsValues[index] = parseFloat(e.target.value);
    setRhsValues(newRhsValues);
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/bigm', {
        objective_coeffs: objectiveCoeffs,
        constraint_matrix: constraintMatrix,
        rhs_values: rhsValues,
      });
      setOutput(response.data.optimal_value);
      setIterationTables(response.data.iteration_tables);
    } catch (error) {
      console.error('Error fetching Big M solution:', error);
      setOutput('Error: Could not fetch result from backend.');
      setIterationTables([]);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Big M Method Solver</h1>

      {/* Objective Coefficients */}
      <div>
        <h3>Objective Coefficients</h3>
        {objectiveCoeffs.map((coeff, index) => (
          <div key={index}>
            <label>c{index + 1}:</label>
            <input
              type="number"
              value={coeff}
              onChange={(e) => handleObjectiveChange(e, index)}
            />
          </div>
        ))}
      </div>

      {/* Constraint Matrix */}
      <div>
        <h3>Constraint Matrix</h3>
        {constraintMatrix.map((row, rowIndex) => (
          <div key={rowIndex}>
            {row.map((value, colIndex) => (
              <input
                key={colIndex}
                type="number"
                value={value}
                onChange={(e) => handleMatrixChange(e, rowIndex, colIndex)}
                style={{ margin: '5px' }}
              />
            ))}
          </div>
        ))}
      </div>

      {/* RHS Values */}
      <div>
        <h3>Right Hand Side (RHS) Values</h3>
        {rhsValues.map((value, index) => (
          <div key={index}>
            <label>b{index + 1}:</label>
            <input
              type="number"
              value={value}
              onChange={(e) => handleRhsChange(e, index)}
            />
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <button onClick={handleSubmit}>Submit</button>

      {/* Display Output */}
      <div>
        <h3>Optimal Value: {output}</h3>
      </div>

      {/* Display Iteration Tables */}
      <div>
        <h3>Iteration Tables</h3>
        {iterationTables.length > 0 ? (
          iterationTables.map((table, index) => (
            <div key={index}>
              <h4>Iteration {index + 1}</h4>
              <table border="1">
                <thead>
                  <tr>
                    <th>Matrix</th>
                    <th>RHS</th>
                  </tr>
                </thead>
                <tbody>
                  {table.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, colIndex) => (
                        <td key={colIndex}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        ) : (
          <p>No iteration data available.</p>
        )}
      </div>
    </div>
  );
};

export default BigMSolver;
