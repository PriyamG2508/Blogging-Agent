import re
import time
from blog_generation_graph import create_blog_generation_graph

def create_safe_filename(title):
    """Creates a safe, short filename from an article title."""
    if not title:
        return f"blog_{int(time.time())}.md"
    clean_title = title.replace('# H1: ', '').strip()
    safe_title = re.sub(r'[^\w\s-]', '', clean_title).strip().replace(' ', '_').lower()
    return f"{safe_title[:50]}.md"

def main():
    """Main execution function using a simplified LangGraph workflow"""
    print("Starting Blog Generation")
    print("=" * 60)

    app = create_blog_generation_graph()

    initial_state = {
        "all_topics": None,
        "selected_topic": None,
        "topic_title": None,
        "gap_analysis": None,
        "blog_outline": None,
        "final_article": None,
    }

    try:
        final_state = app.invoke(initial_state)

        print("\n" + "=" * 60)
        print("WORKFLOW COMPLETED")
        print("=" * 60)

        final_article = final_state.get('final_article')
        if final_article:
            print("SUCCESS: Final article generated!")
            # Save the final article to a file
            title_line = final_article.splitlines()[0] if final_article else "untitled_blog"
            filename = create_safe_filename(title_line)

            with open(filename, 'w', encoding='utf-8') as f:
                f.write(final_article)

            print(f"\nBlog saved to: {filename}")
        else:
            print("WORKFLOW FAILED: No final article was generated.")

    except Exception as e:
        print(f"\nCRITICAL ERROR during graph execution: {e}")
        print("Please check your API keys, internet connection, and agent logic.")

if __name__ == "__main__":
    main()