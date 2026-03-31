import pandas as pd
import os
import re
import joblib
from sklearn.ensemble import RandomForestRegressor
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler
from textblob import TextBlob

def extract_features(df):
    """Extracts features from the dataframe for training."""
    # Ensure title and description are strings and handle NaNs
    df['title'] = df['title'].fillna('').astype(str)
    df['description'] = df['description'].fillna('').astype(str)
    
    # Basic length features
    df['title_len'] = df['title'].apply(len)
    df['desc_len'] = df['description'].apply(len)
    
    # Punctuation/Hook features
    df['has_question'] = df['title'].apply(lambda x: 1 if '?' in x else 0)
    df['has_exclamation'] = df['title'].apply(lambda x: 1 if '!' in x else 0)
    
    # CTA features (counts common CTA words in description)
    ctas = ["subscribe", "like", "comment", "share", "follow", "link in bio"]
    df['cta_count'] = df['description'].apply(lambda x: sum(1 for c in ctas if c in x.lower()))
    
    # Sentiment (Using TextBlob)
    df['sentiment'] = df['description'].apply(lambda x: TextBlob(x[:500]).sentiment.polarity) # Limit to first 500 chars for speed
    
    # Filler words (negative feature)
    fillers = ["um", "uh", "actually", "basically", "literally", "like", "so"]
    df['filler_count'] = df['description'].apply(lambda x: sum(1 for f in fillers if f" {f} " in x.lower()))
    
    return df

def train_model(csv_dir='csv_files'):
    all_dfs = []
    
    if not os.path.exists(csv_dir):
        print(f"Directory {csv_dir} not found.")
        return

    for file in os.listdir(csv_dir):
        if file.endswith('.csv'):
            csv_path = os.path.join(csv_dir, file)
            print(f"Loading {csv_path}...")
            try:
                # Load a chunk for better performance if files are huge, 
                # but here we'll try to load up to 10k rows for quality
                df = pd.read_csv(csv_path, nrows=10000) 
                if 'title' in df.columns and 'views' in df.columns:
                    all_dfs.append(df)
                else:
                    print(f"Skipping {file}: missing columns.")
            except Exception as e:
                print(f"Error loading {file}: {e}")
    
    if not all_dfs:
        print("No suitable CSV files found.")
        return

    combined_df = pd.concat(all_dfs, ignore_index=True)
    print(f"Processing {len(combined_df)} records...")
    
    combined_df = extract_features(combined_df)
    
    # Features for the model
    # We'll use a mix of numerical features and TF-IDF on the title
    numerical_features = ['title_len', 'desc_len', 'has_question', 'has_exclamation', 'cta_count', 'sentiment', 'filler_count']
    X = combined_df[numerical_features + ['title']]
    y = combined_df['views']
    
    # Define the transformer for title using TF-IDF
    # We limit max_features to keep the model size manageable
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numerical_features),
            ('text', TfidfVectorizer(max_features=500, stop_words='english'), 'title')
        ])
    
    # Create the pipeline
    model_pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('regressor', RandomForestRegressor(n_estimators=50, max_depth=10, random_state=42))
    ])
    
    print("Training the model pipeline...")
    model_pipeline.fit(X, y)
    
    os.makedirs('models', exist_ok=True)
    joblib.dump(model_pipeline, 'models/script_model.joblib')
    print("Enhanced model trained and saved to models/script_model.joblib")

if __name__ == "__main__":
    train_model()
