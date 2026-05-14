#!/usr/bin/env python3
"""
Build script — assembles index.html from section partials in sections/

Usage: python3 build.py

Sections are loaded in the order defined in SECTIONS list below.
Each section file should contain valid HTML (no <html>/<head>/<body> wrappers).

During the build, <img data-svg="assets/svgs/name.svg"> placeholders are
replaced with the actual inline SVG content so the final page works
without any runtime fetches and currentColor hover effects are preserved.
"""

import re
import pathlib

# Order in which sections are assembled into the final page
SECTIONS = [
    "head",
    "nav",
    "hero",
    "about",
    "education",
    "terminal",
    "skills",
    "projects",
    "experience",
    "contact",
    "footer",
]

BASE = pathlib.Path(__file__).parent
SECTIONS_DIR = BASE / "sections"
OUTPUT = BASE / "index.html"


def inline_svgs(html: str) -> str:
    """Replace <img data-svg="..."> with inline <svg> content."""
    pattern = re.compile(r'<img\s+([^>]*?)data-svg="([^"]+)"([^>]*?)>')

    def replace(match: re.Match) -> str:
        before = match.group(1)
        svg_path = BASE / match.group(2)
        after = match.group(3)

        # Extract class and id from the img tag
        cls = re.search(r'class="([^"]+)"', before + after)
        svg_id = re.search(r'id="([^"]+)"', before + after)

        if not svg_path.exists():
            print(f"  WARNING: SVG not found: {svg_path}")
            return match.group(0)

        svg_text = svg_path.read_text(encoding="utf-8").strip()

        # Inject class if present
        if cls:
            svg_text = svg_text.replace(">", f' class="{cls.group(1)}">', 1)

        # Inject id if present
        if svg_id:
            svg_text = svg_text.replace(">", f' id="{svg_id.group(1)}">', 1)

        return svg_text

    return pattern.sub(replace, html)


def main() -> None:
    parts = []

    # HTML skeleton — start
    parts.append(
        '<!doctype html>\n'
        '<html lang="en" class="scroll-smooth">\n'
        '  <head>\n'
    )

    # Head section (meta, title, fonts, tailwind config, styles)
    head_path = SECTIONS_DIR / "head.html"
    if head_path.exists():
        parts.append(head_path.read_text(encoding="utf-8").rstrip() + "\n")
    else:
        print(f"WARNING: {head_path} not found")

    parts.append("  </head>\n")

    # Body start
    parts.append(
        '  <body class="bg-dark text-white font-sans antialiased">\n'
    )

    # Content sections
    for name in SECTIONS[1:]:  # skip "head" — already handled above
        path = SECTIONS_DIR / f"{name}.html"
        if path.exists():
            content = path.read_text(encoding="utf-8").rstrip()
            parts.append(content + "\n")
        else:
            print(f"WARNING: {path} not found")

    # Script reference and close tags
    parts.append(
        '    <script src="script.js"></script>\n'
        '  </body>\n'
        '</html>\n'
    )

    # Assemble and inline SVGs
    html = "".join(parts)
    html = inline_svgs(html)

    # Write assembled file
    OUTPUT.write_text(html, encoding="utf-8")
    print(f"Built {OUTPUT} ({len(SECTIONS)} sections)")


if __name__ == "__main__":
    main()
