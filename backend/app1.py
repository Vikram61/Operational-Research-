from flask import Flask, request, jsonify
import subprocess
from flask_cors import CORS




app = Flask(__name__)
CORS(app)


@app.route('/api/schedule', methods=['POST'])
def schedule():
    try:
        data = request.json
        machines = data.get('machines')
        jobs = data.get('jobs')
        matrix = data.get('matrix')

        # Format input for the C++ executable
        input_str = f"{machines}\n{jobs}\n"
        for row in matrix:
            input_str += ' '.join(map(str, row)) + '\n'

        # Run the C++ executable and feed the input
        process = subprocess.Popen(
            ['./scheduler_exec'],  # path to compiled C++ binary
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )

        output, error = process.communicate(input=input_str)

        if process.returncode != 0:
            return jsonify({"error": error}), 500

        return output, 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
