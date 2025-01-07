import sys
import google.generativeai as genai

genai.configure(api_key="AIzaSyAfxS-lwhIdYxC_bEqImeD5EPKyqDB2_PY")
model = genai.GenerativeModel("gemini-1.5-flash")

def get_learning_pathway(skill, level, predicted_proficiency_score, score, feedback_criteria):
    prompt = f"""
    This is the result of a skill quiz given by the user. Based on the following data:
    - Skill : {skill}
    - Level : {level}
    - Predicted Proficiency Score : {predicted_proficiency_score}
    - Score : {score} out of 10
    - Feedback Criteria : {feedback_criteria}
    
    Provide detailed feedback for the user. Include:
    1. An analysis of the user's performance.
    2. Suggestions for improvement.
    3. Recommended resources to enhance the skills.
    Include the URLs of the recommended resources and generate a timeline to complete them.
    """
    response = model.generate_content(prompt)
    return response.text

if __name__ == "__main__":
    skill = sys.argv[1]
    level = sys.argv[2]
    predicted_proficiency_score = float(sys.argv[3])
    score = int(sys.argv[4])
    feedback_criteria = sys.argv[5]

    feedback = get_learning_pathway(skill, level, predicted_proficiency_score, score, feedback_criteria)
    print(feedback)
