from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import json
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import logging
import os
print("Render will bind to this port:", os.environ.get("PORT"))


# Initialize the Flask app and CORS
app = Flask(__name__)
CORS(app)

# Load the course data
df1 = pd.read_csv("Coursera.csv")
df2 = pd.read_csv("udemy.csv")

# Add source columns
df1['source'] = 'COURSERA'
df2['source'] = 'UDEMY'

# Combine the dataframes
df = pd.concat([df1, df2], ignore_index=True)

# Clean course titles
df['clean_course_title'] = df['title'].fillna('').str.lower()

# Load the Sentence Transformer model

# Load the model (still needed for prompt embedding)
sentence_model = SentenceTransformer('all-MiniLM-L6-v2')

# Load precomputed embeddings
df['title_embedding'] = list(np.load("embeddings.npy", allow_pickle=True))

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
        # rec_df['Description'] = combined_recommendations.get('Summary', '')
        rec_df['Stars'] = combined_recommendations['Stars']
        rec_df['Source'] = combined_recommendations['source']
        rec_df['hybrid_score'] = combined_recommendations['hybrid_score']

        # Convert results to JSON
        result_json = rec_df.to_dict(orient='records')
        return jsonify(result_json), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/book-recommendation', methods=['POST'])
def book_recommendation():
    request_data = request.json
    prompt = request_data.get('prompt', '')
    num_of_rec = request_data.get('num_of_rec', 10)

    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400

    try:
        # Read the book data
        df_books = pd.read_csv("Book.csv")

        # Clean the book titles
        df_books['clean_book_title'] = df_books['title'].fillna('').str.lower()

        # Generate embeddings for book titles
        sentence_model_books = SentenceTransformer('all-MiniLM-L12-v2', device='cpu')
        df_books['title_embedding'] = list(sentence_model_books.encode(df_books['clean_book_title'], show_progress_bar=True))

        # Generate embedding for the user's prompt
        prompt_embedding = sentence_model_books.encode([prompt])[0]

        # Calculate similarity scores
        df_books['similarity_scores'] = df_books['title_embedding'].apply(
            lambda x: cosine_similarity([x], [prompt_embedding]).flatten()[0]
        )

        # Normalize ratings for hybrid scoring
        df_books['Stars'] = pd.to_numeric(df_books['Stars'], errors='coerce')
        df_books['Stars_normalized'] = df_books['Stars'] / df_books['Stars'].max()

        # Calculate hybrid score
        df_books['hybrid_score'] = (0.7 * df_books['similarity_scores']) + (0.3 * df_books['Stars_normalized'])

        # Filter and sort books
        df_books_filtered = df_books[df_books['hybrid_score'] > 0.7]
        df_books_sorted = df_books_filtered.sort_values(by='hybrid_score', ascending=False).head(num_of_rec)

        # Handle cases where fewer recommendations are available than requested
        if df_books_sorted.shape[0] < num_of_rec:
            logging.warning("Not enough recommendations to meet the requested number.")

        # Build the output DataFrame with necessary fields
        rec_df_books = pd.DataFrame()
        rec_df_books['Title'] = df_books_sorted['title'].fillna('No Title')
        rec_df_books['URL'] = df_books_sorted['URL'].fillna('#')
        rec_df_books['Stars'] = df_books_sorted['Stars'].fillna('N/A')
        rec_df_books['Author'] = df_books_sorted['author'].fillna('Unknown Author')
        rec_df_books['Price'] = df_books_sorted['price'].fillna('N/A')
        rec_df_books['Publisher'] = df_books_sorted['publisher'].fillna('Unknown')

        # Convert results to JSON
        result_json_books = rec_df_books.to_dict(orient='records')
        return jsonify(result_json_books), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


