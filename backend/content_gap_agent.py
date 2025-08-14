import os
import json
import requests
import re
from typing import List, Dict, Optional
from dotenv import load_dotenv
from groq import Groq
from googleapiclient.discovery import build
from langchain.prompts import PromptTemplate

class ContentGapAgent:
    LLM_MODEL_NAME = 'llama3-8b-8192'

    def __init__(self):
        load_dotenv()
        groq_api_key = os.getenv("GROQ_API_KEY")
        self.search_api_key = os.getenv("SEARCH_API_KEY")
        self.search_engine_id = os.getenv("SEARCH_ENGINE_ID")

        if not all([groq_api_key, self.search_api_key, self.search_engine_id]):
            raise ValueError("One or more API keys are missing. Please check your .env file.")

        self.llm_client = Groq(api_key=groq_api_key)

    def _find_related_articles(self, query: str, num_results: int = 5) -> List[Dict]:
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
                return articles
            return []
        except Exception as e:
            # In a production environment, you might want to log this error.
            return []

    def _analyze_collective_gaps(self, articles: List[Dict]) -> Dict:
        search_results_str = "\n\n".join([f"Title: {a['title']}\nSnippet: {a['snippet']}" for a in articles])

        template_string = """
        You are a Senior Content Strategist with 15 years of experience in identifying profitable content opportunities.
        Your mission is to analyze a collection of search result snippets for a given topic and identify what is critically MISSING.

        **Your Analysis Must Uncover:**
        1.  **Unanswered Questions:** What questions are readers likely asking that these snippets fail to address?
        2.  **Lack of Depth:** Where is the information superficial? What key details or data are missing?
        3.  **Missed Angles:** What unique perspectives or expert viewpoints are not being considered?
        4.  **Actionability:** Is there a lack of practical advice, how-to steps, or actionable takeaways?

        **Output Format:**
        Your final output MUST be a clean JSON object, enclosed in markdown ```json tags. Do not include any other text or commentary.
        The JSON object must have two keys:
        - "summary": A brief, one-sentence overview of the *existing* content's focus.
        - "gaps": A list of JSON objects, where each object has two keys: "topic" (a short title for the gap) and "description" (a detailed explanation of what is missing and why it's important).

        **Search Results to Analyze:**
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
            json_match = re.search(r'```json\n(.*?)\n```', raw_response_content, re.DOTALL)
            if json_match:
                json_str = json_match.group(1).strip()
                return json.loads(json_str)
            else:
                return {"error": "LLM response did not contain a valid JSON block."}

        except Exception as e:
            return {"error": f"LLM analysis failed: {e}"}

    def analyze_topic(self, topic: Dict) -> Dict:
        articles = self._find_related_articles(query=topic['title'])
        if not articles:
            return {"error": "Could not find any related articles to analyze."}

        return self._analyze_collective_gaps(articles=articles)