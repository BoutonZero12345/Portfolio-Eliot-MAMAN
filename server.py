"""
Portfolio d'Eliot MAMAN — Serveur Python (stdlib pure)
Lancez avec :  python server.py
Puis ouvrez   http://localhost:8080
"""
import http.server
import socketserver
import os
import sys

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))


class PortfolioHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def log_message(self, fmt, *args):  # noqa: A002
        CYAN, GREEN, RESET = "\033[96m", "\033[92m", "\033[0m"
        print(f"{CYAN}[Portfolio]{RESET} {GREEN}{self.address_string()}{RESET} — {fmt % args}")

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        super().end_headers()


def main():
    os.chdir(DIRECTORY)
    with socketserver.TCPServer(("", PORT), PortfolioHandler) as httpd:
        httpd.allow_reuse_address = True
        C, A, B, R = "\033[96m", "\033[93m", "\033[1m", "\033[0m"
        print(f"\n{B}{C}  Portfolio Eliot MAMAN -- Python HTTP Server  {R}")
        print(f"  >>  http://localhost:{PORT}")
        print(f"  Ctrl+C pour arreter.\n")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print(f"\n{C}Serveur arrêté.{R}\n")
            sys.exit(0)


if __name__ == "__main__":
    main()
