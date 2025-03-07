# from flask import Flask, send_file
# from flask_cors import CORS

# app = Flask(__name__)
# CORS(app)  # Allow cross-origin requests

# @app.route('/get-pdf', methods=['GET'])
# def get_pdf():
#     pdf_path = "health.pdf"  # Direct path to the PDF in the same folder
#     return send_file(pdf_path, mimetype='application/pdf', as_attachment=False)

# if __name__ == '__main__':
#     app.run(debug=True)
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS

fall_detected = True  # Always True for testing

@app.route('/fall_detect', methods=['GET'])
def fall_detection():
    return jsonify({"fall_detected": fall_detected})

@app.route('/send_hospitals', methods=['POST'])
def receive_hospitals():
    data = request.json
    print("Received hospital data:", data)
    return jsonify({"message": "Hospital data received successfully"}), 200

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
