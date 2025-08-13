import os
import json
import requests
import re
from typing import List, Dict, Optional
from dotenv import load_dotenv
from groq import Groq
from googleapiclient.discovery import build
from langchain.prompts import PromptTemplate # Added for PromptTemplate

class ContentGapAgent:
    """
    A self-contained agent to analyze topics. It handles user selection,
    finds related articles via search, and analyzes content for gaps.
    This version performs a collective analysis on multiple search results
    instead of scraping a single URL.
    """
    LLM_MODEL_NAME = 'llama3-8b-8192'

    def __init__(self):
        load_dotenv()
        groq_api_key = os.getenv("GROQ_API_KEY")
        self.search_api_key = os.getenv("SEARCH_API_KEY")
        self.search_engine_id = os.getenv("SEARCH_ENGINE_ID")

        if not all([groq_api_key, self.search_api_key, self.search_engine_id]):
            raise ValueError("One or more API keys are missing. Please check your .env file.")

        self.llm_client = Groq(api_key=groq_api_key)
        self.user_agent = 'BloggerAI_Analyst/3.0'

    def _find_related_articles(self, query: str, num_results: int = 5) -> List[Dict]:
        """Uses Google Search to find top articles, returning titles and snippets."""
        print(f"\nSearching for {num_results} articles related to: '{query}'...")
        try:
            service = build("customsearch", "v1", developerKey=self.search_api_key)
            result = service.cse().list(q=query, cx=self.search_engine_id, num=num_results).execute()
            
            articles = []
            if 'items' in result and result['items']:
                for item in result['items']:
                    articles.append({
                        'title': item.get('title'),
                        'snippet': item.get('snippet'),
                        'link': item.get('link')
                    })
                print(f"Found {len(articles)} articles.")
                return articles
            
            print("Could not find any relevant articles.")
            return []
        except Exception as e:
            print(f"An error occurred during search: {e}")
            return []

    def _analyze_collective_gaps(self, articles: List[Dict]) -> Dict:
        """Analyzes a list of search result snippets for content gaps using an LLM."""
        print(f"Analyzing {len(articles)} search results for gaps...")
        
        search_results_str = "\n\n".join([f"Title: {a['title']}\nSnippet: {a['snippet']}" for a in articles])

        template_string = """
        As an expert Content Strategist, analyze the following collection of search results (titles and snippets).
        Your goal is to identify significant "content gaps" like missing sub-topics, unanswered questions, or areas lacking depth across all of these results.
        Do NOT just summarize the content. Find what is missing from the collective knowledge presented here.
        Present your findings as a JSON object with a "summary" and a list of "gaps".

        Search Results:
        ---
        {search_results}
        ---
        """
        
        prompt_template = PromptTemplate(
            template=template_string,
            input_variables=['search_results']
        )
        
        final_prompt = prompt_template.format(search_results=search_results_str)

        try:
            response = self.llm_client.chat.completions.create(
                messages=[{"role": "user", "content": final_prompt}],
                model=self.LLM_MODEL_NAME
            )
            
            raw_response_content = response.choices[0].message.content
            print("--- Raw LLM Response ---")
            print(raw_response_content)
            print("-------------------------")
            
            json_match = re.search(r'```json\n(.*?)\n```', raw_response_content, re.DOTALL)
            if json_match:
                json_str = json_match.group(1).strip()
                return json.loads(json_str)
            else:
                return {"error": "LLM response did not contain a valid JSON block."}

        except Exception as e:
            return {"error": f"LLM analysis failed: {e}"}

    def present_topics_for_selection(self, topics: List[Dict]) -> Optional[Dict]:
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
        The main execution method. It uses the new collective analysis tool
        to produce a final analysis report.
        """
        print(f"\nAnalyzing chosen topic: '{topic['title']}'")
        
        articles = self._find_related_articles(query=topic['title'])
        if not articles:
            return {"error": "Could not find any related articles to analyze."}
            
        return self._analyze_collective_gaps(articles=articles)
