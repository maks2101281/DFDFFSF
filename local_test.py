import http.server
import socketserver
import webbrowser
import os

# Настройки сервера
PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    
    def end_headers(self):
        # Добавляем CORS заголовки для Telegram Web App
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

def start_server():
    """Запуск локального сервера"""
    os.chdir(DIRECTORY)
    
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        print(f"🚀 Сервер запущен на http://localhost:{PORT}")
        print(f"📱 Откройте telegram_webapp.html в браузере")
        print(f"🔗 URL для бота: http://localhost:{PORT}/telegram_webapp.html")
        print("⏹️  Нажмите Ctrl+C для остановки")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n🛑 Сервер остановлен")

if __name__ == "__main__":
    start_server() 