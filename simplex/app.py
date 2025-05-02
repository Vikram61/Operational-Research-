from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/simplex", methods=["POST"])
def simplex_method():
    try:
        data = request.get_json()
        num_constraints = data["numConstraints"]
        num_variables = data["numVariables"]
        constraints = data["constraints"]
        objective = data["objective"]

        # Build initial tableau
        tableau = []

        for i in range(num_constraints):
            row = constraints[i]["coeffs"] + [0] * num_constraints + [constraints[i]["rhs"]]
            row[num_variables + i] = 1  # Add slack variable
            tableau.append(row)

        # Add objective function row (with negative coefficients)
        obj_row = [-c for c in objective] + [0] * (num_constraints + 1)
        tableau.append(obj_row)

        steps = [deepcopy_tableau(tableau)]  # Save initial tableau

        while True:
            last_row = tableau[-1]
            if all(x >= 0 for x in last_row[:-1]):
                break  # Optimal solution reached

            pivot_col = min(range(len(last_row) - 1), key=lambda j: last_row[j])

            ratios = []
            for i in range(len(tableau) - 1):
                if tableau[i][pivot_col] > 0:
                    ratios.append((tableau[i][-1] / tableau[i][pivot_col], i))
            if not ratios:
                return jsonify({"error": "Unbounded solution"}), 400

            pivot_row = min(ratios)[1]

            # Pivot operation
            pivot_element = tableau[pivot_row][pivot_col]
            tableau[pivot_row] = [x / pivot_element for x in tableau[pivot_row]]

            for i in range(len(tableau)):
                if i != pivot_row:
                    row_factor = tableau[i][pivot_col]
                    tableau[i] = [
                        tableau[i][j] - row_factor * tableau[pivot_row][j]
                        for j in range(len(tableau[0]))
                    ]

            steps.append(deepcopy_tableau(tableau))

        # Extract solution
        solution = [0] * num_variables
        for j in range(num_variables):
            col = [tableau[i][j] for i in range(len(tableau) - 1)]
            if col.count(1) == 1 and all(c == 0 for c in col if c != 1):
                row_index = col.index(1)
                solution[j] = tableau[row_index][-1]

        max_z = tableau[-1][-1]

        return jsonify({
            "maxZ": round(max_z, 4),
            "variables": [round(x, 4) for x in solution],
            "steps": steps
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


def deepcopy_tableau(t):
    return [row[:] for row in t]


if __name__ == "__main__":
    app.run(debug=True)
