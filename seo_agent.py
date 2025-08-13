# seo_agent.py
import os
import re
import json
import textstat
from groq import Groq
from dotenv import load_dotenv
from typing import Dict, List

class SEOAgent:
    """
    A hybrid agent that first performs a rule-based SEO analysis
    and then uses an AI model to rewrite the article for optimization.
    """
    def __init__(self):
        load_dotenv()
        groq_api_key = os.getenv('GROQ_API_KEY')
        if not groq_api_key:
            raise ValueError("GROQ_API_KEY not found in .env file.")
        self.client = Groq(api_key=groq_api_key)

    def inspector(self, article_text: str, keywords: List[str]) -> Dict:
        """
        Analyzes the article based on a technical SEO checklist without using an LLM.
        """
        print("\n--- Running SEO Inspector (Rule-Based Analysis) ---")

        words = article_text.split()
        word_count = len(words)

        readability_score = textstat.flesch_reading_ease(article_text)

        keyword_density = {}
        for keyword in keywords:
            # Using regex for whole word matching, case-insensitive
            count = len(re.findall(r'\b' + re.escape(keyword) + r'\b', article_text, re.IGNORECASE))
            density = (count / word_count) * 100 if word_count > 0 else 0
            keyword_density[keyword] = f"{density:.2f}%"

        report = {
            "word_count": word_count,
            "readability_score": f"{readability_score} (Higher is easier to read)",
            "keyword_density": keyword_density
        }

        print("--- SEO Inspector has completed its work ---")
        print(f"SEO Report: {json.dumps(report, indent=2)}")
        return report

    def rewrite_article(self, first_draft: str, seo_report: Dict) -> str:
        """
        Rewrites the first draft to incorporate technical SEO requirements using the Groq API.
        """
        print("\n--- Handing draft and report to SEO Rewrite Agent (Groq) ---")

        report_string = json.dumps(seo_report, indent=2)

        prompt = f"""
        You are an expert copy editor and SEO specialist. Your task is to rewrite the provided draft article to meet the specific technical requirements outlined in the SEO Analysis Report.

        **Technical SEO Report to Follow:**
        ---
        {report_string}
        ---

        **Draft Article to be Rewritten:**
        ---
        {first_draft}
        ---

        **Your Mission:**
        1.  Carefully read the entire draft article.
        2.  Analyze the SEO report. Pay close attention to the keyword densities.
        3.  Rewrite the article to naturally integrate the keywords mentioned in the report, aiming for a healthy density (e.g., 1-2%). Do NOT stuff keywords; weave them in smoothly.
        4.  Improve the sentence structure and flow to enhance readability.
        5.  Maintain the core message, tone, and structure of the original draft.

        Your final output must be ONLY the complete, rewritten, and SEO-optimized article. Do not include any of your own commentary.
        """

        try:
            response = self.client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model="llama3-8b-8192"
            )
            print("--- SEO Rewrite Agent has completed its work ---")
            return response.choices[0].message.content
        except Exception as e:
            print(f"❌ An error occurred in the SEO Rewrite Agent: {e}")
            return f"Error during rewrite: {e}"