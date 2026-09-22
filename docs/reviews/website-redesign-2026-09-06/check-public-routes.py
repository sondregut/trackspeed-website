"""Read-only checks against the local production build; never sends credentials."""
import json
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import urlopen

BASE = 'http://localhost:3210'
ROOT = Path(__file__).resolve().parent
LOCALES = ['en', 'de', 'fr', 'nb', 'ja', 'zh-Hans', 'ko', 'hi', 'es', 'pt', 'it', 'ar', 'tr']
PAGES = ['', 'features', 'technology', 'pro', 'about', 'support', 'terms', 'privacy', 'blog']


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.h1 = 0
        self.canonical = None
        self.robots = None
        self.json_ld = 0
        self.ids = set()
        self.links = []
        self.alternates = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'h1':
            self.h1 += 1
        if attrs.get('id'):
            self.ids.add(attrs['id'])
        if tag == 'a' and 'href' in attrs:
            self.links.append(attrs['href'])
        if tag == 'link' and attrs.get('rel') == 'canonical':
            self.canonical = attrs.get('href')
        if tag == 'link' and attrs.get('hreflang'):
            self.alternates.append(attrs['hreflang'])
        if tag == 'meta' and attrs.get('name') == 'robots':
            self.robots = attrs.get('content')
        if tag == 'script' and attrs.get('type') == 'application/ld+json':
            self.json_ld += 1


def check(pair):
    locale, page = pair
    route = '/' + '/'.join(p for p in [locale if locale != 'en' else '', page] if p)
    try:
        with urlopen(BASE + route, timeout=30) as response:
            html = response.read().decode()
            status = response.status
    except HTTPError as error:
        html, status = error.read().decode(), error.code
    doc = Page()
    doc.feed(html)
    english_reference = page in ['features', 'technology', 'pro']
    canonical_english = english_reference or page in ['terms', 'privacy']
    expected_canonical = ('https://mytrackspeed.com' + ('/' + page if canonical_english else route)).rstrip('/')
    issues = []
    if status != 200:
        issues.append(f'HTTP {status}')
    if doc.h1 != 1:
        issues.append(f'{doc.h1} primary headings')
    if (doc.canonical or '').rstrip('/') != expected_canonical:
        issues.append(f'Canonical differs: {doc.canonical} / {expected_canonical}')
    if english_reference and locale != 'en' and 'noindex' not in (doc.robots or ''):
        issues.append('Untranslated reference page is indexable')
    for anchor in [href[1:] for href in doc.links if href.startswith('#')]:
        if anchor not in doc.ids:
            issues.append(f'Missing anchor #{anchor}')
    return {'route': route, 'status': status, 'h1_count': doc.h1, 'canonical': doc.canonical, 'robots': doc.robots, 'hreflang_count': len(doc.alternates), 'json_ld_count': doc.json_ld, 'issues': issues}


with ThreadPoolExecutor(max_workers=4) as pool:
    pages = list(pool.map(check, [(locale, page) for locale in LOCALES for page in PAGES]))
api_checks = []
for route, expected in [('/api/influencer/auth', 401), ('/api/influencer/stats', 401), ('/api/unsubscribe', 400)]:
    try:
        with urlopen(BASE + route, timeout=15) as response:
            status = response.status
    except HTTPError as error:
        status = error.code
    api_checks.append({'route': route, 'status': status, 'expected': expected, 'pass': status == expected})
result = {'checked_at': datetime.now(timezone.utc).isoformat(), 'base': BASE, 'pages': pages, 'api_checks': api_checks, 'passed': all(not page['issues'] for page in pages) and all(row['pass'] for row in api_checks)}
(ROOT / 'http-verification.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'page_count': len(pages), 'page_failures': [page for page in pages if page['issues']], 'api_checks': api_checks, 'passed': result['passed']}, ensure_ascii=False, indent=2))
