import sys
import google.generativeai as genai

# Configure the generative AI
genai.configure(api_key="AIzaSyAfxS-lwhIdYxC_bEqImeD5EPKyqDB2_PY")
model = genai.GenerativeModel("gemini-1.5-flash")

# Function to get learning pathway feedback
def get_learning_pathway(career_goal, skills_and_frameworks):
    prompt = f"""
Below is the career goal chosen by the user and the skills and frameworks required for their chosen career goal.  
Career Goal: "{career_goal}"
Skills and Frameworks: {skills_and_frameworks}
Generate a detailed and actionable learning plan for users based on their career goals and associated skills with the following components:

1. *Skill Prioritization*: Organize the skills and frameworks in the optimal order for learning, ensuring they build upon one another.
2. *Learning Path*:-in tabular form- with these five columns| Skill/Framework | Importance | Key Concepts & Applications | Week-wise Learning Objectives | Resources |- For each skill or framework: 
   - Briefly explain its importance for the career goal "{career_goal}".
   - Highlight key concepts and practical applications the user should master concisely.
   - Provide week-wise learning objectives.
3. *Capstone Project*: Recommend a project idea that integrates all the skills and frameworks to demonstrate the user's capabilities effectively.
4. *Timeline Summary*: Summarize the realistic week-wise timeline for mastering each skill and include the capstone project at the end.

"""
    response = model.generate_content(prompt)
    return response.text

def main():
    # Parse career goal and skills from command-line arguments
    if len(sys.argv) < 3:
        print("Usage: python script.py <career_goal> <skills>")
        sys.exit(1)
    
    career_goal = sys.argv[1]
    skills = sys.argv[2]
    skills_list = skills.split(",")  # Convert comma-separated string to list

    # Generate learning pathway
    response = get_learning_pathway(career_goal, skills_list)
    
    # Print the response for the Node.js process to capture
    print(response)

if __name__ == "__main__":
    main()
