#!/usr/bin/env python3
"""
Simple HTTP server with static file serving and POST support for saving workout JSON files.
Run: python3 server.py [port]
Default port: 5173 (same as Vite dev server for consistency when running standalone)
"""

import http.server
import json
import mimetypes
import os
import sys
from pathlib import Path

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
PUBLIC_DIR = Path(__file__).parent / "public"
WORKOUTS_DIR = PUBLIC_DIR / "workouts"

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}


class WorkoutRequestHandler(http.server.BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        print(f"[{self.address_string()}] {format % args}")

    def send_cors_headers(self):
        for key, value in CORS_HEADERS.items():
            self.send_header(key, value)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_cors_headers()
        self.end_headers()

    def do_GET(self):
        path = self.path.split("?")[0]
        if path == "/":
            path = "/index.html"

        file_path = PUBLIC_DIR / path.lstrip("/")

        if not file_path.exists() or not file_path.is_file():
            self.send_response(404)
            self.send_cors_headers()
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"error": "Not found"}).encode())
            return

        mime_type, _ = mimetypes.guess_type(str(file_path))
        if mime_type is None:
            mime_type = "application/octet-stream"

        content = file_path.read_bytes()
        self.send_response(200)
        self.send_cors_headers()
        self.send_header("Content-Type", mime_type)
        self.send_header("Content-Length", str(len(content)))
        self.end_headers()
        self.wfile.write(content)

    def do_POST(self):
        if not self.path.startswith("/api/workouts"):
            self.send_response(404)
            self.send_cors_headers()
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"error": "Not found"}).encode())
            return

        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length)

        try:
            data = json.loads(body)
        except json.JSONDecodeError:
            self.send_response(400)
            self.send_cors_headers()
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"error": "Invalid JSON"}).encode())
            return

        filename = data.get("filename")
        workout = data.get("workout")

        if not filename or not workout:
            self.send_response(400)
            self.send_cors_headers()
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"error": "Missing filename or workout"}).encode())
            return

        safe_filename = Path(filename).name
        if not safe_filename.endswith(".json"):
            safe_filename += ".json"

        WORKOUTS_DIR.mkdir(parents=True, exist_ok=True)
        output_path = WORKOUTS_DIR / safe_filename
        output_path.write_text(json.dumps(workout, indent=2), encoding="utf-8")

        index_path = WORKOUTS_DIR / "workout-index.json"
        if index_path.exists():
            index = json.loads(index_path.read_text(encoding="utf-8"))
        else:
            index = []

        workout_id = safe_filename.replace(".json", "")
        existing_ids = [entry["id"] for entry in index]
        if workout_id not in existing_ids:
            index.append({
                "id": workout_id,
                "name": workout.get("workoutName", workout_id),
                "filename": safe_filename,
            })
            index_path.write_text(json.dumps(index, indent=2), encoding="utf-8")

        self.send_response(200)
        self.send_cors_headers()
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps({"ok": True, "filename": safe_filename}).encode())


if __name__ == "__main__":
    os.chdir(Path(__file__).parent)
    with http.server.HTTPServer(("", PORT), WorkoutRequestHandler) as httpd:
        print(f"Serving at http://localhost:{PORT}")
        print(f"Workouts directory: {WORKOUTS_DIR}")
        httpd.serve_forever()
