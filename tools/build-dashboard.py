"""Build index.html from the dashboard's server-side HTML fragments."""
from __future__ import annotations

import re
import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
INCLUDE = re.compile(r"<!--\s*@include\s+([^\s]+)\s*-->")
CSS_FILES = (
    "styles/base/tokens-and-base.css", "styles/layout/header.css",
    "styles/layout/main.css", "styles/components/cards.css",
    "styles/components/panels.css", "styles/components/ip-table.css",
    "styles/components/table-toolbar.css", "styles/components/event-table.css",
    "styles/components/pagination.css", "styles/components/badges.css",
    "styles/components/scrollbars.css", "styles/layout/footer.css",
    "styles/responsive.css", "styles/components/animations.css",
    "styles/components/charts.css", "styles/pages/enforcement.css",
    "styles/components/notifications.css", "styles/components/surfaces.css",
    "styles/components/inline-replacements.css",
)
JS_FILES = (
    "scripts/config/dashboard-config.js", "scripts/core/http-compat.js",
    "scripts/core/dom.js", "scripts/i18n/translations.js",
    "scripts/core/state.js", "scripts/core/router.js",
    "scripts/i18n/language.js", "scripts/core/date-time.js",
    "scripts/core/detection.js", "scripts/charts/dashboard-charts.js",
    "scripts/components/top-ip-table.js", "scripts/components/event-search.js",
    "scripts/components/event-sorting.js", "scripts/components/event-filtering.js",
    "scripts/components/event-table.js", "scripts/components/pagination.js",
    "scripts/services/dashboard-service.js", "scripts/app/events.js",
    "scripts/app/bootstrap.js", "scripts/components/toast.js",
    "scripts/components/notification-center.js", "scripts/pages/enforcement.js",
    "scripts/pages/history.js",
)


def assemble(source: Path, stack: tuple[Path, ...] = ()) -> str:
    source = source.resolve()
    if source in stack:
        raise RuntimeError(f"Circular include: {source.relative_to(ROOT)}")
    text = source.read_text(encoding="utf-8")
    return INCLUDE.sub(
        lambda match: assemble(ROOT / match.group(1), stack + (source,)),
        text,
    )


def bundle(files: tuple[str, ...]) -> str:
    sections = []
    for relative in files:
        source = (ROOT / relative).read_text(encoding="utf-8").strip()
        sections.append(f"/* Source: {relative} */\n{source}")
    return "\n\n".join(sections) + "\n"


(ROOT / "dist").mkdir(exist_ok=True)
(ROOT / "dist" / "dashboard.css").write_text(
    bundle(CSS_FILES), encoding="utf-8", newline="\n"
)
(ROOT / "dist" / "dashboard.js").write_text(
    bundle(JS_FILES), encoding="utf-8", newline="\n"
)


(ROOT / "index.html").write_text(
    assemble(ROOT / "src" / "index.template.html"),
    encoding="utf-8",
    newline="\n",
)
subprocess.run(
    [sys.executable, str(ROOT / "tools" / "validate-release.py")],
    check=True,
)
print("Dashboard built: index.html")
