"""Static release checks for the buildless dashboard."""
from __future__ import annotations

import re
import sys
from pathlib import Path
from urllib.parse import urlsplit


ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "index.html"


def fail(message: str) -> None:
    raise SystemExit(f"Validation failed: {message}")


html = INDEX.read_text(encoding="utf-8")
if re.search(r"<style(?:\s|>)", html, re.IGNORECASE):
    fail("style tag found in index.html")
if re.search(r"\sstyle\s*=", html, re.IGNORECASE):
    fail("inline style attribute found in index.html")
if re.search(r"<script>(?:.|\n)*?</script>", html, re.IGNORECASE):
    fail("inline script found in index.html")

ids = re.findall(r"\sid=[\"']([^\"']+)[\"']", html)
duplicates = sorted({item for item in ids if ids.count(item) > 1})
if duplicates:
    fail(f"duplicate IDs: {', '.join(duplicates)}")

references = set(re.findall(r"(?:src|href)=[\"']([^\"']+)[\"']", html))
missing: list[str] = []
for reference in references:
    parsed = urlsplit(reference)
    if parsed.scheme or reference.startswith("//"):
        continue
    target = ROOT / parsed.path.lstrip("/")
    if not target.is_file():
        missing.append(reference)
if missing:
    fail(f"missing assets: {', '.join(sorted(missing))}")

for source_root in ("src", "components", "pages", "scripts"):
    for source in (ROOT / source_root).rglob("*"):
        if source.suffix.lower() not in {".html", ".js"}:
            continue
        value = source.read_text(encoding="utf-8")
        if re.search(r"\sstyle\s*=", value, re.IGNORECASE):
            fail(f"inline style attribute found in {source.relative_to(ROOT)}")
        if re.search(r"\.style(?:\.|\[)", value):
            fail(f"runtime inline-style API found in {source.relative_to(ROOT)}")

print(f"Release valid: {len(ids)} unique IDs, {len(references)} asset references")
