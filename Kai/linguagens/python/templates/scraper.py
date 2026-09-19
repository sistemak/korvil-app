import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime

def scrape(url: str):
    headers = {"User-Agent":"K-AI Scraper 2.4.1"}
    r = requests.get(url, headers=headers, timeout=10)
    r.raise_for_status()
    soup = BeautifulSoup(r.text, "html.parser")
    return {
        "url": url,
        "title": soup.title.string if soup.title else "",
        "h1": [h.get_text(strip=True) for h in soup.find_all("h1")[:10]],
        "links": [a.get("href") for a in soup.find_all("a", href=True)][:50],
        "scraped_at": datetime.utcnow().isoformat()
    }

if __name__ == "__main__":
    url = input("URL: ")
    print(json.dumps(scrape(url), indent=2, ensure_ascii=False))