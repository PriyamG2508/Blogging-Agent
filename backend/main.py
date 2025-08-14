# backend/main.py

import os
import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Import your existing agent logic
from topic_search_agent import TopicSearchAgent
from content_gap_agent import ContentGapAgent
from outline_agent import OutlineAgent
from writing_agent import WritingAgent
from seo_agent import SEOAgent

# Initialize Agents
topic_agent = TopicSearchAgent()
gap_agent = ContentGapAgent()
outline_agent = OutlineAgent()
writing_agent = WritingAgent()
seo_agent = SEOAgent()

app = FastAPI()

# --- CORS Middleware ---
# This allows your frontend (running on a different port) to communicate with this backend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this to your frontend's domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- API Endpoints ---

@app.get("/api/topics")
async def get_topics():
    """
    Endpoint to fetch trending topics.
    This replaces the initial part of your command-line script.
    """
    print("API: Fetching trending topics...")
    topics = topic_agent.fetch_trending_topics()
    # We only need to send a subset of data to the frontend
    frontend_topics = [
        {
            "id": f"{topic['subreddit']}-{i}", # Create a simple unique ID
            "title": topic['title'],
            "subreddit": topic['subreddit'],
            "score": topic['score'],
            "num_comments": topic['num_comments'],
        }
        for i, topic in enumerate(topics[:10]) # Send top 10 topics
    ]
    return {"topics": frontend_topics}


@app.websocket("/ws/generate")
async def generate_article_ws(websocket: WebSocket):
    """
    WebSocket endpoint to handle the full blog generation pipeline.
    """
    await websocket.accept()
    try:
        # 1. Wait for the frontend to send the selected topic
        selected_topic = await websocket.receive_json()
        print(f"WS: Received topic: {selected_topic['title']}")

        # --- Start the LangGraph-like Pipeline ---

        # Step 1: Content Gap Analysis
        await websocket.send_json({"step": "Analyzing content gaps...", "progress": 25})
        gap_report = gap_agent.analyze_topic(selected_topic)
        if "error" in gap_report:
            raise Exception(gap_report["error"])

        # Step 2: Outline Generation
        await websocket.send_json({"step": "Generating strategic outline...", "progress": 50})
        blog_outline = outline_agent.create_outline(selected_topic['title'], gap_report)
        if not blog_outline:
            raise Exception("Failed to generate blog outline.")

        # Step 3: Writing First Draft
        await websocket.send_json({"step": "Writing first draft...", "progress": 75})
        first_draft = writing_agent.write_article(blog_outline)
        if not first_draft:
            raise Exception("Failed to write the first draft.")

        # Step 4: SEO Optimization
        await websocket.send_json({"step": "Optimizing for SEO & finalizing...", "progress": 90})
        # Simple keyword extraction for the SEO agent
        keywords = [word for word in selected_topic['title'].split() if len(word) > 4]
        seo_report = seo_agent.inspector(first_draft, keywords)
        final_article = seo_agent.rewrite_article(first_draft, seo_report)
        if not final_article:
            raise Exception("Failed to finalize the article with SEO optimization.")

        # --- Pipeline Complete ---
        await websocket.send_json({"step": "Done", "progress": 100, "article": final_article})

    except WebSocketDisconnect:
        print("WS: Client disconnected.")
    except Exception as e:
        print(f"Error during generation: {e}")
        # Send an error message to the frontend
        await websocket.send_json({"error": str(e)})
    finally:
        await websocket.close()

# --- To run this locally ---
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)