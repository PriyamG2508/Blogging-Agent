import json
import os
from dotenv import load_dotenv
from groq import Groq
from langchain.prompts import PromptTemplate

class OutlineAgent:
    def __init__(self):
        load_dotenv()
        groq_api_key = os.getenv("GROQ_API_KEY")
        if not groq_api_key:
            raise ValueError("GROQ_API_KEY not found in .env file.")

        self.client = Groq(api_key=groq_api_key)

    def create_outline(self, topic_title:str, gap_report:dict) -> str:
        template_string = """
        You are a Chief Content Architect, renowned for creating blog post outlines that dominate search engine results pages.
        Your task is to transform a simple topic and a gap analysis report into a strategic, comprehensive, and highly-engaging blog post outline.

        **Original Topic:** "{topic_title}"

        **Content Gap Analysis Report:**
        ---
        {gap_report}
        ---

        **Your Mission: Construct a Detailed Blueprint for a #1 Ranking Article**

        1.  **H1 Title:** Create a new, magnetic, and SEO-optimized H1 title. It must be more compelling than the original topic.
        2.  **Introduction (Hook & Promise):**
            -   Start with a powerful hook (a surprising statistic, a relatable problem, or a bold statement).
            -   Briefly touch upon the baseline information from the "summary" in the report.
            -   Clearly promise the reader what unique insights and solutions they will gain, directly referencing the identified gaps.
        3.  **Body Sections (Address the Gaps):**
            -   Create a dedicated H2 or H3 for EACH gap identified in the report.
            -   The heading for each section must clearly signify that it's solving the identified gap.
            -   Under each heading, list bullet points detailing the key arguments, data points, examples, and "how-to" steps to include. This is not just a list of topics; it's a plan of attack.
        4.  **Include "Power Elements" (Placeholders):**
            -   In at least two sections, add a placeholder like: `[Placeholder: Insert a compelling expert quote or a data point here] the quote or data should be relevant and factually correct.`
        5.  **Conclusion (Summarize & CTA):**
            -   Summarize the article's most critical takeaways.
            -   End with a strong, forward-looking statement or a clear Call-to-Action (CTA) for the reader.
        6.  **Formatting:**
            -   The entire output MUST be in Markdown format.
            -   Use H1 for the main title, H2 for major sections, and H3 for sub-sections.
            -   Do not include any pre-amble, post-scripts, or commentary. Your response should start directly with the H1 title.

        Generate the complete blog post outline now.
        """

        prompt_template = PromptTemplate(template=template_string, input_variables=['topic_title', 'gap_report'])
        report_string = json.dumps(gap_report, indent=2)
        final_prompt = prompt_template.format(topic_title=topic_title, gap_report=report_string)

        try:
            response = self.client.chat.completions.create(
                messages=[{"role": "user", "content": final_prompt}],
                model="llama-3.1-8b-instant"
            )

            if response.choices and response.choices[0].message.content:
                return response.choices[0].message.content
            else:
                return ""
        except Exception as e:
            # In a production environment, you might want to log this exception.
            return ""