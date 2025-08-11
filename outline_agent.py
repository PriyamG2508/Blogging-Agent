from langchain_groq import ChatGroq
from blogger import BloggerState
import os 

class ContentStrategyAgent:
    def __init__(self):
        self.client = ChatGroq(api_key=os.getenv('GROQ_API_KEY'))
    
    def create_strategy(self, state: BloggerState) -> BloggerState:
        """Create content strategy using content gap analysis"""
        
        topic_info = state['selected_topic']
        topic_context = f"{topic_info['title']}\nContext: {topic_info['selftext']}"
        
        strategy_prompt = f"""
        Create a comprehensive blog outline for this trending topic:
        
        Topic: {topic_context}
        
        
        Create a detailed outline with:
        1. SEO-friendly title (60 chars max)
        2. Hook introduction (2-3 sentences)
        3. 4-6 main sections with subpoints
        4. Engaging conclusion
        5. Strong call-to-action
        
        Make it valuable for {state['target_audience']} using {state['tone']} tone.
        Focus on providing actionable insights and current information.
        """
        
        try:
            response = self.client.chat.completions.create(
                messages=[
                    {"role": "user", "content": strategy_prompt}
                ],
                model="llama3-8b-8192",  
                max_tokens=800,
                temperature=0.7
            )
            state['outline'] = response.choices[0].message.content
        except Exception as e:
            raise Exception(f"Strategy creation failed: {e}")
        
        return state['outline']