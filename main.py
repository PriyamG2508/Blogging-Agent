import json
from topic_search_agent import TopicSearchAgent
from content_gap_agent import ContentGapAgent

if __name__ == '__main__':
    # --- PREREQUISITES ---
    # 1. pip install --upgrade google-api-python-client google-generativeai trafilatura requests python-dotenv
    # 2. Create your .env file with the 3 required API keys.
    
    # STAGE 1: DISCOVERY (The Scout Agent)
    print("--- Running Topic Search Agent ---")
    topic_scout = TopicSearchAgent()
    potential_topics = topic_scout.fetch_trending_topics()

    # STAGE 2: ANALYSIS (The Analyst Agent)
    if potential_topics:
        try:
            # Initialize the analyst agent. It will automatically load keys from .env
            gap_analyst = ContentGapAgent()

            # The analyst presents topics to you for a decision
            chosen_topic = gap_analyst.present_topics_for_selection(potential_topics)

            # The main workflow continues only if a valid topic was chosen
            if chosen_topic:
                final_report = gap_analyst.analyze_topic(chosen_topic)
                
                print("\n--- FINAL ANALYSIS REPORT ---")
                # Use dumps for pretty printing the final JSON
                print(json.dumps(final_report, indent=2))
        
        except ValueError as e:
            # This will catch the error if API keys are missing in .env
            print(f"Initialization Error: {e}")
            
    else:
        print("Topic Search Agent did not find any topics.")