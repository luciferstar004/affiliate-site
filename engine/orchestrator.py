import os
import json
import urllib.request
import ssl

def load_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        return f.read()

def save_file(filepath, content):
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def call_ai_agent(persona_rules, task_input, api_key):
    payload = {
        "model": "llama-3.3-70b-versatile",
        "messages": [
            {"role": "system", "content": persona_rules},
            {"role": "user", "content": task_input}
        ],
        "temperature": 0.3
    }
    
    url = "https://api.groq.com/openai/v1/chat/completions"
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
        },
        method="POST"
    )
    
    ctx = ssl._create_unverified_context()
    with urllib.request.urlopen(req, context=ctx) as response:
        result = json.loads(response.read().decode("utf-8"))
        return result["choices"][0]["message"]["content"].strip()

def run_autonomous_pipeline():
    queue_path = "data/keywords.txt"
    history_path = "data/processed-keywords.txt"
    
    # 1. Validate the text queue exists and has lines
    if not os.path.exists(queue_path) or os.stat(queue_path).st_size == 0:
        print("📭 Automation Halt: Your data/keywords.txt queue is completely empty!")
        return

    with open(queue_path, 'r', encoding='utf-8') as f:
        all_lines = [line.strip() for line in f.readlines() if line.strip()]

    if not all_lines:
        print("📭 Automation Halt: No valid topics found in data/keywords.txt.")
        return

    # Grab the top item on the conveyor belt
    keyword_topic = all_lines[0]
    remaining_topics = all_lines[1:]

    print(f"🤖 Conveyor Belt Active! Target Keyword for this cycle: '{keyword_topic}'")
    
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        print("💥 Error: GROQ_API_KEY environment variable missing!")
        return

    # --- PHASE 1: RESEARCH AGENT ---
    print("🔍 Step 1: Deploying Research Agent...")
    research_persona = load_file("agents/research-agent.md")
    research_query = f"Find top 3 highly-rated trending products for target keyword group: '{keyword_topic}'. Provide structural technical specifications, current pricing markers, and key performance parameters."
    raw_research_data = call_ai_agent(research_persona, research_query, api_key)

    # --- PHASE 2: CONTENT & SEO AGENT ---
    print("✍️ Step 2: Deploying Content/SEO Agent...")
    content_persona = load_file("agents/content-agent.md")
    seo_persona = load_file("agents/seo-agent.md")
    combined_persona = f"{content_persona}\n\nSEO Strategy Rules:\n{seo_persona}"
    task_file_content = call_ai_agent(combined_persona, f"Transform this raw product research into a complete, clean task file data configuration:\n\n{raw_research_data}", api_key)
    
    task_filename = f"{keyword_topic.lower().replace(' ', '-')}.txt"
    save_file(f"agents/tasks/{task_filename}", task_file_content)

    # --- PHASE 3: TRIGGER FACTORY BUILDER ---
    print("🏭 Step 3: Compiling production landing page...")
    import generator
    output_html = f"best-{keyword_topic.lower().replace(' ', '-')}.html"
    generator.run_factory(task_filename, output_html)
    
    # --- PHASE 4: QUEUE ROTATION & ROTATE SAVE ---
    print("♻️ Step 4: Advancing conveyor belt queue setup...")
    # Overwrite the keyword file with the remaining items
    updated_queue_content = "\n".join(remaining_topics) + ("\n" if remaining_topics else "")
    save_file(queue_path, updated_queue_content)
    
    # Append the completed item to a historical log file
    with open(history_path, "a", encoding="utf-8") as hist:
        hist.write(f"{keyword_topic}\n")
        
    print(f"🚀 PIPELINE COMPLETE: Successfully launched ./{output_html}")

if __name__ == "__main__":
    run_autonomous_pipeline()