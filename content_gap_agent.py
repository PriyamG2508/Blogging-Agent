import os
import json
import trafilatura
import google.generativeai as genai
from googleapiclient.discovery import build
from dotenv import load_dotenv
from typing import List, Dict, Optional

class ContentGapAgent:
    """
    A self-contained agent to analyze topics. It handles user selection,
    finds related articles for discussion threads, and analyzes content for gaps.
    """
    LLM_MODEL_NAME = 'gemini-2.5-pro'

    def __init__(self):
        load_dotenv()
        gemini_api_key = os.getenv("GEMINI_API_KEY")
        self.search_api_key = os.getenv("Search_API_KEY")
        self.search_engine_id = os.getenv("SEARCH_ENGINE_ID")

        if not all([gemini_api_key, self.search_api_key, self.search_engine_id]):
            raise ValueError("One or more API keys are missing. Please check your .env file.")

        genai.configure(api_key=gemini_api_key)
        self.llm_model = genai.GenerativeModel(self.LLM_MODEL_NAME)
        self.user_agent = 'BloggerAI_Analyst/2.0'

    def _find_related_article(self, query: str) -> Optional[str]:
        """[Internal Tool] Uses Google Search to find the top article for a query."""
        print(f"\nSearching for an article related to: '{query}'...")
        try:
            service = build("customsearch", "v1", developerKey=self.search_api_key)
            result = service.cse().list(q=query, cx=self.search_engine_id, num=1).execute()
            
            if 'items' in result and result['items']:
                top_url = result['items'][0]['link']
                print(f"Found article: {top_url}")
                return top_url
            print("Could not find a relevant article.")
            return None
        except Exception as e:
            print(f"An error occurred during search: {e}")
            return None

    def _analyze_gaps_in_article(self, url: str) -> Dict:
        """[Internal Tool] Fetches an article URL and analyzes it for content gaps."""
        print(f"Analyzing article for gaps: {url}")
        
        downloaded = trafilatura.fetch_url(url)
        if not downloaded:
            return {"error": "Failed to download article."}
        article_text = trafilatura.extract(downloaded)
        if not article_text:
            return {"error": "Failed to extract main text from article."}

        prompt = f"""
        As an expert Content Strategist, analyze the following article text.
        Identify significant "content gaps" like missing sub-topics, unanswered questions, or areas lacking depth.
        Present your findings as a JSON object with a "summary" and a list of "gaps".

        Article Text:
        ---
        {article_text[:8000]}
        ---
        """
        try:
            response = self.llm_model.generate_content(prompt)
            json_str = response.text.strip().lstrip('```json').rstrip('```').strip()
            return json.loads(json_str)
        except Exception as e:
            return {"error": f"LLM analysis failed: {e}"}

    def present_topics_for_selection(self, topics: List[Dict]) -> Optional[Dict]:
        """Displays a list of topics and prompts the user to choose one."""
        if not topics:
            print("No topics found to select from.")
            return None
            
        print("\n--- Please select a topic to analyze ---")
        display_count = min(len(topics), 10)
        for i, topic in enumerate(topics[:display_count]):
            print(f"{i + 1}. [{topic['subreddit']}] {topic['title']} (Score: {topic['blog_score']})")
        
        try:
            choice = int(input(f"\nEnter the number of your choice (1-{display_count}): "))
            if 1 <= choice <= display_count:
                return topics[choice - 1]
            print("Invalid choice.")
            return None
        except ValueError:
            print("Invalid input. Please enter a number.")
            return None

    def analyze_topic(self, topic: Dict) -> Dict:
        """
        The main execution method. It routes the topic to the correct internal tool
        to produce a final analysis report.
        """
        print(f"\nAnalyzing chosen topic: '{topic['title']}'")
        # This is the new logic that works without the is_self_post flag.
        if "reddit.com" in topic['url']:
            # Assumes a URL containing "reddit.com" is a discussion thread.
            article_url = self._find_related_article(query=topic['title'])
            if not article_url:
                return {"error": "Could not find a related article to analyze."}
            return self._analyze_gaps_in_article(url=article_url)
        else:
            # Assumes any other URL is a direct article link.
            return self._analyze_gaps_in_article(url=topic['url'])