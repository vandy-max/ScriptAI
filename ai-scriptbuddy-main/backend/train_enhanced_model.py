import pandas as pd
import numpy as np
import os
import joblib
import warnings
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import r2_score, mean_squared_error, mean_absolute_error
from sklearn.preprocessing import StandardScaler

# Suppress warnings
warnings.filterwarnings('ignore')

# Use absolute imports or ensure PYTHONPATH is set
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from ml.feature_extractor import FeatureExtractor
from ml.combined_loader_v2 import CombinedDatasetLoader

def train_pipeline(data_path='data/combined_training_data.csv'):
    print("="*70)
    print("🎬 Script AI - Enhanced Model Training")
    print("="*70)
    
    # Step 1: Load/Prepare dataset
    print("\n📥 Step 1: Loading combined dataset...")
    if not os.path.exists(data_path):
        print(f"   Dataset not found at {data_path}. Generating now...")
        loader = CombinedDatasetLoader()
        df = loader.prepare_combined_data(data_path)
    else:
        df = pd.read_csv(data_path)
    
    if df is None or df.empty:
        print("   Error: No data to train on.")
        return

    print(f"   Loaded {len(df):,} samples")
    print(f"   Retention range: {df['retention_score'].min():.1f} - {df['retention_score'].max():.1f}")
    
    # Step 2: Extract features
    print("\n🔧 Step 2: Extracting 19 features from scripts...")
    feature_extractor = FeatureExtractor()
    
    # Extract features for all scripts
    feature_list = []
    scripts = df['script'].tolist()
    
    for i, script in enumerate(scripts):
        if i % 5000 == 0:
            print(f"   Processed {i:,}/{len(scripts):,} scripts...")
        features = feature_extractor.extract_features(script)
        feature_list.append(features)
    
    X = pd.DataFrame(feature_list)
    y = df['retention_score'].values
    
    print(f"\n✅ Created {X.shape[1]} features")
    print(f"   Features: {list(X.columns)}")
    
    # Step 3: Split data
    print("\n📊 Step 3: Splitting data...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    print(f"   Training: {len(X_train):,} samples")
    print(f"   Testing: {len(X_test):,} samples")
    
    # Step 4: Scale features
    print("\n📈 Step 4: Scaling features...")
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Step 5: Train Random Forest
    print("\n🌲 Step 5: Training Random Forest...")
    rf_model = RandomForestRegressor(
        n_estimators=100, # Reduced from 300 for speed in this environment
        max_depth=15,
        min_samples_split=10,
        min_samples_leaf=5,
        max_features='sqrt',
        random_state=42,
        n_jobs=-1
    )
    print("   Training the model...")
    rf_model.fit(X_train_scaled, y_train)
    
    # Step 6: Evaluate
    print("\n📊 Step 6: Evaluating model...")
    y_pred = rf_model.predict(X_test_scaled)
    
    r2 = r2_score(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    mae = mean_absolute_error(y_test, y_pred)
    
    # Calculate accuracy within 10%
    errors = np.abs(y_test - y_pred) / (y_test + 1e-9)
    accuracy = np.mean(errors <= 0.10) * 100
    
    print(f"\n📈 Model Performance:")
    print(f"   R² Score: {r2:.4f}")
    print(f"   RMSE: {rmse:.2f}")
    print(f"   MAE: {mae:.2f}")
    print(f"   Accuracy (within 10%): {accuracy:.1f}%")
    
    # Step 7: Cross-validation
    print("\n🔄 Step 7: Cross-validation (3-fold):")
    cv_scores = cross_val_score(rf_model, X_train_scaled, y_train, cv=3, scoring='r2') # 3-fold for speed
    print(f"   CV R²: {cv_scores.mean():.4f} ± {cv_scores.std():.4f}")
    
    # Step 8: Save model
    print("\n💾 Step 8: Saving model...")
    os.makedirs('model', exist_ok=True)
    
    save_data = {
        'model': rf_model,
        'scaler': scaler,
        'feature_extractor': feature_extractor,
        'feature_names': X.columns.tolist(),
        'metrics': {
            'r2': r2,
            'rmse': rmse,
            'mae': mae,
            'accuracy': accuracy,
            'cv_mean': cv_scores.mean()
        }
    }
    joblib.dump(save_data, 'model/enhanced_model.pkl')
    print("✅ Model saved to model/enhanced_model.pkl")
    
    print("\n" + "="*70)
    print("🎉 Training complete!")
    print("="*70)

if __name__ == "__main__":
    train_pipeline()
