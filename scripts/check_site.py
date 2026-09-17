"""Check links, language pairs and document structure without dependencies."""

from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

SITE = Path(__file__).resolve().parent.parent / "site"
VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.path = path
        self.ids = set()
        self.refs = []
        self.labels = []
        self.alternates = {}
        self.stack = []
        self.lang = None
        self.h1 = 0
        self.feed(path.read_text(encoding="utf-8"))
        assert not self.stack, (path.name, "unclosed tags", self.stack)
        assert self.h1 == 1, (path.name, "expected one h1", self.h1)
        assert self.lang in {"nb", "en"}, path.name
        assert "innhold" in self.ids, path.name

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag not in VOID:
            self.stack.append(tag)
        if tag == "html":
            self.lang = attrs.get("lang")
        if tag == "h1":
            self.h1 += 1
        if "id" in attrs:
            assert attrs["id"] not in self.ids, (self.path.name, "duplicate id", attrs["id"])
            self.ids.add(attrs["id"])
        self.labels.extend(attrs.get("aria-labelledby", "").split())
        for key in ("href", "src"):
            if key in attrs:
                self.refs.append(attrs[key])
        if tag == "a" and attrs.get("href", "").startswith(("https://", "http://")):
            assert attrs.get("target") == "_blank", (self.path.name, attrs)
            assert {"noopener", "noreferrer"} <= set(attrs.get("rel", "").split()), (self.path.name, attrs)
        if tag == "link" and attrs.get("rel") == "alternate":
            self.alternates[attrs["hreflang"]] = attrs["href"]

    def handle_endtag(self, tag):
        assert self.stack and self.stack.pop() == tag, (self.path.name, "unbalanced tag", tag)


def main():
    pages = {path.name: Page(path) for path in SITE.glob("*.html")}
    links = 0
    for name, page in pages.items():
        assert set(page.labels) <= page.ids, (name, "missing aria label target")
        assert set(page.alternates) == {"nb", "en"}, (name, "missing language pair")
        for lang, target in page.alternates.items():
            other = pages[target]
            assert other.lang == lang and other.alternates[page.lang] == name, (name, "language pair mismatch")
            assert page.ids == other.ids, (name, "language anchors differ")
        for ref in page.refs:
            url = urlsplit(ref)
            if url.scheme or url.netloc:
                continue
            target = (page.path.parent / unquote(url.path)).resolve() if url.path else page.path
            assert target.is_relative_to(SITE), (name, "link outside public site", ref)
            assert target.is_file(), (name, "missing file", ref)
            if url.fragment and target.suffix == ".html":
                fragment = unquote(url.fragment)
                # #om-ella is a backwards-compatible deep link that opens the dialog.
                assert fragment in pages[target.name].ids or (fragment == "om-ella" and target.name in {"index.html", "en.html"}), (name, "missing anchor", ref)
            links += 1
    print(f"OK: {len(pages)} pages, {links} local links/assets, language pairs, headings and HTML structure.")


if __name__ == "__main__":
    main()
