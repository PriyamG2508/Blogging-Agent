from langgraph.graph import StateGraph, START, END
from state_schema import BlogGenerationState
from langgraph_nodes import LangGraphNodes

def create_blog_generation_graph():
    """Creates and returns the compiled LangGraph workflow"""

    nodes = LangGraphNodes()
    graph = StateGraph(BlogGenerationState)

    graph.add_node("topic_search", nodes.topic_search_node)
    graph.add_node("topic_selection", nodes.topic_selection_node)
    graph.add_node("content_gap", nodes.content_gap_node)
    graph.add_node("outline_generation", nodes.outline_generation_node)
    graph.add_node("writing", nodes.writing_node)

    graph.add_edge(START, "topic_search")
    graph.add_edge("topic_search", "topic_selection")
    graph.add_edge("topic_selection", "content_gap")
    graph.add_edge("content_gap", "outline_generation")
    graph.add_edge("outline_generation", "writing")
    graph.add_edge("writing", END)

    return graph.compile()