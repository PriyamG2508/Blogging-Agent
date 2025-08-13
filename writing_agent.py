import os
from groq import Groq
from dotenv import load_dotenv
from langchain.prompts import PromptTemplate

class WritingAgent:
    """
    A self-contained agent to write a full article based on an outline.
    This agent uses the Google Gemini API to have control over safety settings.
    """

    def __init__(self):
        load_dotenv()
        groq_api_key = os.getenv('GROQ_API_KEY')
        
        if not groq_api_key:
            raise ValueError("GROQ_API_KEY not found in .env file.")
        
        self.client = Groq(api_key=groq_api_key)

    def write_article(self, outline: str) -> str:
        """
        Generates a full, high-quality blog post from a given outline using the Gemini API.
        """
        template_string = """
            You are a professional blog writer. Your mission is to transform the following detailed outline into a complete, well-written, and engaging blog post of 800-1200 words.
            
            **Crucial Instructions:**
            1.  **Do NOT just copy the headings and bullet points.** You must write full, flowing paragraphs for each section.
            2.  **Convert the bullet points into a smooth narrative.** Use the points in the outline as your guide, but express them in complete sentences with proper transitions.
            3.  **The final output must be a finished article in Markdown format, ready for publication.**
            
            Start directly with the H1 title. Do not include any of your own commentary.
            ---
            OUTLINE TO FOLLOW:
            {outline}
            ---
        """
        prompt_template = PromptTemplate(template=template_string, input_variables=['outline'])
        final_prompt = prompt_template.format(outline=outline)

        try:
            response = self.client.chat.completions.create(
                messages=[{"role": "user","content": final_prompt,}],
                model="llama3-8b-8192" 
            )

            if response.choices and response.choices[0].message.content:
                return response.choices[0].message.content
            else:
                print("❌ WRITING AGENT FAILED: Groq API returned an empty response. This may be due to its content safety filter.")
                return ""

        except Exception as e:
            print(f"❌ An exception occurred in the Groq Writing Agent: {e}")
            return ""