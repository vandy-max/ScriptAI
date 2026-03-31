import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
from datetime import datetime
import re
from scorer import Scorer
from generator_logic import ScriptGenerator

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})
scorer = Scorer()

# MongoDB Setup
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
client = MongoClient(MONGO_URI)
db = client['scriptbuddy']
generator = ScriptGenerator(db)
users_collection = db['users']
analysis_collection = db['analysis']
profiles_collection = db['profiles']
library_collection = db['script_library']

# Basic User Helper
def get_user_id():
    # In a real app, use JWT tokens. For this prototype, we'll read a header passed by the frontend.
    return request.headers.get('X-User-Id', 'guest_user')

@app.route('/', methods=['GET'])
def index():
    return jsonify({
        "message": "Welcome to ScriptBuddy API",
        "endpoints": ["/api/status", "/api/auth/register", "/api/auth/login", "/api/analysis", "/api/results/<id>", "/api/history"]
    })

@app.route('/api/status', methods=['GET'])
def status():
    return jsonify({"status": "running", "database": "connected" if client.server_info() else "disconnected"})

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password') # In production, use hashing (e.g. bcrypt)

    if users_collection.find_one({"$or": [{"username": username}, {"email": email}]}):
        return jsonify({"error": "User already exists"}), 400

    user_id = os.urandom(8).hex()
    user_doc = {
        "userId": user_id,
        "username": username,
        "email": email,
        "password": password,
        "createdAt": datetime.utcnow()
    }
    users_collection.insert_one(user_doc)
    
    # Also initialize their profile
    profile_doc = {
        "userId": user_id,
        "fullName": data.get('fullName', username),
        "username": username,
        "email": email,
        "channelName": data.get('channelName', f"{username}'s Channel"),
        "niche": data.get('niche', "Tech"),
        "subscribers": data.get('subscribers', "0"),
        "contentType": data.get('contentType', "Long Videos"),
        "frequency": data.get('frequency', "Weekly"),
        "goal": data.get('goal', "Growth"),
        "vision": data.get('vision', "")
    }
    profiles_collection.insert_one(profile_doc)
    
    return jsonify({"message": "User registered", "userId": user_id})

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    identifier = data.get('identifier') # email or username
    password = data.get('password')

    user = users_collection.find_one({
        "$and": [
            {"$or": [{"username": identifier}, {"email": identifier}]},
            {"password": password}
        ]
    })
    
    if not user:
        return jsonify({"error": "Invalid credentials"}), 401
        
    return jsonify({
        "message": "Login successful", 
        "userId": user['userId'], 
        "username": user['username'],
        "token": "mock_token_" + user['userId']
    })

@app.route('/api/profile', methods=['GET', 'POST'])
def profile_api():
    curr_user_id = get_user_id()
    if request.method == 'GET':
        profile = profiles_collection.find_one({"userId": curr_user_id}, {"_id": 0})
        if not profile:
            return jsonify({"error": "Profile not found"}), 404
        return jsonify(profile)
    
    if request.method == 'POST':
        data = request.json
        profiles_collection.update_one(
            {"userId": CURRENT_USER_ID},
            {"$set": data},
            upsert=True
        )
        return jsonify({"message": "Profile updated successfully"})

def improve_script(script):
    """Deep AI script improver: removes fillers and provides strategic advice."""
    if not script: return "Please provide a script to improve."
    
    # 1. Detect filler words
    fillers = ["um", "uh", "actually", "basically", "literally", "like", "so", "you know", "i mean"]
    detected = [f for f in fillers if re.search(f"\\b{f}\\b", script, flags=re.IGNORECASE)]
    
    improved_text = script
    for f in fillers:
        improved_text = re.sub(f"\\b{f}\\b", "", improved_text, flags=re.IGNORECASE)
    
    # Clean up whitespace
    improved_text = re.sub(r'\s+', ' ', improved_text).strip()
    
    # AI logic: Add hook, structure, and CTA
    improved = "✨ [AI OPTIMIZED STRATEGY & SCRIPT] ✨\n\n"
    
    # 2. Strategic Hook
    improved += "🪝 THE HOOK (Tactical Advice: Use a 'Pattern Interrupt' or start with a surprising value proposition)\n"
    if len(improved_text) > 50:
        first_sentence = improved_text.split('.')[0]
        improved += f">>> \"Wait! Did you know that {first_sentence.lower()}? In this video, we're fixing that.\"\n\n"
    else:
        improved += ">>> \"Stop wasting time on [Problem]! Here is the exact secret to [Solution]...\"\n\n"
        
    # 3. Body Structure
    improved += "📝 THE BODY (Tactical Advice: Keep sentences under 15 words. Break every 30s with a new visual or concept.)\n"
    sentences = improved_text.split('.')
    if len(sentences) > 2:
        improved += ">>> " + ". ".join(sentences[:2]) + ".\n"
        improved += ">>> 💡 PRO TIP: " + ". ".join(sentences[2:]) + "\n\n"
    else:
        improved += ">>> " + improved_text + "\n\n"
    
    # 4. CTA (Call to Action)
    improved += "🚀 THE CTA (Tactical Advice: Don't just ask to 'subscribe'. Give them a reason related to the value you just provided.)\n"
    improved += ">>> \"This was just one step. If you want the full breakdown, subscribe now and check the pinned comment!\"\n\n"
    
    if detected:
        improved += f"⚠️ NOTE: I removed these filler words to tighten your pacing: {', '.join(detected)}."
    
    return improved

@app.route('/api/analyze', methods=['POST'])
def start_analysis():
    data = request.json
    script = data.get('script', '')
    niche = data.get('niche', 'Tech')
    duration = data.get('duration', '1-5 min')
    
    try:
        # Use Enhanced Scorer to get predictions
        original_score = scorer.score(script)
        metrics = scorer.get_detailed_metrics(script)
        improved_script = improve_script(script)
        
        # Calculate score for the improved version
        improved_score = scorer.score(improved_script)
        improvement_val = round(float(improved_score - original_score), 1)
        improvement_pct = f"+{improvement_val}%" if improvement_val >= 0 else f"{improvement_val}%"
        
        # Calculate Predicted Watch Time (heuristic: based on typical script duration)
        # 1-5 min (avg 3 min) -> 180s. Watch Time = 180s * (score/100)
        base_seconds = 180 # Default
        if '1-5' in str(duration): base_seconds = 180
        elif '5-10' in str(duration): base_seconds = 450
        elif '10+' in str(duration): base_seconds = 900
        
        predicted_watch_time = round((base_seconds * (improved_score / 100)) / 60, 1) # in minutes
        
        analysis_id = "analys_" + os.urandom(4).hex()
        
        # Generate dynamic recommendations
        recs = []
        if metrics.get('hook', 0) < 60:
            recs.append("Your hook is below average. Try adding curiosity triggers like 'Why' or 'The secret to...'.")
        else:
            recs.append("Great hook! You're successfully grabbing attention.")
            
        if metrics.get('filler', 0) > 10:
            recs.append(f"High filler density ({metrics['filler']}%). Your script feels wordy; use the AI rewrite to tighten it.")
            
        if metrics.get('emotional_intensity', 0) < 40:
            recs.append("The script lacks emotional punch. Add more power words to drive engagement.")

        result = {
            "id": analysis_id,
            "analysisId": analysis_id,
            "score": original_score,
            "predictedScore": improved_score,
            "predictedRetention": improved_score, # Real prediction
            "predictedWatchTime": predicted_watch_time, # Real prediction
            "improvement": improvement_pct,
            "metrics": metrics,
            "rewrite": improved_script,
            "recommendations": recs
        }
        # Save to MongoDB
        curr_user_id = get_user_id()
        analysis_collection.insert_one({
            "analysisId": analysis_id,
            "script": script,
            "result": result,
            "userId": curr_user_id,
            "createdAt": datetime.utcnow()
        })
    except Exception as e:
        print(f"Analysis error: {e}")
        # Return a meaningful error or a graceful fallback
        return jsonify({"error": "Failed to analyze script", "details": str(e)}), 500
    
    # Auto-update profile with niche and duration if not already set or using defaults
    curr_user_id = get_user_id()
    niche = data.get('niche')
    duration = data.get('duration')
    if niche or duration:
        profiles_collection.update_one(
            {"userId": curr_user_id},
            {"$set": {
                "niche": niche or "Tech",
                "contentType": duration or "Standard"
            }},
            upsert=True
        )
    
    return jsonify(result)

@app.route('/api/results/<analysis_id>', methods=['GET'])
def get_results(analysis_id):
    result = analysis_collection.find_one({"analysisId": analysis_id}, {"_id": 0})
    if result:
        return jsonify(result['result'])
    # Return mock for demonstration if not found
    return jsonify({
        "score": 75,
        "rewrite": "This is a dummy rewrite suggestion.",
        "analysisId": analysis_id
    })

@app.route('/api/history', methods=['GET'])
def get_history():
    curr_user_id = get_user_id()
    cursor = analysis_collection.find({"userId": curr_user_id}).sort("createdAt", -1)
    
    formatted_history = []
    for item in cursor:
        res = item.get('result', {})
        formatted_history.append({
            "id": item.get('analysisId'),
            "title": (item.get('script', 'Analysis')[:30] + '...') if item.get('script') else 'Script Analysis',
            "date": item.get('createdAt').strftime("%b %d, %Y") if item.get('createdAt') else "Recent",
            "improvement": res.get('improvement', '0%'), # Real improvement
            "predicted": res.get('predictedScore', 0), # Real predicted score
            "actual": res.get('score', 0), # Real original score
            "score": res.get('score', 0)
        })
    
    return jsonify(formatted_history)

@app.route('/api/library/search', methods=['GET'])
def search_library():
    niche = request.args.get('niche')
    query = request.args.get('q')
    min_retention = request.args.get('min_retention', 0, type=float)
    
    filter_query = {"retention": {"$gte": min_retention}}
    if niche and niche != "All":
        filter_query["niche"] = niche
    if query:
        filter_query["script"] = {"$regex": query, "$options": "i"}
        
    cursor = library_collection.find(filter_query, {"_id": 0}).sort("retention", -1).limit(20)
    return jsonify(list(cursor))

@app.route('/api/library/random', methods=['GET'])
def random_library():
    # Get 3 random high-performing scripts
    cursor = library_collection.aggregate([
        {"$sample": {"size": 3}},
        {"$project": {"_id": 0}}
    ])
    return jsonify(list(cursor))

@app.route('/api/generate/title', methods=['POST'])
def generate_script_api():
    data = request.json
    title = data.get('title', '')
    niche = data.get('niche', 'Tech')
    style = data.get('style', 'Educational')
    
    if not title:
        return jsonify({"error": "Title is required"}), 400
        
    try:
        generated_script = generator.generate_from_title(title, niche, style)
        return jsonify({
            "script": generated_script,
            "title": title,
            "niche": niche
        })
    except Exception as e:
        print(f"Generation error: {e}")
        return jsonify({"error": "Failed to generate script", "details": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
