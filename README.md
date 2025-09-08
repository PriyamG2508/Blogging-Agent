# Blogging-Agent

Blogging-Agent is an autonomous AI content creation tool that streamlines the entire blogging process. From discovering trending topics to publishing SEO-optimized articles, this agent automates the heavy lifting, allowing you to focus on strategy and growth.

## Features

- **Trend Intelligence Engine**: Automatically discovers trending topics from various sources like Reddit to ensure your content is always relevant.
- **Competitive Gap Analysis**: Analyzes top-ranking articles for a given topic to identify content gaps and unanswered questions, providing a strategic advantage.
- **Expert-Level Writing**: Leverages advanced language models to generate high-quality, engaging, and publication-ready articles from a structured outline.
- **SEO Optimization Suite**: Fine-tunes articles for search engine optimization by adjusting keyword density, improving readability, and ensuring technical SEO best practices are met.
- **Interactive Frontend**: A user-friendly interface to select topics, monitor the generation process, and view the final article.

## Tech Stack

**Backend:**
- Python
- FastAPI
- LangChain & LangGraph
- Groq
- PRAW (Python Reddit API Wrapper)
- Google Custom Search API
- Gunicorn
- Uvicorn

**Frontend:**
- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Vercel

## Getting Started

### Prerequisites

- Python 3.8+
- Node.js and pnpm
- Git
- API keys for:
    - Groq
    - Google Custom Search Engine
    - Reddit

### Backend Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/priyamg2508/blogging-agent.git](https://github.com/priyamg2508/blogging-agent.git)
    cd blogging-agent/backend
    ```

2.  **Create a virtual environment and activate it:**
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```

3.  **Install the required packages:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Create a `.env` file in the `backend` directory and add your API keys:**
    ```
    GROQ_API_KEY="YOUR_GROQ_API_KEY"
    SEARCH_API_KEY="YOUR_GOOGLE_SEARCH_API_KEY"
    SEARCH_ENGINE_ID="YOUR_SEARCH_ENGINE_ID"
    REDDIT_CLIENT_ID="YOUR_REDDIT_CLIENT_ID"
    REDDIT_CLIENT_SECRET="YOUR_REDDIT_CLIENT_SECRET"
    REDDIT_USER_AGENT="BloggerAI/1.0 by YourUsername"
    ```

5.  **Run the backend server:**
    ```bash
    uvicorn main:app --reload
    ```
    The backend will be running at `http://localhost:8000`.

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd ../frontend
    ```

2.  **Install the dependencies:**
    ```bash
    pnpm install
    ```

3.  **Run the development server:**
    ```bash
    pnpm dev
    ```
    The frontend will be running at `http://localhost:3000`.

## Usage

1.  Open your browser and navigate to `http://localhost:3000`.
2.  The application will fetch and display a list of trending topics.
3.  Select a topic to start the article generation process.
4.  The agent will go through the following steps, with progress displayed on the screen:
    - Analyzing content gaps
    - Generating a strategic outline
    - Writing the first draft
    - Optimizing for SEO
5.  Once the article is ready, it will be displayed on the screen. You can then copy the content or download it as a markdown file.

## Project Structure

````

├── backend/
│   ├── blog_generation_graph.py
│   ├── content_gap_agent.py
│   ├── langgraph_nodes.py
│   ├── main.py
│   ├── outline_agent.py
│   ├── requirements.txt
│   ├── seo_agent.py
│   ├── state_schema.py
│   ├── topic_search_agent.py
│   └── writing_agent.py
├── frontend/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── public/
│   └── ...
└── README.md
````

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License.

