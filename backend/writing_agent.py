import os
from groq import Groq
from dotenv import load_dotenv
from langchain.prompts import PromptTemplate

class WritingAgent:
    def __init__(self):
        load_dotenv()
        groq_api_key = os.getenv('GROQ_API_KEY')

        if not groq_api_key:
            raise ValueError("GROQ_API_KEY not found in .env file.")

        self.client = Groq(api_key=groq_api_key)

    def write_article(self, outline: str) -> str:
        template_string = """
        You are a world-class blog writer and storyteller, an expert in transforming structured outlines into compelling, narrative-driven articles. Your writing is known for its clarity, authority, and engaging, conversational tone.

        **Your Mission: Write a Masterpiece (800-1200 words)**
        Transform the following detailed outline into a complete, well-written, and publish-ready blog post.

        **Crucial Directives:**
        1.  **Do Not Be a Robot:** Your job is not to mechanically convert bullet points into paragraphs. You must *interpret* the outline, find the story within it, and weave the points into a smooth, readable narrative.
        2.  **Create a Narrative Flow:** Start with a powerful hook that grabs the reader's attention. Each section must flow logically and seamlessly into the next. Use sophisticated transitional phrases.
        3.  **Elaborate with Authority:** The outline points are seeds. You must grow them. Provide rich context, explain the "why" behind the data, and use vivid analogies or real-world examples to make complex topics easy to understand.
        4.  **Adopt a Specific Voice:** Write in a clear, confident, and slightly informal voice. Imagine you're explaining this to an intelligent colleague over coffee. Use contractions naturally (e.g., "it's," "you're," "can't").
        5.  **Format for Readability:** The final output must be a finished article in Markdown format. Use headings (H2, H3) as specified in the outline. Keep paragraphs concise (2-4 sentences).
        6.  **Execute the Placeholders:** When you encounter a placeholder like `[Placeholder: Insert a compelling expert quote or a data point here]`, you must invent a realistic and relevant quote or statistic to put in its place.
        7.  **No Commentary:** Start directly with the H1 title from the outline. Do not include any of your own commentary, preambles, or postscripts like "Here is the article:".

        ---
        **THE BLUEPRINT TO TRANSFORM:**
        {outline}
        ---
        """
        prompt_template = PromptTemplate(template=template_string, input_variables=['outline'])
        final_prompt = prompt_template.format(outline=outline)

        try:
            response = self.client.chat.completions.create(
                messages=[{"role": "user","content": final_prompt,}],
                model="llama-3.1-8b-instant"
            )

            if response.choices and response.choices[0].message.content:
                return response.choices[0].message.content
            else:
                return ""
        except Exception as e:
            # In a production environment, you might want to log this exception.
            return ""