import os
import json
import urllib.request
import ssl
from datetime import datetime

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

def update_site_map_and_index():
    """Scans for generated articles and automatically updates index.html and sitemap.xml"""
    print("🔗 Phase 5: Executing internal link mapping and sitemap regeneration...")
    
    # Locate all generated pages
    articles = [f for f in os.listdir(".") if f.startswith("best-") and f.endswith(".html")]
    
    # 1. Update index.html navigation feed
    links_html = "\n".join([f'<li><a href="./{art}">{art.replace("best-", "").replace(".html", "").replace("-", " ").title()} (2026)</a></li>' for art in articles])
    
    index_path = "index.html"
    if os.path.exists(index_path):
        content = load_file(index_path)
        # Looks for comments tags inside your index file to dynamically update content
        if "" in content and "" in content:
            parts = content.split("")
            sub_parts = parts[1].split("")
            updated_index = f"{parts[0]}\n<ul>\n{links_html}\n</ul>\n{sub_parts[1]}"
            save_file(index_path, updated_index)
            print("✅ Main index.html updated with latest links.")

    # 2. Rebuild clean SEO sitemap.xml
    current_date = datetime.now().strftime("%Y-%m-%d")
    sitemap_entries = []
    for art in articles:
        sitemap_entries.append(f"  <url>\n    <loc>https://luciferstar004.github.io/affiliate-site/{art}</loc>\n    <lastmod>{current_date}</lastmod>\n    <priority>0.80</priority>\n  </url>")
        
    sitemap_xml = f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    sitemap_xml += "  <url>\n    <loc>https://luciferstar004.github.io/affiliate-site/index.html</loc>\n    <lastmod>" + current_date + "</lastmod>\n    <priority>1.00</priority>\n  </url>\n"
    sitemap_xml += "\n".join(sitemap_entries)
    sitemap_xml += "\n</urlset>"
    
    save_file("sitemap.xml", sitemap_xml)
    print("✅ sitemap.xml completely regenerated.")

def run_autonomous_pipeline():
    # --- PHASE 0: RUN THE DESIGN MATRIX COMPILER ---
    import theme_engine
    theme_engine.compile_design_tokens()
    queue_path = "data/keywords.txt"
    history_path = "data/processed-keywords.txt"
    
    if not os.path.exists(queue_path) or os.stat(queue_path).st_size == 0:
        print("📭 Automation Halt: Your data/keywords.txt queue is completely empty!")
        return

    with open(queue_path, 'r', encoding='utf-8') as f:
        all_lines = [line.strip() for line in f.readlines() if line.strip()]

    if not all_lines:
        print("📭 Automation Halt: No valid topics found in data/keywords.txt.")
        return

    keyword_topic = all_lines[0]
    remaining_topics = all_lines[1:]

    print(f"🤖 Conveyor Belt Active! Target Keyword: '{keyword_topic}'")
    
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        print("💥 Error: GROQ_API_KEY environment variable missing!")
        return

    # --- PHASE 1: RESEARCH ---
    print("🔍 Step 1: Deploying Research Agent...")
    research_persona = load_file("agents/research-agent.md")
    research_query = f"Find top 3 highly-rated trending products for target keyword group: '{keyword_topic}'. Provide technical specifications, pricing markers, and key performance parameters."
    raw_research_data = call_ai_agent(research_persona, research_query, api_key)

    # --- PHASE 2: CONTENT & SEO ---
    print("✍️ Step 2: Deploying Content/SEO Agent...")
    content_persona = load_file("agents/content-agent.md")
    seo_persona = load_file("agents/seo-agent.md")
    combined_persona = f"{content_persona}\n\nSEO Strategy Rules:\n{seo_persona}"
    task_file_content = call_ai_agent(combined_persona, f"Transform this raw product research into a complete task file data configuration:\n\n{raw_research_data}", api_key)
    
    task_filename = f"{keyword_topic.lower().replace(' ', '-')}.txt"
    save_file(f"agents/tasks/{task_filename}", task_file_content)

    # --- PHASE 3: PRODUCTION BUILD ---
    print("🏭 Step 3: Compiling production landing page...")
    import generator
    output_html = f"best-{keyword_topic.lower().replace(' ', '-')}.html"
    generator.run_factory(task_filename, output_html)
    
    # --- PHASE 4: QUEUE ROTATION ---
    print("♻️ Step 4: Advancing conveyor belt queue setup...")
    updated_queue_content = "\n".join(remaining_topics) + ("\n" if remaining_topics else "")
    save_file(queue_path, updated_queue_content)
    
    with open(history_path, "a", encoding="utf-8") as hist:
        hist.write(f"{keyword_topic}\n")
        
    # --- PHASE 5: AUTO-LINKING AGGREGATION ---
    update_site_map_and_index()
    
    print(f"🚀 PIPELINE COMPLETE: Successfully launched and aggregated ./{output_html}")

if __name__ == "__main__":
    run_autonomous_pipeline()