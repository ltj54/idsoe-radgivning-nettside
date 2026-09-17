"""Start the local preview with only site/ exposed."""

import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import sys
import webbrowser


class PreviewServer(ThreadingHTTPServer):
    # Do not allow multiple Windows processes to bind the same preview port.
    allow_reuse_address = False


def main():
    parser = argparse.ArgumentParser(description="Start lokal nettside for Idsøe Rådgivning.")
    parser.add_argument("--port", type=int, default=8765)
    parser.add_argument("--open", action="store_true", help="Åpne nettleseren ved oppstart.")
    args = parser.parse_args()
    if not 1 <= args.port <= 65535:
        parser.error("Port må være mellom 1 og 65535.")

    site = Path(__file__).resolve().parent.parent / "site"
    if not (site / "index.html").is_file():
        parser.error(f"Finner ikke nettsiden i {site}")

    handler = partial(SimpleHTTPRequestHandler, directory=str(site))
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
