from flask import Flask, request, jsonify
import utils as ut
import metric as mt
from flask_cors import CORS
import subprocess

app = Flask(__name__)
CORS(app, resources={r"/Recognize": {"origins": "http://localhost:3000"}})
@app.route('/Recognize', methods=['POST'])
def predict():
    try:
        text = request.form.get('text')
        audio_file = request.files.get('audio')

        if not text or not audio_file:
            return jsonify({"error": "Missing 'text' or 'audio'"}), 400

        ut.prepare_data(audio_file, text)
        subprocess.call(["bash","/home/maksymm/my/kaldi/egs/a_my/start.sh"])
        result_gop = mt.run_gop(text)

        return result_gop, 200

    except subprocess.CalledProcessError as e:
        return jsonify({
            "error": "Command execution failed",
            "stderr": e.stderr,
            "stdout": e.stdout
        }), 500

    except Exception as e:
        return jsonify({
            "error": "An unexpected error occurred",
            "message": str(e)
        }), 500

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)
