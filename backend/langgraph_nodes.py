from typing import Dict, Any
from state_schema import BlogGenerationState
from topic_search_agent import TopicSearchAgent
from content_gap_agent import ContentGapAgent
from writing_agent import WritingAgent
from outline_agent import OutlineAgent
from seo_agent import SEOAgent

class LangGraphNodes:
    def __init__(self):
        self.topic_agent = TopicSearchAgent()
        self.gap_agent = ContentGapAgent()
        self.outline_agent = OutlineAgent()
        self.writing_agent = WritingAgent()
        self.seo_agent = SEOAgent()

    def topic_search_node(self, state: BlogGenerationState) -> BlogGenerationState:
        topics = self.topic_agent.fetch_trending_topics()
        state['all_topics'] = topics
        return state

    def topic_selection_node(self, state: BlogGenerationState) -> BlogGenerationState:
        # In the FastAPI app, the topic will be passed in the initial state.
        # This node can be adapted or bypassed depending on the final workflow.
        return state

    def content_gap_node(self, state: BlogGenerationState) -> BlogGenerationState:
        selected_topic = state.get('selected_topic')
        if selected_topic:
            gap_report = self.gap_agent.analyze_topic(selected_topic)
            if gap_report and 'error' not in gap_report:
                state['gap_analysis'] = gap_report
        return state
    
    def outline_generation_node(self, state: BlogGenerationState) -> BlogGenerationState:
        topic_title = state.get('topic_title')
        gap_analysis = state.get('gap_analysis')

        if topic_title and gap_analysis:
            outline = self.outline_agent.create_outline(topic_title, gap_analysis)
            if outline:
                state['blog_outline'] = outline
        return state

    def writing_node(self, state: dict) -> dict:
        outline = state.get('blog_outline')
        if outline:
            first_draft = self.writing_agent.write_article(outline)
            if first_draft:
                state['first_draft'] = first_draft
        return state

    def seo_optimization_node(self, state: BlogGenerationState) -> BlogGenerationState:
        first_draft = state.get('first_draft')
        topic_title = state.get('topic_title')

        if first_draft and topic_title:
            keywords = [word for word in topic_title.split() if len(word) > 4]
            seo_report = self.seo_agent.inspector(first_draft, keywords)
            state['seo_report'] = seo_report
            final_article = self.seo_agent.rewrite_article(first_draft, seo_report)
            if final_article:
                state['final_article'] = final_article
        return state