import pandas as pd
import numpy as np
import json
import re
import os

class CombinedDatasetLoader:
    def load_youtube_region(self, videos_path, categories_path, region_name):
        """Load YouTube data for a specific region"""
        
        if not os.path.exists(videos_path):
            print(f"   Warning: File {videos_path} not found. Skipping {region_name}.")
            return pd.DataFrame(columns=['script', 'retention_score', 'source'])

        # Load videos
        print(f"   Loading {videos_path}...")
        df_videos = pd.read_csv(videos_path)
        print(f"   Loaded {len(df_videos)} videos from {region_name}")
        
        # Load category mapping (optional/fallback)
        category_map = {}
        if categories_path and os.path.exists(categories_path):
            try:
                with open(categories_path, 'r', encoding='utf-8') as f:
                    categories = json.load(f)
                for item in categories['items']:
                    category_map[item['id']] = item['snippet']['title']
            except Exception as e:
                print(f"   Error loading categories: {e}")
        
        # Create script from title + description + tags
        scripts = []
        # Use a subset if the file is massive, but for now we'll try to process all
        # or up to 20k for performance during this coding task
        max_rows = 20000 
        df_subset = df_videos.head(max_rows).copy()
        
        print(f"   Generating scripts for {len(df_subset)} records...")
        for _, row in df_subset.iterrows():
            script_parts = []
            
            # Title (strong hook)
            if pd.notna(row.get('title')):
                script_parts.append(str(row['title']))
            
            # Description (main content)
            if pd.notna(row.get('description')):
                desc = str(row['description'])
                # Clean links and special chars
                desc = re.sub(r'http\S+', '', desc)
                desc = re.sub(r'[^\w\s\.\?\!]', ' ', desc)
                script_parts.append(desc[:800]) # Cap description
            
            # Tags (keywords)
            if pd.notna(row.get('tags')):
                tags = str(row['tags']).replace('|', ' ').split(',')[:5]
                script_parts.append(' '.join(tags))
            
            script = ' '.join(script_parts)
            scripts.append(script[:1500]) # Cap total script length
        
        df_subset['script'] = scripts
        
        # Calculate engagement scores for retention labels
        print("   Calculating engagement scores...")
        views_log = np.log1p(df_subset['views'])
        df_subset['views_norm'] = (views_log - views_log.min()) / (views_log.max() - views_log.min() + 1e-9)
        
        likes_log = np.log1p(df_subset['likes'])
        df_subset['likes_norm'] = (likes_log - likes_log.min()) / (likes_log.max() - likes_log.min() + 1e-9)
        
        comments_log = np.log1p(df_subset['comment_count'])
        df_subset['comment_norm'] = (comments_log - comments_log.min()) / (comments_log.max() - comments_log.min() + 1e-9)
        
        # Weighted engagement score
        df_subset['engagement_score'] = (
            df_subset['views_norm'] * 0.5 +
            df_subset['likes_norm'] * 0.3 +
            df_subset['comment_norm'] * 0.2
        ) * 100
        
        # Create realistic retention distribution
        percentile = df_subset['engagement_score'].rank(pct=True)
        
        retention_scores = []
        np.random.seed(42) # For reproducibility
        for pct in percentile:
            if pct > 0.9:
                score = np.random.uniform(70, 92)    # Top 10%
            elif pct > 0.5:
                score = np.random.uniform(50, 70)    # Next 40%
            elif pct > 0.2:
                score = np.random.uniform(38, 50)    # Next 30%
            else:
                score = np.random.uniform(25, 38)    # Bottom 20%
            
            score += np.random.normal(0, 2)
            score = max(20, min(95, score))
            retention_scores.append(round(score, 1))
        
        df_subset['retention_score'] = retention_scores
        df_subset['source'] = f'youtube_{region_name}'
        
        return df_subset[['script', 'retention_score', 'source']]

    def prepare_combined_data(self, output_path='data/combined_training_data.csv'):
        """Main method to prepare the dataset"""
        # Adjusted paths based on observed filesystem
        youtube_files = {
            'US': 'csv_files/USvideos.csv',
            'IN': 'csv_files/INvideos.csv'
        }
        
        all_dfs = []
        for region, path in youtube_files.items():
            df = self.load_youtube_region(path, None, region) # No category JSON for now
            if not df.empty:
                all_dfs.append(df)
        
        if not all_dfs:
            print("Error: No data loaded.")
            return None
            
        combined_df = pd.concat(all_dfs, ignore_index=True)
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        combined_df.to_csv(output_path, index=False)
        print(f"✅ Combined dataset saved to {output_path}")
        return combined_df

if __name__ == "__main__":
    loader = CombinedDatasetLoader()
    loader.prepare_combined_data()
