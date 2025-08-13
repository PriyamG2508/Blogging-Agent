import json
from topic_search_agent import TopicSearchAgent
from content_gap_agent import ContentGapAgent
from outline_agent import OutlineAgent

if __name__ == '__main__':
    try:
        # STAGE 1: DISCOVERY (The Scout)
        print("--- Running Topic Search Agent ---")
        topic_scout = TopicSearchAgent()
        potential_topics = topic_scout.fetch_trending_topics()
        
        if not potential_topics:
            print("Topic Search Agent did not find any topics.")
        else:
            # Initialize the next two agents
            gap_analyst = ContentGapAgent()
            outline_creator = OutlineAgent()
            
            # STAGE 2: SELECTION & ANALYSIS (The Analyst)
            chosen_topic = gap_analyst.present_topics_for_selection(potential_topics)
            
            if chosen_topic:
                analysis_report = gap_analyst.analyze_topic(chosen_topic)
                print("\n--- GAP ANALYSIS REPORT ---")
                print(json.dumps(analysis_report, indent=2))
                
                # Continue only if the analysis was successful
                if "error" not in analysis_report:
                    
                    # STAGE 3: OUTLINE (The Architect)
                    print("\n--- Handing report to Outline Agent ---")
                    blog_outline = outline_creator.create_outline(
                        topic_title=chosen_topic['title'],
                        gap_report=analysis_report
                    )
                    
                    print("\n--- FINAL GENERATED BLOG OUTLINE ---")
                    print(blog_outline)

    except ValueError as e:
        # This will catch the error if API keys are missing in .env
        print(f"Initialization Error: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")