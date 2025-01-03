import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer

class CourseRecommender:
    def __init__(self):
        self.df = None
        self.model = SentenceTransformer('all-MiniLM-L6-v2', device='cpu')
        self.load_data()

    def load_data(self):
        df1 = pd.read_csv("coursera_updated.csv")
        df2 = pd.read_csv("udemy_business.csv")
        df1['source'] = 'COURSERA'
        df2['source'] = 'UDEMY'
        self.df = pd.concat([df1, df2], ignore_index=True)
        self.df['clean_course_title'] = self.df['title'].fillna('').str.lower()
        self.df['title_embedding'] = list(self.model.encode(self.df['clean_course_title'], show_progress_bar=True))

    def recommend(self, prompt, num_of_rec=10):
        prompt_embedding = self.model.encode([prompt])[0]
        self.df['similarity_scores'] = self.df['title_embedding'].apply(
            lambda x: cosine_similarity([x], [prompt_embedding]).flatten()[0]
        )
        self.df['Stars'] = pd.to_numeric(self.df['Stars'], errors='coerce')
        self.df['Stars_normalized'] = self.df['Stars'] / self.df['Stars'].max()
        self.df['hybrid_score'] = (0.7 * self.df['similarity_scores']) + (0.3 * self.df['Stars_normalized'])

        df_sorted = self.df[self.df['hybrid_score'] > 0.5].sort_values(by='hybrid_score', ascending=False)
        recommendations = df_sorted.head(num_of_rec)
        return recommendations[['title', 'URL', 'Summary', 'Stars', 'source', 'hybrid_score']].to_dict(orient='records')
