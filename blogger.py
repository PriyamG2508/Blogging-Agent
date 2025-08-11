import os
import requests
from dotenv import load_dotenv
from langgraph.graph import StateGraph, END
from typing import Dict, List, Optional, TypedDict, Annotated
from dataclasses import dataclass, field
import json
import time
from groq import Groq

# Load environment variables
load_dotenv()

# Type definitions for LangGraph
class BloggerState(TypedDict):
    # Research Phase
    trending_topics: List[Dict[str, any]]
    selected_topic: Dict[str, any]
    target_audience: str
    tone: str
    length: str
    
    # Content Phase
    outline: str
    blog_content: str
    
    # Quality Phase
    quality_score: float
    quality_issues: List[str]
    
    # SEO Phase
    seo_optimized_content: str
    meta_title: str
    meta_description: str
    keywords: List[str]
    
    # Review Phase
    user_feedback: str
    is_approved: bool
    improvement_suggestions: List[str]
    
    # Final
    final_blog: str

# Agent 1: Research Agent 
class ResearchAgent:
    def __init__(self):
        self.user_agent = 'BloggerAI/1.0'
    
    def fetch_trending_topics(self, state: BloggerState) -> BloggerState:
        """Fetch trending topics from Reddit using free JSON endpoints"""
        
        headers = {
            'User-Agent': self.user_agent
        }
        
        # Get hot posts from multiple popular subreddits using free JSON API
        subreddits = ['technology', 'science', 'worldnews', 'business', 'health', 'food', 'travel', 'fashion', 'sports',
                     'education', 'environment', 'psychology', 'artificial', 'futurology']
        
        all_topics = []
        
        for subreddit in subreddits[:6]:  
            try:
                url = f'https://www.reddit.com/r/{subreddit}/hot.json'
                params = {'limit': 15}
                
                response = requests.get(url, headers=headers, params=params)
                
                if response.status_code == 200:
                    data = response.json()
                    
                    for post in data['data']['children']:
                        post_data = post['data']
                        
                        # Criteria for good blog topics
                        if (post_data['score'] > 50 and  # Good engagement (lowered for free API)
                            len(post_data['title']) > 15 and  # Descriptive title
                            not post_data['over_18'] and  # Safe content
                            not post_data.get('is_video', False) and  # No videos
                            post_data['num_comments'] > 10):  # Discussion potential
                            
                            topic = {
                                'title': post_data['title'],
                                'subreddit': post_data['subreddit'],
                                'score': post_data['score'],
                                'comments': post_data['num_comments'],
                                'url': post_data['url'] if not post_data['is_self'] else f"https://reddit.com{post_data['permalink']}",
                                'selftext': post_data.get('selftext', '')[:200] + '...' if post_data.get('selftext') else '',
                                'created_utc': post_data['created_utc']
                            }
                            all_topics.append(topic)
                
                time.sleep(1)  
                
            except Exception as e:
                print(f"Error fetching from r/{subreddit}: {e}")
                continue
        
        if len(all_topics) < 5:
            raise Exception("Could not fetch enough trending topics. Please try again later.")
        
        # Sort by engagement score (upvotes + comments)
        all_topics.sort(key=lambda x: x['score'] + (x['comments'] * 2), reverse=True)
        
        # Get top 10 unique topics
        seen_titles = set()
        unique_topics = []
        
        for topic in all_topics:
            title_words = set(topic['title'].lower().split())
            is_similar = any(len(title_words.intersection(set(seen.lower().split()))) > 3 
                           for seen in seen_titles)
            
            if not is_similar and len(unique_topics) < 10:
                unique_topics.append(topic)
                seen_titles.add(topic['title'])
        
        if len(unique_topics) < 5:
            raise Exception(f"Could only find {len(unique_topics)} quality topics. Try again later.")
        
        state['trending_topics'] = unique_topics
        return state

# Agent 2: Content Strategy Agent 
class ContentStrategyAgent:
    def __init__(self):
        self.client = Groq(api_key=os.getenv('GROQ_API_KEY'))
    
    def create_strategy(self, state: BloggerState) -> BloggerState:
        """Analyze audience and create content strategy using Groq"""
        
        topic_info = state['selected_topic']
        topic_context = f"{topic_info['title']}\nContext: {topic_info['selftext']}"
        
        strategy_prompt = f"""
        Create a comprehensive blog outline for this trending topic:
        
        Topic: {topic_context}
        Target Audience: {state['target_audience']}
        Tone: {state['tone']}
        Length: {state['length']}
        
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
        
        return state

# Agent 3: Writing Agent 
class WritingAgent:
    def __init__(self):
        self.client = Groq(api_key=os.getenv('GROQ_API_KEY'))
    
    def generate_blog(self, state: BloggerState) -> BloggerState:
        """Generate full blog content from outline using Groq"""
    
        word_counts = {
            'short': '500-700 words',
            'medium': '800-1200 words', 
            'long': '1500-2000 words'
        }
        
        max_tokens = {
            'short': 1000,
            'medium': 1500,
            'long': 2500
        }
        
        writing_prompt = f"""
        Write a complete, high-quality blog post based on this outline:
        
        {state['outline']}
        
        Requirements:
        - Target audience: {state['target_audience']}
        - Tone: {state['tone']}
        - Length: {word_counts[state['length']]}
        - Include compelling subheadings (use ## format)
        - Make it engaging with examples and actionable advice
        - Add a strong introduction and conclusion
        - Include relevant statistics or facts where appropriate
        - Write in a conversational yet informative style
        
        Format the content with proper markdown formatting.
        """
        
        try:
            response = self.client.chat.completions.create(
                messages=[
                    {"role": "user", "content": writing_prompt}
                ],
                model="llama3-8b-8192",  # Free Groq model
                max_tokens=max_tokens[state['length']],
                temperature=0.7
            )
            state['blog_content'] = response.choices[0].message.content
        except Exception as e:
            raise Exception(f"Blog generation failed: {e}")
        
        return state

# Agent 4: Quality Assurance Agent 
class QualityAssuranceAgent:
    def __init__(self):
        self.client = Groq(api_key=os.getenv('GROQ_API_KEY'))
    
    def check_quality(self, state: BloggerState) -> BloggerState:
        """Comprehensive quality check on blog content using Groq"""
        
        qa_prompt = f"""
        Perform a detailed quality assessment of this blog content:
        
        {state['blog_content']}
        
        Evaluate on these criteria (rate each 1-10):
        1. Grammar and spelling accuracy
        2. Content structure and flow
        3. Audience appropriateness ({state['target_audience']})
        4. Tone consistency ({state['tone']})
        5. Factual accuracy and credibility
        6. Engagement and readability
        7. Completeness and depth
        8. Actionable value for readers
        
        Provide:
        - Overall Score: X/10
        - Top 3 strengths
        - Issues found (if any)
        - Specific improvement suggestions
        
        Format:
        SCORE: [number]/10
        STRENGTHS: [list]
        ISSUES: [list or "None found"]
        SUGGESTIONS: [list]
        """
        
        try:
            response = self.client.chat.completions.create(
                messages=[
                    {"role": "user", "content": qa_prompt}
                ],
                model="llama3-8b-8192",
                max_tokens=600,
                temperature=0.3
            )
            
            qa_result = response.choices[0].message.content
            
            # Parse results
            if "SCORE:" in qa_result:
                score_line = qa_result.split("SCORE:")[1].split("\n")[0]
                try:
                    state['quality_score'] = float(score_line.split("/")[0].strip())
                except:
                    state['quality_score'] = 7.0
            else:
                state['quality_score'] = 7.0
            
            if "ISSUES:" in qa_result:
                issues_section = qa_result.split("ISSUES:")[1].split("SUGGESTIONS:")[0].strip()
                if "none found" not in issues_section.lower():
                    state['quality_issues'] = [issues_section]
                else:
                    state['quality_issues'] = []
            else:
                state['quality_issues'] = []
            
        except Exception as e:
            print(f"Quality assessment error: {e}")
            # Set default values
            state['quality_score'] = 7.0
            state['quality_issues'] = []
        
        return state

# Agent 5: SEO Agent 
class SEOAgent:
    def __init__(self):
        self.client = Groq(api_key=os.getenv('GROQ_API_KEY'))
    
    def optimize_seo(self, state: BloggerState) -> BloggerState:
        """Optimize content for search engines using Groq"""
        
        topic_title = state['selected_topic']['title']
        
        seo_prompt = f"""
        Optimize this blog content for SEO while maintaining quality:
        
        Original Topic: {topic_title}
        Content: {state['blog_content']}
        
        Provide SEO optimization:
        
        1. SEO Title (50-60 characters, include main keyword)
        2. Meta Description (150-160 characters, compelling and keyword-rich)
        3. 5 Primary Keywords (relevant to topic and audience)
        4. Enhanced Content (improve keyword density naturally, add internal linking suggestions)
        
        Format your response as:
        TITLE: [optimized title]
        META: [meta description]
        KEYWORDS: keyword1, keyword2, keyword3, keyword4, keyword5
        CONTENT: [SEO-optimized content with same structure but better keyword placement]
        """
        
        try:
            response = self.client.chat.completions.create(
                messages=[
                    {"role": "user", "content": seo_prompt}
                ],
                model="llama3-8b-8192",
                max_tokens=3000,
                temperature=0.5
            )
            
            seo_result = response.choices[0].message.content
            
            # Parse SEO components
            try:
                if "TITLE:" in seo_result:
                    title_section = seo_result.split("TITLE:")[1].split("META:")[0].strip()
                    state['meta_title'] = title_section
                else:
                    state['meta_title'] = topic_title[:57] + "..."
                
                if "META:" in seo_result:
                    meta_section = seo_result.split("META:")[1].split("KEYWORDS:")[0].strip()
                    state['meta_description'] = meta_section
                else:
                    state['meta_description'] = f"Complete guide to {topic_title[:100]}..."
                
                if "KEYWORDS:" in seo_result:
                    keywords_section = seo_result.split("KEYWORDS:")[1].split("CONTENT:")[0].strip()
                    state['keywords'] = [k.strip() for k in keywords_section.split(",")]
                else:
                    state['keywords'] = [word.lower() for word in topic_title.split()[:5]]
                
                if "CONTENT:" in seo_result:
                    content_section = seo_result.split("CONTENT:")[1].strip()
                    state['seo_optimized_content'] = content_section
                else:
                    state['seo_optimized_content'] = state['blog_content']
                    
            except Exception as parse_error:
                print(f"SEO parsing error: {parse_error}")
                # Use fallbacks
                state['meta_title'] = topic_title[:57] + "..."
                state['meta_description'] = f"Complete guide to {topic_title[:100]}..."
                state['keywords'] = [word.lower() for word in topic_title.split()[:5]]
                state['seo_optimized_content'] = state['blog_content']
                
        except Exception as e:
            print(f"SEO optimization error: {e}")
            # Use fallbacks
            state['meta_title'] = topic_title[:57] + "..."
            state['meta_description'] = f"Complete guide to {topic_title[:100]}..."
            state['keywords'] = [word.lower() for word in topic_title.split()[:5]]
            state['seo_optimized_content'] = state['blog_content']
        
        return state

# Agent 6: Review Coordinator
class ReviewCoordinator:
    def present_for_review(self, state: BloggerState) -> BloggerState:
        """Present content to user for review"""
        
        print("\n" + "="*60)
        print("📝 BLOG CONTENT READY FOR REVIEW")
        print("="*60)
        print(f"📌 Title: {state['meta_title']}")
        print(f"📄 Meta Description: {state['meta_description']}")
        print(f"🔍 Keywords: {', '.join(state['keywords'])}")
        print(f"⭐ Quality Score: {state['quality_score']}/10")
        
        if state['quality_issues']:
            print(f"⚠️  Issues Found: {', '.join(state['quality_issues'])}")
        
        print(f"\n📰 Content Preview:")
        print("-" * 40)
        # Show first 500 characters
        preview = state['seo_optimized_content'][:500] + "..." if len(state['seo_optimized_content']) > 500 else state['seo_optimized_content']
        print(preview)
        print("-" * 40)
        
        print(f"\n📊 Full Content ({len(state['seo_optimized_content'])} characters)")
        print("1. View full content")
        print("2. Approve and finish")
        print("3. Request improvements")
        
        choice = input("\nEnter your choice (1/2/3): ").strip()
        
        if choice == "1":
            print("\n" + "="*60)
            print("FULL BLOG CONTENT")
            print("="*60)
            print(state['seo_optimized_content'])
            print("="*60)
            
            final_choice = input("\nApprove? (y/n) or provide feedback: ").strip()
            if final_choice.lower() in ['y', 'yes']:
                state['is_approved'] = True
                state['final_blog'] = state['seo_optimized_content']
            else:
                state['is_approved'] = False
                state['user_feedback'] = final_choice if final_choice.lower() not in ['n', 'no'] else "Please improve the overall quality and engagement"
        
        elif choice == "2":
            state['is_approved'] = True
            state['final_blog'] = state['seo_optimized_content']
        
        elif choice == "3":
            feedback = input("What improvements would you like? ")
            state['is_approved'] = False
            state['user_feedback'] = feedback
        
        else:
            print("Invalid choice. Assuming approval.")
            state['is_approved'] = True
            state['final_blog'] = state['seo_optimized_content']
        
        return state

# Agent 7: Enhancement Agent 
class EnhancementAgent:
    def __init__(self):
        self.client = Groq(api_key=os.getenv('GROQ_API_KEY'))
    
    def improve_content(self, state: BloggerState) -> BloggerState:
        """Improve content based on user feedback using Groq"""
        
        improvement_prompt = f"""
        Improve this blog content based on specific user feedback:
        
        Current Content: {state['seo_optimized_content']}
        
        User Feedback: {state['user_feedback']}
        Quality Issues: {', '.join(state['quality_issues']) if state['quality_issues'] else 'None'}
        
        Requirements:
        - Address all user feedback points specifically
        - Maintain SEO optimization and keyword placement
        - Keep the same overall structure and length
        - Improve engagement and readability
        - Ensure content remains valuable for {state['target_audience']}
        
        Provide the improved content while maintaining the same format.
        """
        
        try:
            response = self.client.chat.completions.create(
                messages=[
                    {"role": "user", "content": improvement_prompt}
                ],
                model="llama3-8b-8192",
                max_tokens=3000,
                temperature=0.6
            )
            
            state['seo_optimized_content'] = response.choices[0].message.content
            
        except Exception as e:
            raise Exception(f"Content improvement failed: {e}")
        
        return state

# User Input Helper 
class UserInputHelper:
    @staticmethod
    def get_user_preferences():
        """Get user preferences with predefined options"""
        
        print("\n📊 SELECT YOUR PREFERENCES:")
        print("=" * 40)
        
        # Audience options
        audiences = {
            '1': 'General Public',
            '2': 'Tech Professionals', 
            '3': 'Business Owners',
            '4': 'Students & Researchers',
            '5': 'Industry Experts',
            '6': 'Beginners/Newcomers'
        }
        
        print("🎯 TARGET AUDIENCE:")
        for key, value in audiences.items():
            print(f"  {key}. {value}")
        
        audience_choice = input("Select audience (1-6): ").strip()
        target_audience = audiences.get(audience_choice, audiences['1'])
        
        # Tone options
        tones = {
            '1': 'Professional & Formal',
            '2': 'Conversational & Friendly', 
            '3': 'Educational & Informative',
            '4': 'Casual & Relaxed',
            '5': 'Authoritative & Expert',
            '6': 'Inspirational & Motivational'
        }
        
        print("\n🎭 TONE:")
        for key, value in tones.items():
            print(f"  {key}. {value}")
        
        tone_choice = input("Select tone (1-6): ").strip()
        tone = tones.get(tone_choice, tones['2'])
        
        # Length options
        lengths = {
            '1': 'short',    
            '2': 'medium',   
            '3': 'long'      
        }
        
        print("\n📏 LENGTH:")
        print("  1. Short (500-700 words) - Quick read")
        print("  2. Medium (800-1200 words) - Detailed guide") 
        print("  3. Long (1500-2000 words) - Comprehensive article")
        
        length_choice = input("Select length (1-3): ").strip()
        length = lengths.get(length_choice, lengths['2'])
        
        return target_audience, tone, length

# Main Blogger AI Agent 
class BloggerAIAgent:
    def __init__(self):
        # Validate environment variables
        required_vars = ['GROQ_API_KEY']
        missing_vars = [var for var in required_vars if not os.getenv(var)]
        
        if missing_vars:
            raise Exception(f"Missing environment variables: {', '.join(missing_vars)}")
        
        # Initialize agents
        self.research_agent = ResearchAgent()
        self.strategy_agent = ContentStrategyAgent()
        self.writing_agent = WritingAgent()
        self.qa_agent = QualityAssuranceAgent()
        self.seo_agent = SEOAgent()
        self.review_coordinator = ReviewCoordinator()
        self.enhancement_agent = EnhancementAgent()
        
        # Create workflow
        self.workflow = self.create_workflow()
    
    def create_workflow(self) -> StateGraph:
        """Create the LangGraph workflow"""
        
        workflow = StateGraph(BloggerState)
        
        # Add nodes
        workflow.add_node("research", self.research_agent.fetch_trending_topics)
        workflow.add_node("strategy", self.strategy_agent.create_strategy)
        workflow.add_node("writing", self.writing_agent.generate_blog)
        workflow.add_node("qa", self.qa_agent.check_quality)
        workflow.add_node("seo", self.seo_agent.optimize_seo)
        workflow.add_node("review", self.review_coordinator.present_for_review)
        workflow.add_node("enhance", self.enhancement_agent.improve_content)
        
        # Define edges
        workflow.add_edge("research", "strategy")
        workflow.add_edge("strategy", "writing")
        workflow.add_edge("writing", "qa")
        workflow.add_edge("qa", "seo")
        workflow.add_edge("seo", "review")
        
        # Conditional routing after review
        def route_after_review(state: BloggerState) -> str:
            return END if state['is_approved'] else "enhance"
        
        workflow.add_conditional_edges(
            "review",
            route_after_review,
            {END: END, "enhance": "enhance"}
        )
        
        # After enhancement, go back to SEO
        workflow.add_edge("enhance", "seo")
        
        workflow.set_entry_point("research")
        
        return workflow.compile()
    
    def run(self):
        """Run the complete blogger AI agent workflow"""
        
        print("🤖 BLOGGER AI AGENT STARTING...")
        print("🔍 Fetching trending topics from Reddit (Free API)...")
        
        # Initialize state
        initial_state = BloggerState(
            trending_topics=[],
            selected_topic={},
            target_audience="",
            tone="",
            length="",
            outline="",
            blog_content="",
            quality_score=0.0,
            quality_issues=[],
            seo_optimized_content="",
            meta_title="",
            meta_description="",
            keywords=[],
            user_feedback="",
            is_approved=False,
            improvement_suggestions=[],
            final_blog=""
        )
        
        try:
            # Fetch trending topics
            state = self.research_agent.fetch_trending_topics(initial_state)
            
            # Display topics for user selection
            print(f"\n📈 TOP {len(state['trending_topics'])} TRENDING TOPICS FROM REDDIT:")
            print("=" * 50)
            
            for i, topic in enumerate(state['trending_topics'], 1):
                print(f"{i:2d}. {topic['title']}")
                print(f"    📍 r/{topic['subreddit']} | ⬆️ {topic['score']} | 💬 {topic['comments']}")
                if topic['selftext']:
                    print(f"    💭 {topic['selftext'][:100]}...")
                print()
            
            # Get user topic selection
            while True:
                try:
                    choice = int(input(f"Select topic (1-{len(state['trending_topics'])}): ")) - 1
                    if 0 <= choice < len(state['trending_topics']):
                        state['selected_topic'] = state['trending_topics'][choice]
                        break
                    else:
                        print(f"Please enter a number between 1-{len(state['trending_topics'])}")
                except ValueError:
                    print("Please enter a valid number")
            
            # Get user preferences
            target_audience, tone, length = UserInputHelper.get_user_preferences()
            state['target_audience'] = target_audience
            state['tone'] = tone
            state['length'] = length
            
            print(f"\n✅ CONFIGURATION COMPLETE:")
            print(f"📝 Topic: {state['selected_topic']['title']}")
            print(f"🎯 Audience: {target_audience}")
            print(f"🎭 Tone: {tone}")
            print(f"📏 Length: {length}")
            
            print(f"\n🚀 GENERATING BLOG CONTENT WITH GROQ...")
            print("⏳ This may take 2-3 minutes...\n")
            
            # Execute workflow
            final_result = self.workflow.invoke(state)
            
            if final_result['is_approved']:
                print("\n" + "🎉" * 20)
                print("✅ BLOG SUCCESSFULLY GENERATED!")
                print("🎉" * 20)
                
                filename = f"blog_{int(time.time())}.md"
                with open(filename, 'w', encoding='utf-8') as f:
                    f.write(f"# {final_result['meta_title']}\n\n")
                    f.write(f"**Meta Description:** {final_result['meta_description']}\n")
                    f.write(f"**Keywords:** {', '.join(final_result['keywords'])}\n")
                    f.write(f"**Quality Score:** {final_result['quality_score']}/10\n\n")
                    f.write("---\n\n")
                    f.write(final_result['final_blog'])
                
                print(f"💾 Blog saved to: {filename}")
                
            return final_result
            
        except Exception as e:
            print(f"❌ Error: {e}")
            return None

# Usage Example and Requirements
def main():
    """Main function to run the Blogger AI Agent"""    
    try:
        agent = BloggerAIAgent()
        result = agent.run()
        
        if result:
            print("\n🎯 PROJECT COMPLETED SUCCESSFULLY!")
        else:
            print("\n❌ PROJECT FAILED. Check your API key and try again.")
            
    except Exception as e:
        print(f"❌ Initialization failed: {e}")

if __name__ == "__main__":
    main()
