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
    """Executes a live network call mapping a specific agent persona to a workspace task."""
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

def run_autonomous_pipeline(keyword_topic):
    print(f"🤖 Activating Autonomous Agent Pipeline for: {keyword_topic}")
    
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        print("💥 Error: GROQ_API_KEY environment variable missing!")
        return

    # --- PHASE 1: RESEARCH AGENT ---
    print("🔍 Step 1: Deploying Research Agent to find trending product specs...")
    research_persona = load_file("agents/research-agent.md")
    research_query = f"Find top 3 highly-rated trending products for target keyword group: '{keyword_topic}'. Provide structural technical specifications, current pricing markers, and key performance parameters."
    
    raw_research_data = call_ai_agent(research_persona, research_query, api_key)
    print("✅ Research Agent has compiled the data packet.")

    # --- PHASE 2: CONTENT & SEO AGENT ---
    print("✍️ Step 2: Deploying Content/SEO Agent to build task parameters...")
    content_persona = load_file("agents/content-agent.md")
    seo_persona = load_file("agents/seo-agent.md")
    combined_persona = f"{content_persona}\n\nSEO Strategy Rules:\n{seo_persona}"
    
    task_file_content = call_ai_agent(combined_persona, f"Transform this raw product research into a complete, clean task file data configuration:\n\n{raw_research_data}", api_key)
    
    # Save the agent's work directly into your tasks folder automatically
    task_filename = f"{keyword_topic.lower().replace(' ', '-')}.txt"
    save_file(f"agents/tasks/{task_filename}", task_file_content)
    print(f"✅ Content Agent successfully wrote new task instructions to: agents/tasks/{task_filename}")

    # --- PHASE 3: TRIGGER FACTORY BUILDER ---
    print("🏭 Step 3: Triggering production compiler to generate live landing page...")
    import generator
    output_html = f"best-{keyword_topic.lower().replace(' ', '-')}.html"
    generator.run_factory(task_filename, output_html)
    
    print(f"🚀 PIPELINE COMPLETE: Your site has successfully updated with an autonomous build: ./{output_html}")

if __name__ == "__main__":
    # Test running the entire agent loop for a new niche product topic category
    run_autonomous_pipeline("mechanical keyboards under 5000")