import requests
import time
from typing import List, Dict
from datetime import datetime
import math

class TopicSearchAgent:
    def __init__(self):
        self.user_agent = 'BloggerAI/1.0'
        
        self.weights = {
            'engagement': 0.4,    # Reddit score + comments
            'quality': 0.3,       # Upvote ratio
            'freshness': 0.2,     # How recent the post is
            'discussion': 0.1     # Comment-to-score ratio
        }

    def calculate_topic_score(self, topic: Dict) -> float:
        """Calculate a composite score for topic ranking"""
        
        engagement_raw = topic['score'] + (topic['num_comments'] * 2)
        engagement_score = min(engagement_raw / 1000, 1.0)  
        quality_score = topic['upvote_ratio']
        
        hours_old = topic['freshness']
        if hours_old <= 24:
            freshness_score = 1.0  # Very recent
        elif hours_old <= 72:
            freshness_score = 0.7  # Recent
        elif hours_old <= 168:  # 1 week
            freshness_score = 0.4  # Somewhat recent
        else:
            freshness_score = 0.1  # Old
            
        if topic['score'] > 0:
            discussion_ratio = topic['num_comments'] / topic['score']
            discussion_score = min(discussion_ratio / 0.5, 1.0)  # Normalize
        else:
            discussion_score = 0.0
        
        composite_score = (
            engagement_score * self.weights['engagement'] +
            quality_score * self.weights['quality'] +
            freshness_score * self.weights['freshness'] +
            discussion_score * self.weights['discussion']
        )
        
        return round(composite_score, 3)
    
    def fetch_trending_topics(self) -> List[Dict]:
        headers = {
            'User-Agent': self.user_agent
        }

        subreddits = ['technology', 'finance', 'business', 'worldnews', 'sports']
        all_topics = []

        for subreddit in subreddits:
            try:
                url = f'https://www.reddit.com/r/{subreddit}/hot.json'
                params = {'limit': 15}
                response = requests.get(url, headers=headers, params=params)

                if response.status_code == 200:
                    data = response.json()
                    for post in data['data']['children']:
                        post_data = post['data']
                        freshness_hours = (time.time() - post_data['created_utc']) / 3600
                        
                        topic = {
                            'title': post_data['title'],
                            'subreddit': subreddit,
                            'url': post_data['url'] if not post_data['is_self'] else f"https://reddit.com{post_data['permalink']}",
                            'is_self_post': post_data['is_self'], # <-- THE CRITICAL ADDITION
                            'created_utc': post_data['created_utc'],
                            'freshness': freshness_hours,
                            'score': post_data['score'],
                            'num_comments': post_data['num_comments'], 
                            'upvote_ratio': post_data['upvote_ratio']
                        }
                    
                        topic['blog_score'] = self.calculate_topic_score(topic)
                        all_topics.append(topic)
                        
                else:
                    print(f"Failed to fetch r/{subreddit} with status code: {response.status_code}")

                time.sleep(1)  
            except Exception as e:
                print(f"Exception fetching r/{subreddit}: {e}")
                
        all_topics.sort(key=lambda x: x['blog_score'], reverse=True)
        
        return all_topics
    
    def get_top_topics(self, limit: int = 10) -> List[Dict]:
        """Get top N topics based on calculated scores"""
        all_topics = self.fetch_trending_topics()
        return all_topics[:limit]

    def filter_quality_topics(self, min_score: float = 0.5) -> List[Dict]:
        """Filter topics above a minimum quality threshold"""
        all_topics = self.fetch_trending_topics()
        return [topic for topic in all_topics if topic['blog_score'] >= min_score]

    