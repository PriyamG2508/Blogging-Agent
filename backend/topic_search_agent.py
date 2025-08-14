# priyamg2508/blogging-agent/Blogging-Agent-b024e7272bfacc65da98bb54dc5b4619c660c870/backend/topic_search_agent.py

import os
import time
from typing import List, Dict
from dotenv import load_dotenv
import praw # Import the PRAW library

class TopicSearchAgent:
    """
    This agent uses the official Reddit API via PRAW to find and rank trending topics,
    retaining the original scoring logic for robust analysis.
    """
    def __init__(self):
        load_dotenv()

        # Initialize the PRAW client with credentials from .env
        # This is the main change for reliable data fetching.
        try:
            self.reddit = praw.Reddit(
                client_id=os.getenv("REDDIT_CLIENT_ID"),
                client_secret=os.getenv("REDDIT_CLIENT_SECRET"),
                user_agent=os.getenv("REDDIT_USER_AGENT", "BloggerAI/1.0 by PriyamG2508"),
            )
        except Exception as e:
            raise ValueError(f"Failed to initialize PRAW. Check your REDDIT .env variables. Error: {e}")

        # Your original scoring weights are preserved.
        self.weights = {
            'engagement': 0.4,
            'quality': 0.3,
            'freshness': 0.2,
            'discussion': 0.1
        }

    def calculate_topic_score(self, topic: Dict) -> float:
        """
        Calculates a composite score for topic ranking. 
        This is your original scoring logic, now applied to data from PRAW.
        """
        engagement_raw = topic['score'] + (topic['num_comments'] * 2)
        engagement_score = min(engagement_raw / 1000, 1.0)
        quality_score = topic['upvote_ratio']

        hours_old = topic['freshness']
        if hours_old <= 24:
            freshness_score = 1.0
        elif hours_old <= 72:
            freshness_score = 0.7
        elif hours_old <= 168:
            freshness_score = 0.4
        else:
            freshness_score = 0.1

        if topic['score'] > 0:
            discussion_ratio = topic['num_comments'] / topic['score']
            discussion_score = min(discussion_ratio / 0.5, 1.0)
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
        """Fetches and ranks hot topics from a list of subreddits using PRAW."""
        subreddits = ['technology', 'finance', 'business', 'worldnews', 'sports']
        all_topics = []
        seen_titles = set()

        print("Fetching trending topics from Reddit using PRAW...")
        for subreddit_name in subreddits:
            try:
                subreddit = self.reddit.subreddit(subreddit_name)
                # Fetch top 15 hot posts, skipping stickied posts
                for post in subreddit.hot(limit=15):
                    if post.stickied or post.title in seen_titles:
                        continue
                    
                    seen_titles.add(post.title)
                    
                    freshness_hours = (time.time() - post.created_utc) / 3600

                    # Create a dictionary compatible with your scoring function
                    post_data = {
                        'title': post.title,
                        'subreddit': post.subreddit.display_name,
                        'url': post.url,
                        'is_self_post': post.is_self,
                        'created_utc': post.created_utc,
                        'freshness': freshness_hours,
                        'score': post.score,
                        'num_comments': post.num_comments,
                        'upvote_ratio': post.upvote_ratio
                    }
                    
                    # Calculate the score using your logic
                    blog_score = self.calculate_topic_score(post_data)
                    post_data['blog_score'] = blog_score
                    
                    all_topics.append(post_data)
            
            except Exception as e:
                print(f"Could not fetch topics from r/{subreddit_name}: {e}")

        # Sort by your custom score to find the best topics
        all_topics.sort(key=lambda x: x['blog_score'], reverse=True)
        
        print(f"Successfully fetched and ranked {len(all_topics)} unique topics.")
        return all_topics

    def get_top_topics(self, limit: int = 10) -> List[Dict]:
        """Gets the top N ranked topics."""
        all_topics = self.fetch_trending_topics()
        return all_topics[:limit]

    def filter_quality_topics(self, min_score: float = 0.5) -> List[Dict]:
        """Filter topics above a minimum quality threshold."""
        all_topics = self.fetch_trending_topics()
        return [topic for topic in all_topics if topic['blog_score'] >= min_score]
