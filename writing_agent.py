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
            You are an expert blog writer and subject matter expert, known for your ability to transform structured outlines into compelling, narrative-driven articles. Your audience is intelligent, curious, and appreciates a conversational yet authoritative tone.

            **Your Mission:**
            Transform the following detailed outline into a complete, well-written, and engaging blog post of 800-1200 words.

            **Crucial Instructions:**
            1.  **Do NOT just convert bullet points into paragraphs.** Use the outline as a guide for the core arguments and data, but your job is to weave these points into a smooth, readable narrative.
            2.  **Create a Story:** Start with a strong hook that grabs the reader's attention. Each section should flow logically into the next. Use transitional phrases to connect ideas seamlessly.
            3.  **Elaborate and Explain:** The bullet points in the outline are just key ideas. You must expand on them. Provide context, explain the "why," and use analogies or examples to make complex topics understandable. The original article often poses questions; your job is to answer them or explore the possibilities.
            4.  **Adopt a Voice:** Write in a clear, confident, and slightly informal voice. Imagine you're explaining this topic to a smart friend over coffee. Use contractions where appropriate (e.g., "it's," "you're").
            5.  **Format for Readability:** The final output must be a finished article in Markdown format, ready for publication. Use headings (H2, H3) as specified in the outline.
            
            Start directly with the H1 title. Do not include any of your own commentary, preambles, or postscripts like "Here is the article:".

            ---
            DETAILED OUTLINE TO TRANSFORM:
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