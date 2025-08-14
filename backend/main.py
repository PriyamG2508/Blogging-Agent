# backend/main.py

import os
import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import uuid

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
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- API Endpoints ---

@app.get("/api/topics")
async def get_topics():
    print("API: Fetching trending topics...")
    topics = topic_agent.get_top_topics(limit=12)
    frontend_topics = [
        {
            "id": str(uuid.uuid4()),
            "title": topic.get('title'),
            "subreddit": topic.get('subreddit'),
            "score": topic.get('score', 0),
            "num_comments": topic.get('num_comments', 0),
        }
        for topic in topics
    ]
    return {"topics": frontend_topics}


@app.websocket("/ws/generate")
async def generate_article_ws(websocket: WebSocket):
    await websocket.accept()
    try:
        selected_topic = await websocket.receive_json()
        print(f"WS: Received topic: {selected_topic.get('title')}")

        # --- Start the LangGraph-like Pipeline ---

        # Step 1: Content Gap Analysis
        await websocket.send_json({"text": "Analyzing content gaps...", "progress": 25})
        gap_report = gap_agent.analyze_topic(selected_topic)
        if "error" in gap_report:
            raise Exception(gap_report["error"])
        await asyncio.sleep(2) # Add a 2-second delay for UX

        # Step 2: Outline Generation
        await websocket.send_json({"text": "Generating strategic outline...", "progress": 50})
        blog_outline = outline_agent.create_outline(selected_topic['title'], gap_report)
        if not blog_outline:
            raise Exception("Failed to generate blog outline.")
        await asyncio.sleep(2) # Add a 2-second delay for UX

        # Step 3: Writing First Draft
        await websocket.send_json({"text": "Writing first draft...", "progress": 75})
        first_draft = writing_agent.write_article(blog_outline)
        if not first_draft:
            raise Exception("Failed to write the first draft.")
        await asyncio.sleep(2) # Add a 2-second delay for UX

        # Step 4: SEO Optimization
        await websocket.send_json({"text": "Optimizing for SEO & finalizing...", "progress": 90})
        keywords = [word for word in selected_topic['title'].split() if len(word) > 4]
        seo_report = seo_agent.inspector(first_draft, keywords)
        final_article = seo_agent.rewrite_article(first_draft, seo_report)
        if not final_article:
            raise Exception("Failed to finalize the article with SEO optimization.")
        await asyncio.sleep(1) # Add a 1-second delay for UX

        # --- Pipeline Complete ---
        await websocket.send_json({"text": "Done", "progress": 100, "article": final_article})

    except WebSocketDisconnect:
        print("WS: Client disconnected.")
    except Exception as e:
        print(f"Error during generation: {e}")
        await websocket.send_json({"error": str(e)})
    finally:
        await websocket.close()

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)