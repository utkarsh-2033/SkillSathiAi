from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import json
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# Initialize the Flask app and CORS
app = Flask(__name__)
CORS(app)

# Load the course data
df1 = pd.read_csv("coursera_updated.csv")
df2 = pd.read_csv("udemy_business.csv")

# Add source columns
df1['source'] = 'COURSERA'
df2['source'] = 'UDEMY'

# Combine the dataframes
df = pd.concat([df1, df2], ignore_index=True)

# Clean course titles
df['clean_course_title'] = df['title'].fillna('').str.lower()

# Load the Sentence Transformer model
sentence_model = SentenceTransformer('all-MiniLM-L6-v2')

# Generate embeddings for course titles
df['title_embedding'] = list(sentence_model.encode(df['clean_course_title'], show_progress_bar=True))


@app.route('/course-recommendation', methods=['POST'])
def course_recommendation():
    request_data = request.json
    prompt = request_data.get('prompt', '')
    num_of_rec = request_data.get('num_of_rec', 10)

    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400

    try:
        # Generate embedding for the user's prompt
        prompt_embedding = sentence_model.encode([prompt])[0]

        # Calculate similarity scores
        df['similarity_scores'] = df['title_embedding'].apply(
            lambda x: cosine_similarity([x], [prompt_embedding]).flatten()[0]
        )

        # Normalize ratings for hybrid scoring
        df['Stars'] = pd.to_numeric(df['Stars'], errors='coerce')
        df['Stars_normalized'] = df['Stars'] / df['Stars'].max()

        # Calculate hybrid score
        df['hybrid_score'] = (0.7 * df['similarity_scores']) + (0.3 * df['Stars_normalized'])

        # Filter and sort courses
        df_filtered = df[df['hybrid_score'] > 0.5]
        df_sorted = df_filtered.sort_values(by='hybrid_score', ascending=False)

        # Separate sorted courses by source
        from_courses1 = df_sorted[df_sorted['source'] == 'COURSERA']
        from_courses2 = df_sorted[df_sorted['source'] == 'UDEMY']

        # Calculate half recommendations from each source
        half_num_of_rec = num_of_rec // 2

        # Select from each source dynamically
        rec1 = from_courses1.head(half_num_of_rec)
        rec2 = from_courses2.head(half_num_of_rec)

        # Fill remaining slots from either source if one has fewer courses
        remaining_slots = num_of_rec - (len(rec1) + len(rec2))
        if remaining_slots > 0:
            if len(rec1) < half_num_of_rec:
                rec2 = pd.concat([rec2, from_courses2.iloc[len(rec2):len(rec2) + remaining_slots]])
            else:
                rec1 = pd.concat([rec1, from_courses1.iloc[len(rec1):len(rec1) + remaining_slots]])

        # Combine recommendations
        combined_recommendations = pd.concat([rec1, rec2]).head(num_of_rec)
        combined_recommendations = combined_recommendations.sort_values(by=['hybrid_score', 'Stars'], ascending=False)

        # Build the output DataFrame
        rec_df = pd.DataFrame()
        rec_df['Title'] = combined_recommendations['title']
        rec_df['URL'] = combined_recommendations.get('URL', '')
        rec_df['Description'] = combined_recommendations.get('Summary', '')
        rec_df['Stars'] = combined_recommendations['Stars']
        rec_df['Source'] = combined_recommendations['source']
        rec_df['hybrid_score'] = combined_recommendations['hybrid_score']

        # Convert results to JSON
        result_json = rec_df.to_dict(orient='records')
        return jsonify(result_json), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
