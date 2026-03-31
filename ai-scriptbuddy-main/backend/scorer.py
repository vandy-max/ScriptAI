import joblib
import pandas as pd
import numpy as np
import os
import re
import sys
from ml.feature_extractor import FeatureExtractor

class Scorer:
    def __init__(self, model_path='model/enhanced_model.pkl'):
        self.model_path = model_path
        self.model = None
        self.scaler = None
        self.extractor = FeatureExtractor()
        
        if os.path.exists(model_path):
            try:
                model_data = joblib.load(model_path)
                self.model = model_data['model']
                self.scaler = model_data['scaler']
                print(f"✅ Loaded enhanced model from {model_path}")
            except Exception as e:
                print(f"❌ Error loading model: {e}")

    def get_detailed_metrics(self, text):
        """Returns 19-feature metrics using FeatureExtractor"""
        if not text:
            return {
                "filler": 0, "hook": 0, "engagement": 0, "retention": 0,
                "emotional_intensity": 0, "storytelling": 0, "curiosity": 0
            }
            
        features = self.extractor.extract_features(text)
        
        # Map the 19 features to the UI's expected format if necessary, 
        # or provide a rich set of metrics.
        return {
            "filler": int(features['filler_density']),
            "hook": int(features['hook_score']),
            "engagement": int(features['engagement_score']),
            "retention": 0, # Will be set by score() if model exists
            "emotional_intensity": int(features['emotional_intensity']),
            "storytelling": int(features['storytelling_score']),
            "curiosity": int(features['curiosity_score']),
            "cta_quality": int(features['cta_quality'])
        }

    def score(self, text):
        """Returns a script retention score (0-100) using the enhanced model."""
        if not text:
            return 0
            
        if self.model and self.scaler:
            try:
                features = self.extractor.extract_features(text)
                X = pd.DataFrame([features])
                X_scaled = self.scaler.transform(X)
                prediction = self.model.predict(X_scaled)[0]
                
                # Clamp to realistic retention range
                return round(float(max(30, min(95, prediction))), 1)
            except Exception as e:
                print(f"Model prediction error: {e}")
                return self._heuristic_score(text)
        
        return self._heuristic_score(text)

    def _heuristic_score(self, text):
        """Fallback heuristic score if model is unavailable"""
        metrics = self.get_detailed_metrics(text)
        # Simple weighted average for fallback
        return round(metrics['hook'] * 0.3 + metrics['engagement'] * 0.4 + metrics['emotional_intensity'] * 0.3, 1)
