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

def run_factory(task_file, output_html_name):
    print(f"🏭 Starting build sequence for task: {task_file}")
    
    try:
        task_instructions = load_file(f"agents/tasks/{task_file}")
        html_template = load_file("engine/template.html")
    except FileNotFoundError as fnf:
        print(f"💥 File path error: {str(fnf)}")
        return

    system_rules = """
    You are an advanced software engineer and SEO optimization system.
    You extract product parameters and transform them into beautifully formatted HTML component segments.
    
    Return ONLY a single, strict JSON data structure mapping precisely to the requested keys.
    Do NOT output backticks (```json) or markdown code fences.
    
    JSON mapping keys:
    1. "META_TITLE": Eye-catching, click-optimized SEO title containing the current year 2026.
    2. "META_DESCRIPTION": Compelling summary under 155 characters for search results.
    3. "H1_TITLE": The human-facing core heading.
    4. "INTRO_TEXT": Two persuasive intro paragraphs setting the scene.
    5. "TOP_PICK_BOX": An executive editorial callout box using clean standard inline styles.
    6. "COMPARISON_TABLE": A standard clean <table> highlighting specifications comparatively across options.
    7. "PRODUCT_REVIEWS": Individual stacked structural article nodes detailing capabilities, complete with explicit pricing markup, explicit pros/cons listing, and an obvious structural call-to-action button styled cleanly using the derived Amazon tracking strings.
    8. "BUYING_GUIDE": Deep context guide with clear paragraphs outlining selection parameters.
    9. "FAQ_SECTION": 3 to 4 technical consumer questions using <h3> tags.
    10. "FAQ_SCHEMA": A JSON-LD string (<script type="application/ld+json">...) containing semantic FAQPage object notation.
    """
    
    print("Contacting AI Factory Line...")
    
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        print("💥 Error: GROQ_API_KEY environment variable is missing!")
        return

    payload = {
        "model": "llama-3.3-70b-versatile",
        "response_format": {"type": "json_object"},
        "messages": [
            {"role": "system", "content": system_rules},
            {"role": "user", "content": task_instructions}
        ],
        "temperature": 0.2
    }
    
    p1 = "ht" + "tps://"
    p2 = "api" + ".groq"
    p3 = ".com/openai/v1/chat/completions"
    target_endpoint = p1 + p2 + p3

    req = urllib.request.Request(
        target_endpoint,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
        },
        method="POST"
    )

    try:
        ctx = ssl._create_unverified_context()
        with urllib.request.urlopen(req, context=ctx) as response:
            result = json.loads(response.read().decode("utf-8"))
            raw_response = result["choices"][0]["message"]["content"].strip()
            
        content_packet = json.loads(raw_response)
        compiled_html = html_template
        
        for placeholder, clear_html in content_packet.items():
            # Safety Valve: Converts lists or objects into pure string layouts automatically
            if isinstance(clear_html, list):
                processed_html = "\n".join([str(item) for item in clear_html])
            elif isinstance(clear_html, dict):
                processed_html = json.dumps(clear_html)
            else:
                processed_html = str(clear_html)
                
            compiled_html = compiled_html.replace(f"{{{{{placeholder}}}}}", processed_html)
            
        save_file(f"./{output_html_name}", compiled_html)
        print(f"🚀 Generation finished successfully! Added file: ./{output_html_name}")
        
    except Exception as e:
        print(f"💥 Script Error: {str(e)}")

if __name__ == "__main__":
    run_factory("earbuds-under-2000.txt", "best-wireless-earbuds-under-2000.html")