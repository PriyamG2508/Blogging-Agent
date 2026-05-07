# backend/main.py

import os
import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from starlette.websockets import WebSocketState
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
# Read allowed origins from environment variable for flexibility
ALLOWED_ORIGINS = os.environ.get(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,https://blogging-agent-silk.vercel.app"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Health check endpoint (helps with Render cold start monitoring) ---
@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "Backend is running"}

# --- API Endpoints ---

@app.get("/api/topics")
async def get_topics():
    print("API: Fetching trending topics...")
    try:
        topics = topic_agent.get_top_topics(limit=12)
        frontend_topics = [
            {
                "id": topic.get('id'),
                "title": topic.get('title'),
                "subreddit": topic.get('subreddit'),
                "score": topic.get('score', 0),
                "num_comments": topic.get('num_comments', 0),
            }
            for topic in topics
        ]
        return {"topics": frontend_topics}
    except Exception as e:
        print(f"Error fetching topics: {e}")
        return {"topics": [], "error": str(e)}


@app.websocket("/ws/generate")
async def generate_article_ws(websocket: WebSocket):
    await websocket.accept()
    try:
        selected_topic = await websocket.receive_json()
        print(f"WS: Received topic: {selected_topic.get('title')}")

        topic_title = selected_topic.get('title', '')

        # Step 1: Content Gap Analysis
        await websocket.send_json({"text": "Analyzing content gaps across the web...", "progress": 20})
        gap_report = gap_agent.analyze_topic(selected_topic)
        if "error" in gap_report:
            raise Exception(f"Gap analysis failed: {gap_report['error']}")
        await asyncio.sleep(1)

        factual_briefing = gap_agent.get_factual_briefing(topic_title)
        await asyncio.sleep(1)

        # Step 2: Outline Generation
        await websocket.send_json({"text": "Building strategic content outline...", "progress": 40})
        blog_outline = outline_agent.create_outline(topic_title, gap_report, factual_briefing)
        if not blog_outline:
            raise Exception("Failed to generate blog outline.")
        await asyncio.sleep(1)

        # Step 3: Writing First Draft
        await websocket.send_json({"text": "Writing the article draft...", "progress": 65})
        first_draft = writing_agent.write_article(blog_outline, factual_briefing)  # ← FIX: pass factual_briefing
        if not first_draft:
            raise Exception("Failed to write the first draft.")
        await asyncio.sleep(1)

        # Step 4: SEO Optimization
        await websocket.send_json({"text": "Optimizing for SEO and finalizing...", "progress": 85})
        keywords = [word for word in topic_title.split() if len(word) > 4]
        seo_report = seo_agent.inspector(first_draft, keywords)
        final_article = seo_agent.rewrite_article(first_draft, seo_report)
        if not final_article:
            raise Exception("Failed to finalize the article with SEO optimization.")
        await asyncio.sleep(1)

        # --- Pipeline Complete ---
        await websocket.send_json({"text": "Done!", "progress": 100, "article": final_article})

    except WebSocketDisconnect:
        print("WS: Client disconnected.")
    except Exception as e:
        print(f"Error during generation: {e}")
        # Send error BEFORE closing
        try:
            if websocket.client_state != WebSocketState.DISCONNECTED:
                await websocket.send_json({"error": str(e)})
        except Exception:
            pass
    finally:
        if websocket.client_state != WebSocketState.DISCONNECTED:
            try:
                await websocket.close()
                print("WS: Connection closed gracefully.")
            except RuntimeError:
                pass


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)