# api_server.py

# --- Part 1: Imports ---
# We import FastAPI to create the server, and other tools.
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Any

# Import your existing AI agent classes
from topic_search_agent import TopicSearchAgent
from content_gap_agent import ContentGapAgent
from outline_agent import OutlineAgent
from writing_agent import WritingAgent
from seo_agent import SEOAgent

# --- Part 2: Create the App and Handle Permissions (CORS) ---
# This creates the main application object
app = FastAPI()

# This is like a permission slip. It tells the backend that it's okay
# to accept requests from our frontend running on localhost:3000.
# Without this, the browser would block the requests for security reasons.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Part 3: Define Data Structures ---
# This tells our API what the incoming data for selecting a topic should look like.
class TopicRequest(BaseModel):
    topic: Dict[str, Any]

# --- Part 4: Initialize Your AI Agents ---
# We create one instance of each agent when the server starts.
# This is efficient because we don't have to re-create them for every request.
topic_agent = TopicSearchAgent()
gap_agent = ContentGapAgent()
outline_agent = OutlineAgent()
writing_agent = WritingAgent()
seo_agent = SEOAgent()


# --- Part 5: Create the API Endpoints (The "Menu") ---

# This creates a URL at http://localhost:8000/api/find-topics
@app.get("/api/find-topics")
async def find_topics():
    """
    This function runs when the frontend asks for topics.
    It uses your TopicSearchAgent to get the top 10 topics.
    """
    print("Backend: Received request to find topics.")
    try:
        topics = topic_agent.get_top_topics(limit=10)
        return {"topics": topics}
    except Exception as e:
        print(f"Error in find_topics: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# This creates a URL at http://localhost:8000/api/generate-article
@app.post("/api/generate-article")
async def generate_article(request: TopicRequest):
    """
    This function runs when the frontend sends a selected topic.
    It orchestrates all the other agents in sequence to produce the final article.
    """
    selected_topic = request.topic
    print(f"Backend: Received request to generate article for: {selected_topic.get('title')}")

    try:
        # Step 1: Content Gap Analysis
        gap_analysis = gap_agent.analyze_topic(selected_topic)
        if not gap_analysis or 'error' in gap_analysis:
            raise HTTPException(status_code=500, detail="Failed at Content Gap Analysis stage.")

        # Step 2: Outline Generation
        outline = outline_agent.create_outline(selected_topic['title'], gap_analysis)
        if not outline:
            raise HTTPException(status_code=500, detail="Failed at Outline Generation stage.")

        # Step 3: First Draft Writing
        first_draft = writing_agent.write_article(outline)
        if not first_draft:
            raise HTTPException(status_code=500, detail="Failed at Writing stage.")

        # Step 4: SEO Optimization
        keywords = [word for word in selected_topic['title'].split() if len(word) > 4]
        seo_report = seo_agent.inspector(first_draft, keywords)
        final_article = seo_agent.rewrite_article(first_draft, seo_report)
        
        if not final_article or "Error" in final_article:
             raise HTTPException(status_code=500, detail="Failed at SEO Optimization stage.")

        print("Backend: Successfully generated final article.")
        return {"final_article": final_article}

    except Exception as e:
        print(f"An error occurred during article generation: {e}")
        # If it's already an HTTPException, re-raise it, otherwise create a new one.
        if isinstance(e, HTTPException):
            raise e
        else:
            raise HTTPException(status_code=500, detail=str(e))