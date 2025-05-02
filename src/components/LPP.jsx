import React, { useState } from "react";
import axios from "axios";


const LPP = () => {
  const [numVariables, setNumVariables] = useState(2);
  const [numConstraints, setNumConstraints] = useState(2);
  const [constraints, setConstraints] = useState([]);
  const [objective, setObjective] = useState([]);
  const [output, setOutput] = useState(null);

  // Initialize input fields
  const handleSetup = () => {
    setConstraints(
      Array.from({ length: numConstraints }, () => ({
        coeffs: Array(numVariables).fill(0),
        rhs: 0,
      }))
    );
    setObjective(Array(numVariables).fill(0));
    setOutput(null);
  };

  const handleConstraintChange = (i, j, value) => {
    const updated = [...constraints];
    updated[i].coeffs[j] = parseFloat(value);
    setConstraints(updated);
  };

  const handleRHSChange = (i, value) => {
    const updated = [...constraints];
    updated[i].rhs = parseFloat(value);
    setConstraints(updated);
  };

  const handleObjectiveChange = (j, value) => {
    const updated = [...objective];
    updated[j] = parseFloat(value);
    setObjective(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/simplex", {
        numVariables,
        numConstraints,
        constraints,
        objective,
      });

      setOutput(res.data);
    } catch (err) {
      console.error("Error with the backend request:", err);
    }
  };

  return (
    <div className="lpp-container">
      <div className="lpp-form">
        <h2>Linear Programming Solver (Simplex)</h2>

        <div className="form-row">
          <div className="lpp-input-group">
            <label className="lpp-label" htmlFor="numVariables">
              Number of Variables:
            </label>
            <input
              id="numVariables"
              className="lpp-input"
              type="number"
              value={numVariables}
              min="1"
              onChange={(e) => setNumVariables(parseInt(e.target.value))}
              placeholder=" "
            />
          </div>

          <div className="lpp-input-group">
            <label className="lpp-label" htmlFor="numConstraints">
              Number of Constraints:
            </label>
            <input
              id="numConstraints"
              className="lpp-input"
              type="number"
              value={numConstraints}
              min="1"
              onChange={(e) => setNumConstraints(parseInt(e.target.value))}
              placeholder=" "
            />
          </div>
        </div>

        <button className="lpp-button" onClick={handleSetup}>
          Set Up Inputs
        </button>

        {constraints.length > 0 && (
          <form onSubmit={handleSubmit}>
            <h3>Constraints</h3>
            {constraints.map((con, i) => (
              <div key={i}>
                {con.coeffs.map((c, j) => (
                  <div className="lpp-input-group" key={j}>
                    <input
                      type="number"
                      className="lpp-input"
                      placeholder={`x${j + 1}`}
                      value={c}
                      onChange={(e) => handleConstraintChange(i, j, e.target.value)}
                    />
                  </div>
                ))}
                ≤
                <input
                  type="number"
                  className="lpp-input"
                  value={con.rhs}
                  onChange={(e) => handleRHSChange(i, e.target.value)}
                />
              </div>
            ))}

            <h3>Objective Function (Maximize Z)</h3>
            {objective.map((c, j) => (
              <div className="lpp-input-group" key={j}>
                <input
                  type="number"
                  className="lpp-input"
                  placeholder={`x${j + 1}`}
                  value={c}
                  onChange={(e) => handleObjectiveChange(j, e.target.value)}
                />
              </div>
            ))}

            <button type="submit" className="lpp-button">
              Solve
            </button>
          </form>
        )}
      </div>

      {output && (
        <div className="lpp-output">
          <h2>Optimal Solution</h2>
          <p>
            Max Z = <strong>{output.maxZ}</strong>
          </p>
          <p>
            Variable values:{" "}
            {output.variables.map((val, i) => (
              <span key={i}>
                x{i + 1} = {val}{" "}
              </span>
            ))}
          </p>

          <h3>Simplex Iterations</h3>
          {output.steps.map((table, stepIdx) => (
            <div key={stepIdx} style={{ marginBottom: "20px" }}>
              <h4>Iteration {stepIdx + 1}</h4>
              <table border="1" cellPadding="5">
                <tbody>
                  {table.map((row, rowIdx) => (
                    <tr key={rowIdx}>
                      {row.map((cell, cellIdx) => (
                        <td key={cellIdx}>{parseFloat(cell).toFixed(2)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LPP;
