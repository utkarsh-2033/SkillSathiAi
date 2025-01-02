from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS to allow communication with frontend

# Load the pre-trained ML model
MODEL_PATH = "model_pipeline.pkl"
model = joblib.load(MODEL_PATH)

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "SkillSathiAI backend is running!"})

# Endpoint for predictions
@app.route("/predict", methods=["POST"])
def predict():
    try:
        # Get JSON data from the request
        data = request.json
        
        # Check if data is present
        if not data:
            return jsonify({"error": "No input data provided"}), 400
        
        # **Validate the input data format to match the expected structure**
        required_keys = ["score", "time_taken_avg", "difficulty_avg", "skill_name", "level"]
        missing_keys = [key for key in required_keys if key not in data]
        
        if missing_keys:
            return jsonify({"error": f"Missing keys: {', '.join(missing_keys)}"}), 400
        
        # **Convert the input data into a DataFrame**
        input_data = pd.DataFrame(data)
        
        # **Handle any unexpected or malformed data (e.g., non-numeric values)**
        # You can add more robust checks for data types depending on the model input requirements.
        if not all(isinstance(i, (int, float)) for i in input_data["score"]):
            return jsonify({"error": "Invalid data type in 'score' field. Must be numeric."}), 400
        
        # **Make predictions using the model**
        predictions = model.predict(input_data)
        
        # **Build the response including predictions and the processed input data for transparency**
        response = {
            "predictions": predictions.tolist(),  # Convert predictions to a serializable format
            "input_data": data  # Include input data for debugging and tracking
        }
        
        return jsonify(response)

    except Exception as e:
        # **Improved error handling**
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

# Run the Flask app
if __name__ == "__main__":
    app.run(debug=True)