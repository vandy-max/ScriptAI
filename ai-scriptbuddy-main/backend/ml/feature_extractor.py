import re
import numpy as np
from nltk.sentiment import SentimentIntensityAnalyzer
import nltk
import ssl

# Fix for SSL certificate issue during NLTK download if it happens
try:
    _create_unverified_https_context = ssl._create_unverified_context
except AttributeError:
    pass
else:
    ssl._create_default_https_context = _create_unverified_https_context

# Download VADER lexicon
try:
    nltk.data.find('sentiment/vader_lexicon')
except LookupError:
    nltk.download('vader_lexicon')

class FeatureExtractor:
    def __init__(self):
        self.sia = SentimentIntensityAnalyzer()
        
        # Expanded filler words database
        self.filler_words = {
            'um', 'uh', 'er', 'ah', 'hmm', 'mm', 'hm', 'eh', 'oh',
            'like', 'actually', 'basically', 'literally', 'just', 
            'so', 'very', 'really', 'well', 'you know', 'i mean',
            'okay', 'right', 'yeah', 'yep', 'sort of', 'kind of', 'anyway',
            'honestly', 'seriously', 'technically', 'essentially',
            'the thing is', 'the point is', 'you see', 'i guess'
        }
        
        # Curiosity triggers for hook scoring
        self.curiosity_triggers = [
            'why', 'how', 'secret', 'never', 'what if', 'surprising', 
            'shocking', 'truth', 'revealed', 'stop', 'warning', 'mistake',
            'everyone', 'nobody', 'actually', 'discovered', 'hidden'
        ]
        
        # Power words
        self.power_words = [
            'proven', 'guaranteed', 'exclusive', 'insider', 'revealed',
            'discovered', 'essential', 'critical', 'powerful', 'game-changing'
        ]
        
        # Engagement triggers
        self.engagement_triggers = [
            'subscribe', 'like', 'comment', 'share', 'below', 'click',
            'check out', 'let me know', 'hit that', 'ring the bell'
        ]
        
        # Pattern interrupts
        self.pattern_interrupts = [
            'but', 'however', 'suddenly', 'wait', 'imagine', 'what if',
            'here\'s the thing', 'the truth is', 'actually', 'here\'s why'
        ]
        
        # Storytelling elements
        self.story_elements = [
            'story', 'experience', 'journey', 'learned', 'discovered',
            'realized', 'when I', 'I remember', 'back when', 'one time'
        ]
        
        # Call-to-action phrases
        self.cta_strong = [
            'subscribe now', 'click here', 'link in description', 'join',
            'hit that like', 'comment below', 'share this'
        ]
        
        self.cta_weak = [
            'check out', 'see you', 'thanks for watching', 'bye', 'see ya'
        ]
    
    def extract_features(self, script):
        """Extract all 19 features from a script"""
        script_lower = str(script).lower()
        words = script_lower.split()
        
        features = {}
        
        # 1. Basic features
        features['script_length'] = len(words)
        features['avg_word_length'] = np.mean([len(w) for w in words]) if words else 0
        features['unique_words_ratio'] = len(set(words)) / max(1, len(words))
        
        # 2. Filler density
        filler_count = 0
        for word in words:
            clean_word = re.sub(r'[^\w\s]', '', word)
            if clean_word in self.filler_words:
                filler_count += 1
        
        # Check for filler phrases
        for phrase in ['you know', 'i mean', 'sort of', 'kind of', 'the thing is']:
            filler_count += script_lower.count(phrase) * 2
        
        features['filler_density'] = (filler_count / max(1, len(words))) * 100
        features['filler_density'] = min(100, features['filler_density'])
        
        # 3. Hook score (first 200 characters)
        hook = script_lower[:200]
        hook_score = 40
        
        # Strong curiosity triggers (+8 each)
        for t in self.curiosity_triggers:
            if t in hook:
                hook_score += 8
        
        # Power words (+5 each)
        for p in self.power_words:
            if p in hook:
                hook_score += 5
        
        # Question start
        if hook.strip().startswith(('why', 'how', 'what', 'when', 'where', 'who')):
            hook_score += 15
        
        # Numbers
        if re.search(r'\d+', hook):
            hook_score += 10
        
        # Exclamation
        if '!' in hook:
            hook_score += 8
        
        # Bold statements
        if any(word in hook for word in ['will', 'going to', 'going show', 'reveal']):
            hook_score += 5
        
        features['hook_score'] = min(100, hook_score)
        
        # 4. Emotional intensity (VADER sentiment)
        sentiment = self.sia.polarity_scores(script_lower)
        features['emotional_intensity'] = (sentiment['compound'] + 1) / 2 * 100
        
        # 5. Emotional range (variation across sentences)
        sentences = re.split(r'[.!?]+', script_lower)
        sentiments = []
        for s in sentences:
            if s.strip():
                sentiments.append(self.sia.polarity_scores(s)['compound'])
        features['emotional_range'] = np.std(sentiments) if len(sentiments) > 1 else 0
        
        # 6. Question density
        features['question_density'] = script_lower.count('?') / max(1, len(words)) * 100
        
        # 7. Exclamation density
        features['exclamation_density'] = script_lower.count('!') / max(1, len(words)) * 100
        
        # 8. Numeric density
        features['numeric_density'] = len(re.findall(r'\d+', script_lower)) / max(1, len(words)) * 100
        
        # 9. Engagement triggers
        features['engagement_triggers'] = sum(1 for t in self.engagement_triggers if t in script_lower)
        
        # 10. Pattern interrupts
        features['pattern_interrupts'] = sum(1 for p in self.pattern_interrupts if p in script_lower)
        
        # 11. Storytelling score
        features['storytelling_score'] = sum(1 for s in self.story_elements if s in script_lower) * 5
        features['storytelling_score'] = min(100, features['storytelling_score'])
        
        # 12. Strong CTA count
        features['strong_cta'] = sum(1 for c in self.cta_strong if c in script_lower)
        
        # 13. Weak CTA count
        features['weak_cta'] = sum(1 for c in self.cta_weak if c in script_lower)
        
        # 14. CTA quality
        features['cta_quality'] = (features['strong_cta'] * 15) - (features['weak_cta'] * 5)
        features['cta_quality'] = max(0, min(100, features['cta_quality']))
        
        # 15. Capitalization ratio
        cap_words = sum(1 for w in words if w and w[0].isupper()) # Note: capitalization ratio depends on original script
        # Using original script for capitalization check
        orig_words = str(script).split()
        cap_words = sum(1 for w in orig_words if w and w[0].isupper())
        features['capitalization_ratio'] = (cap_words / max(1, len(orig_words))) * 100
        
        # 16. Average sentence length
        sentences_list = [s for s in sentences if s.strip()]
        if sentences_list:
            features['avg_sentence_length'] = np.mean([len(s.split()) for s in sentences_list])
        else:
            features['avg_sentence_length'] = 0
        
        # 17. Curiosity score
        features['curiosity_score'] = sum(1 for t in self.curiosity_triggers if t in script_lower) * 10
        features['curiosity_score'] = min(100, features['curiosity_score'])
        
        # 18. Opening strength (first 3 words)
        first_three = ' '.join(words[:3]) if len(words) >= 3 else script_lower[:30]
        features['opening_strength'] = 50
        if any(w in first_three.lower() for w in ['why', 'how', 'what', 'stop', 'warning']):
            features['opening_strength'] = 85
        elif any(w in first_three.lower() for w in ['today', 'welcome', 'hey', 'hello']):
            features['opening_strength'] = 45
        
        # 19. Engagement score (composite)
        features['engagement_score'] = (
            features['hook_score'] * 0.2 +
            (100 - features['filler_density']) * 0.15 +
            features['emotional_intensity'] * 0.2 +
            features['pattern_interrupts'] * 5 +
            features['storytelling_score'] * 0.1 +
            features['engagement_triggers'] * 8 +
            features['curiosity_score'] * 0.1
        )
        features['engagement_score'] = min(100, features['engagement_score'])
        
        return features
    
    def extract_features_batch(self, scripts):
        """Extract features for multiple scripts"""
        import pandas as pd
        features_list = []
        for script in scripts:
            features_list.append(self.extract_features(script))
        return pd.DataFrame(features_list)
