# generate_embeddings.py
import pandas as pd
import numpy as np
from sentence_transformers import SentenceTransformer

# Load datasets
df1 = pd.read_csv("Coursera.csv")
df2 = pd.read_csv("udemy.csv")

# Add source and clean titles
df1['source'] = 'COURSERA'
df2['source'] = 'UDEMY'
df = pd.concat([df1, df2], ignore_index=True)
df['clean_course_title'] = df['title'].fillna('').str.lower()

# Load Sentence Transformer
model = SentenceTransformer('all-MiniLM-L6-v2')

# Encode titles
embeddings = model.encode(df['clean_course_title'].tolist(), show_progress_bar=True)

# Save embeddings to a file
np.save("embeddings.npy", embeddings)

print("Embeddings saved to embeddings.npy")
