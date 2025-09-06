from langgraph.graph import StateGraph, START, END
from state_schema import BlogGenerationState
from langgraph_nodes import LangGraphNodes

def create_blog_generation_graph():
    """Creates and returns the compiled LangGraph workflow"""

    nodes = LangGraphNodes()
    graph = StateGraph(BlogGenerationState)

    # Add all the nodes
    graph.add_node("topic_search", nodes.topic_search_node)
    graph.add_node("topic_selection", nodes.topic_selection_node)
    graph.add_node("content_gap", nodes.content_gap_node)
    graph.add_node("verification", nodes.verification_node)
    graph.add_node("outline_generation", nodes.outline_generation_node)
    graph.add_node("writing", nodes.writing_node)
    graph.add_node("seo_optimization", nodes.seo_optimization_node) 

    # Define the graph's edges
    graph.add_edge(START, "topic_search")
    graph.add_edge("topic_search", "topic_selection")
    graph.add_edge("topic_selection", "content_gap")
    graph.add_edge("content_gap", "verification") # New edge
    graph.add_edge("verification", "outline_generation") # New edge
    graph.add_edge("outline_generation", "writing")
    graph.add_edge("writing", "seo_optimization") 
    graph.add_edge("seo_optimization", END) 
    return graph.compile()