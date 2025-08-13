from typing import Dict, List, TypedDict, Optional

class BlogGenerationState(TypedDict):
    """State schema for the blog generation"""
    
    # Topic Search Agent outputs
    all_topics: Optional[List[Dict]]
    selected_topic: Optional[Dict]
    
    # Content Gap Agent outputs
    gap_analysis: Optional[Dict]
    related_article_url: Optional[str]
    
    # Outline Agent outputs
    blog_outline: Optional[str]
    final_article: Optional[str]
    
    # Control flow variables
    user_choice: Optional[int]
    error_message: Optional[str]
    stage: str
    retry_count: int
    
    # Original topic title for outline generation
    topic_title: Optional[str]