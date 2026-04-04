import pandas as pd
import os
from pymongo import MongoClient
from dotenv import load_dotenv
import re

load_dotenv()

def seed_library():
    # 1. Connect to MongoDB
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
    client = MongoClient(MONGO_URI)
    db = client['scriptbuddy']
    library_collection = db['script_library']
    
    # 2. Check if already seeded (prevent duplicates)
    if library_collection.count_documents({}) > 500:
        print("✅ Database already seeded. Skipping.")
        return

    # 3. Load processed CSV
    csv_path = 'data/combined_training_data.csv'
    if not os.path.exists(csv_path):
        print(f"❌ Could not find {csv_path}. Run training first.")
        return
    
    print(f"📂 Loading data from {csv_path}...")
    df = pd.read_csv(csv_path)
    
    # 4. Filter for high-quality "Inspiration" (Retention > 70%)
    high_performers = df[df['retention_score'] > 70].sort_values(by='retention_score', ascending=False)
    
    # Take top 1,000 for library
    library_data = high_performers.head(1000).copy()
    
    # Clean and format for DB
    records = []
    print(f"⚡ Processing top {len(library_data)} scripts...")
    for _, row in library_data.iterrows():
        # Clean script teaser
        script = str(row['script'])
        title = script.split('.')[0][:50] + "..." if '.' in script else script[:50]
        
        # Approximate niche from source
        source = str(row['source'])
        niche = "Trending"
        if "TED" in source: niche = "Educational"
        elif "US" in source: niche = "US Trending"
        elif "IN" in source: niche = "India Trending"
        
        records.append({
            "title": title,
            "script": script,
            "retention": row['retention_score'],
            "niche": niche,
            "source": source,
            "tags": ["High Retention", "Viral Pattern"]
        })
    
    # 5. Insert into MongoDB
    if records:
        print("💾 Inserting records into MongoDB...")
        library_collection.insert_many(records)
        # Create indices
        library_collection.create_index([("niche", 1)])
        library_collection.create_index([("retention", -1)])
        print(f"✅ Successfully seeded {len(records)} inspiration scripts!")
    else:
        print("⚠️ No suitable records found to seed.")
        @app.route('/api/seed', methods=['GET'])
def seed():
    try:
        from seed_database import seed_library
        seed_library()
        return jsonify({"message": "Database seeded successfully!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    seed_library()
