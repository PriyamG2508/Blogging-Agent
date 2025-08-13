# langgraph_nodes.py
from typing import Dict, Any
from state_schema import BlogGenerationState
from topic_search_agent import TopicSearchAgent
from content_gap_agent import ContentGapAgent
from writing_agent import WritingAgent
from outline_agent import OutlineAgent
from seo_agent import SEOAgent # Import the new agent

class LangGraphNodes:
    """Contains all node functions for the LangGraph workflow"""

    def __init__(self):
        self.topic_agent = TopicSearchAgent()
        self.gap_agent = ContentGapAgent()
        self.outline_agent = OutlineAgent()
        self.writing_agent = WritingAgent()
        self.seo_agent = SEOAgent() # Instantiate the new agent

    def topic_search_node(self, state: BlogGenerationState) -> BlogGenerationState:
        """Node 1: Search and rank trending topics"""
        print("🔍 Searching for trending topics...")
        topics = self.topic_agent.fetch_trending_topics()
        state['all_topics'] = topics
        print(f"Found {len(topics)} topics")
        return state

    def topic_selection_node(self, state: BlogGenerationState) -> BlogGenerationState:
        """Node 2: Handle user topic selection"""
        print("\nTopic Selection Phase")
        topics = state.get('all_topics', [])
        selected_topic = self.gap_agent.present_topics_for_selection(topics)
        if selected_topic:
            state['selected_topic'] = selected_topic
            state['topic_title'] = selected_topic['title']
            print(f"Selected: {selected_topic['title']}")
        return state

    def content_gap_node(self, state: BlogGenerationState) -> BlogGenerationState:
        """Node 3: Analyze content gaps in selected topic"""
        print("\nContent Gap Analysis Phase")
        selected_topic = state.get('selected_topic')
        if selected_topic:
            gap_report = self.gap_agent.analyze_topic(selected_topic)
            if gap_report and 'error' not in gap_report:
                state['gap_analysis'] = gap_report
                print("Gap analysis completed")
        return state

    def outline_generation_node(self, state: BlogGenerationState) -> BlogGenerationState:
        """Node 4: Generate blog outline from gap analysis"""
        print("\nOutline Generation Phase")
        topic_title = state.get('topic_title')
        gap_analysis = state.get('gap_analysis')
        if topic_title and gap_analysis:
            outline = self.outline_agent.create_outline(topic_title, gap_analysis)
            if outline:
                state['blog_outline'] = outline
                print("Blog outline generated successfully")
        return state

    def writing_node(self, state: dict) -> dict:
        """Node 5: Generate the first draft from the outline."""
        print("\nWriting Agent Phase")
        outline = state.get('blog_outline')
        if outline:
            first_draft = self.writing_agent.write_article(outline)
            if first_draft:
                state['first_draft'] = first_draft # Save as first_draft
                print("First draft generated successfully.")
        return state

    def seo_optimization_node(self, state: BlogGenerationState) -> BlogGenerationState:
        """Node 6: Analyze and rewrite the article for SEO."""
        print("\nSEO Optimization Phase")
        first_draft = state.get('first_draft')
        topic_title = state.get('topic_title')

        if first_draft and topic_title:
            # Simple keyword extraction from the title for analysis
            keywords = [word for word in topic_title.split() if len(word) > 4]

            # 1. Run the inspector
            seo_report = self.seo_agent.inspector(first_draft, keywords)
            state['seo_report'] = seo_report

            # 2. Rewrite the article based on the report
            final_article = self.seo_agent.rewrite_article(first_draft, seo_report)
            if final_article:
                state['final_article'] = final_article
                print("SEO-optimized article generated successfully.")
        return state