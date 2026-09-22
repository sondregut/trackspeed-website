"""Create local public-page fixtures for CSS viewport review, not deployment.

The browser viewport override is ineffective in this CUA backend. Production
clickjacking headers remain unchanged. These copies validate layout only;
navigation/API checks run against the original production server separately.
"""
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import re
from urllib.request import urlopen

root = Path(__file__).resolve().parent / 'snapshots'
base = 'http://localhost:3210'
locales = ['', 'nb', 'de', 'ar', 'ja', 'hi']
pages = ['', 'features', 'technology', 'pro', 'about', 'support']


def capture(pair):
    locale, page = pair
    route = '/' + '/'.join(part for part in pair if part)
    with urlopen(base + route, timeout=30) as response:
        html = response.read().decode()
    # Keep the exact server-rendered DOM and CSS. Hydrating copied Next routes
    # at a fixture URL would test a different router state, so omit scripts.
    html = re.sub(r'<script\b[^>]*>.*?</script>', '', html, flags=re.DOTALL | re.IGNORECASE)
    html = html.replace('<head>', '<head><base href="' + base + route + '" target="_top">', 1)
    target = root / (locale or 'en') / ((page or 'home') + '.html')
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(html)
    return route


if __name__ == '__main__':
    with ThreadPoolExecutor(max_workers=4) as pool:
        routes = list(pool.map(capture, [(locale, page) for locale in locales for page in pages]))
    print(f'Captured {len(routes)} local public pages for responsive layout review.')
