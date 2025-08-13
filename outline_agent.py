import json
import os 
from dotenv import load_dotenv
import google.generativeai as genai
from langchain.prompts import PromptTemplate

class OutlineAgent:
    """
    A agent to to generate outline from the analysed gaps,
    It handles outline generation of the content gap analysed.
    """
    LLM_MODEL_NAME = 'gemini-2.5-pro'
    
    def __init__(self):
        load_dotenv()
        gemini_api_key = os.getenv("GEMINI_API_KEY")
        
        genai.configure(api_key=gemini_api_key)
        self.llm_model = genai.GenerativeModel(self.LLM_MODEL_NAME)
        self.user_agent = 'BloggerAI_Architect/3.0'
        
    def create_outline(self, topic_title:str, gap_report:dict) -> str:
        
        template_string = """
            You are an expert content strategist and senior blog editor, renowned for creating content that is comprehensive, engaging, and ranks highly on search engines.
            Your task is to create a detailed blog post outline. You will be working with the original topic title and a JSON analysis report that identifies specific content gaps in a competitor's article.
            Original Topic: "{topic_title}"

            Gap Analysis Report:
            ---
            {gap_report}
            ---

            Based on the provided information, follow these instructions precisely:

            1.  **Create a New Title (H1):** Propose a new, compelling, and SEO-friendly title for our article. It should be more engaging and comprehensive than the original topic title.
            2.  **Synthesize the Introduction:** Plan an introduction that hooks the reader, references the baseline information from the "summary" in the report, and clearly states what new, deeper insights this article will provide.
            3.  **Address All Gaps:** This is the most critical part. You must create specific sections (H2) or sub-points (H3) that directly address and solve EVERY SINGLE GAP identified in the "gaps" list of the report. Use the gap "title" as inspiration for your section headings.
            4.  **Structure and Format:** Structure the entire output in Markdown format. Use H1 for the main title, H2 for major sections, and H3 for sub-sections. Under each heading, use bullet points to note the key data, arguments, or questions to include.
            5.  **Logical Flow:** Organize the sections in a logical narrative that guides the reader from the basic concepts to the deeper, more insightful analysis that fills the identified gaps.
            6.  **Conclusion:** Plan a concluding section that summarizes the key takeaways and offers a final, forward-looking thought on the topic.

            Now, generate the complete blog post outline.
        """
        safety_settings = {
            'HARM_CATEGORY_HARASSMENT': 'BLOCK_NONE',
            'HARM_CATEGORY_HATE_SPEECH': 'BLOCK_NONE',
            'HARM_CATEGORY_SEXUALLY_EXPLICIT': 'BLOCK_NONE',
            'HARM_CATEGORY_DANGEROUS_CONTENT': 'BLOCK_NONE',
        }
        
        prompt_template = PromptTemplate(template=template_string, input_variables=['topic_title', 'gap_report'])
        report_string = json.dumps(gap_report, indent=2)
        final_prompt = prompt_template.format(topic_title=topic_title, gap_report=report_string)
        
        response = self.llm_model.generate_content(final_prompt,safety_settings=safety_settings)
        
        return response.text