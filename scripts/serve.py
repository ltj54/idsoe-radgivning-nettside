"""Start the local preview from the project root."""

import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from http import HTTPStatus
from pathlib import Path
import sys
from urllib.parse import unquote, urlsplit
import webbrowser


class PreviewServer(ThreadingHTTPServer):
    # Do not allow multiple Windows processes to bind the same preview port.
    allow_reuse_address = False


class PublicSiteHandler(SimpleHTTPRequestHandler):
    """Serve only files that are part of the public website."""

    def __init__(self, *args, public_files, **kwargs):
        self.public_files = public_files
        super().__init__(*args, **kwargs)

    def send_head(self):
        requested = unquote(urlsplit(self.path).path).lstrip("/") or "index.html"
        if requested not in self.public_files:
            self.send_error(HTTPStatus.NOT_FOUND)
            return None
        self.path = f"/{requested}"
        return super().send_head()


def main():
    parser = argparse.ArgumentParser(description="Start lokal nettside for Idsøe Rådgivning.")
    parser.add_argument("--port", type=int, default=8765)
    parser.add_argument("--open", action="store_true", help="Åpne nettleseren ved oppstart.")
    args = parser.parse_args()
    if not 1 <= args.port <= 65535:
        parser.error("Port må være mellom 1 og 65535.")

    site = Path(__file__).resolve().parent.parent
    if not (site / "index.html").is_file():
        parser.error(f"Finner ikke nettsiden i {site}")

    public_files = {path.name for path in site.glob("*.html")}
    public_files.update({"styles.css", "language.js", "favicon.svg"})
    missing = sorted(name for name in public_files if not (site / name).is_file())
    if missing:
        parser.error(f"Mangler offentlige nettsidefiler: {', '.join(missing)}")

    handler = partial(PublicSiteHandler, directory=str(site), public_files=public_files)
    try:
        server = PreviewServer(("127.0.0.1", args.port), handler)
    except OSError as error:
        print(f"Kan ikke starte på port {args.port}: {error}", file=sys.stderr)
        print("Stopp eksisterende server, eller velg en annen port med --port.", file=sys.stderr)
        return 1

    with server:
        url = f"http://127.0.0.1:{args.port}"
        print(f"Idsøe Rådgivning: {url}")
        print("Stopp med Ctrl+C eller Stop i IntelliJ.")
        if args.open:
            try:
                if not webbrowser.open(url):
                    print(f"Åpne nettleseren manuelt: {url}")
            except webbrowser.Error:
                print(f"Åpne nettleseren manuelt: {url}")
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            print("\nServeren er stoppet.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
