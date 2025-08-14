import os
import re
import json
import textstat
from groq import Groq
from dotenv import load_dotenv
from typing import Dict, List

class SEOAgent:
    def __init__(self):
        load_dotenv()
        groq_api_key = os.getenv('GROQ_API_KEY')
        if not groq_api_key:
            raise ValueError("GROQ_API_KEY not found in .env file.")
        self.client = Groq(api_key=groq_api_key)

    def inspector(self, article_text: str, keywords: List[str]) -> Dict:
        words = article_text.split()
        word_count = len(words)

        readability_score = textstat.flesch_reading_ease(article_text)

        keyword_density = {}
        for keyword in keywords:
            count = len(re.findall(r'\b' + re.escape(keyword) + r'\b', article_text, re.IGNORECASE))
            density = (count / word_count) * 100 if word_count > 0 else 0
            keyword_density[keyword] = f"{density:.2f}%"

        report = {
            "word_count": word_count,
            "readability_score": f"{readability_score} (Higher is easier to read)",
            "keyword_density": keyword_density
        }
        return report

    def rewrite_article(self, first_draft: str, seo_report: Dict) -> str:
        report_string = json.dumps(seo_report, indent=2)

        prompt = f"""
        You are an expert SEO Copyeditor with a surgeon's precision. Your task is to refine and polish a draft article based on a technical SEO report. The goal is optimization without sacrificing quality.

        **Technical SEO Report:**
        ---
        {report_string}
        ---

        **Draft Article for Refinement:**
        ---
        {first_draft}
        ---

        **Your Surgical Mission:**
        1.  **Subtle Keyword Integration:** Analyze the keyword densities in the report. If any are too low, subtly weave them into the text. Your work should be invisible; do NOT "stuff" keywords. The integration must feel natural and add value to the sentence.
        2.  **Enhance Readability:** Improve the sentence structure and flow. Break up long, complex sentences. Vary sentence length. Replace passive voice with active voice where appropriate.
        3.  **Preserve the Core:** Do not alter the core message, tone, or structure of the original draft. You are polishing, not rewriting from scratch.
        4.  **Final Output:** Your final output MUST be ONLY the complete, rewritten, and SEO-optimized article. Your response must start directly with the article's title. Absolutely no commentary, notes, or analysis about your changes are allowed.

        Execute the mission now.
        """

        try:
            response = self.client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model="llama3-8b-8192"
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"Error during rewrite: {e}"