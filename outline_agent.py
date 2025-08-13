# outline_agent.py

import json
import os
from dotenv import load_dotenv
from groq import Groq # Import Groq
from langchain.prompts import PromptTemplate

class OutlineAgent:
    """
    An agent to generate an outline from the analyzed gaps.
    This version uses the Groq API for more reliable content generation.
    """
    
    def __init__(self):
        load_dotenv()
        # Use the Groq API Key
        groq_api_key = os.getenv("GROQ_API_KEY")
        if not groq_api_key:
            raise ValueError("GROQ_API_KEY not found in .env file.")
            
        # Initialize the Groq client
        self.client = Groq(api_key=groq_api_key)
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

            Now, generate the complete blog post outline. Start directly with the H1 title. Do not add any commentary before or after the outline.
        """
        
        prompt_template = PromptTemplate(template=template_string, input_variables=['topic_title', 'gap_report'])
        report_string = json.dumps(gap_report, indent=2)
        final_prompt = prompt_template.format(topic_title=topic_title, gap_report=report_string)
        
        try:
            # Use the Groq client to generate the outline
            response = self.client.chat.completions.create(
                messages=[{"role": "user", "content": final_prompt}],
                model="llama3-8b-8192" 
            )

            if response.choices and response.choices[0].message.content:
                return response.choices[0].message.content
            else:
                print("❌ OUTLINE AGENT FAILED: Groq API returned an empty response.")
                return ""

        except Exception as e:
            print(f"❌ An exception occurred in the Groq Outline Agent: {e}")
            return ""
        
import os
import json
from dotenv import load_dotenv
from outline_agent import OutlineAgent

# Load environment variables
load_dotenv()

def run_test():
    """A simple script to test the OutlineAgent in isolation."""
    try:
        # Instantiate the agent
        agent = OutlineAgent()

        # The topic title and gap report from the successful Content Gap Analysis
        test_topic_title = "Meta hires anti-diversity activist Robby Starbuck as AI advisor to settle lawsuit"
        test_gap_report = {
            "summary": "The search results primarily focus on the controversy surrounding Robby Starbuck's appointment as an AI advisor. However, there is a lack of in-depth discussion on the broader implications of this hire, such as its impact on AI development and the role of DEI.",
            "gaps": [
                {
                    "topic": "The Definition of AI Bias",
                    "description": "None of the search results provide a comprehensive definition of AI bias or what constitutes fairness in AI. A deeper discussion on the topic can foster a better understanding of the issues involved."
                },
                {
                    "topic": "Technical Aspects of AI Bias",
                    "description": "While the results touch on the controversy, none delve into the technical aspects of AI bias, such as how AI models can perpetuate biases and what methods are used to identify and mitigate them. Providing technical insights can enhance the overall understanding of the subject."
                },
                {
                    "topic": "Alternatives to Robby Starbuck",
                    "description": "The search results focus solely on Starbuck's appointment, without exploring alternative perspectives or experts who could have been considered for the role. Discussing potential alternatives or other approaches to addressing AI bias can broaden the conversation."
                },
                {
                    "topic": "The Role of DEI in AI Development",
                    "description": "The search results highlight Starbuck's anti-DEI views, but there is no discussion on the importance of Diversity, Equity, and Inclusion (DEI) in AI development. Exploring the relationship between DEI and AI can lead to a more comprehensive understanding of the subject."
                },
                {
                    "topic": "Long-term Impact on AI Development",
                    "description": "The search results primarily focus on the controversy surrounding Starbuck's appointment. However, there is limited discussion on the long-term implications of allowing anti-diversity activists to influence AI development. A deeper analysis of the potential consequences can provide valuable insights for future AI development."
                },
                {
                    "topic": "Resources for Addressing AI Bias",
                    "description": "The search results do not provide resources for individuals or organizations seeking to address AI bias in their own projects or systems. Providing resources, such as guides, tutorials, or toolkits, can empower readers to take action against AI bias."
                }
            ]
        }

        print("--- Starting Test of OutlineAgent ---")
        blog_outline = agent.create_outline(test_topic_title, test_gap_report)

        print("\n--- Test Completed ---")
        if blog_outline:
            print("✅ Success! Outline generated. Check the output below:")
            print("=" * 60)
            print(blog_outline)
            print("=" * 60)
        else:
            print("❌ Failure: Outline Agent returned an empty response. This may indicate an API or prompt issue.")

    except ValueError as e:
        print(f"❌ Initialization Error: {e}")
    except Exception as e:
        print(f"❌ An unexpected error occurred: {e}")

if __name__ == "__main__":
    run_test()