# similarity.py
from transformers import BertTokenizer, BertModel
import torch
from sklearn.metrics.pairwise import cosine_similarity

# Load pre-trained model/tokenizer
tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
model = BertModel.from_pretrained('bert-base-uncased')

def get_embeddings(text):
    inputs = tokenizer(text, return_tensors='pt')
    outputs = model(**inputs)
    return outputs.last_hidden_state.mean(dim=1).detach().numpy()

def calculate_similarity(answer1, answer2):
    emb1 = get_embeddings(answer1)
    emb2 = get_embeddings(answer2)
    return cosine_similarity(emb1, emb2)[0][0]

# Allow the script to be run from the command line
if __name__ == "__main__":
    import sys
    answer1 = sys.argv[1]
    answer2 = sys.argv[2]
    similarity = calculate_similarity(answer1, answer2)
    print(similarity)
