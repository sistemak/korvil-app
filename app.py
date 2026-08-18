from flask import Flask, render_template_string, request, jsonify
import yt_dlp
import os

app = Flask(__name__)

# Pasta onde os vídeos serão salvos
DOWNLOAD_FOLDER = os.path.join(os.getcwd(), 'downloads')
os.makedirs(DOWNLOAD_FOLDER, exist_ok=True)

HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Baixador de Vídeos</title>
    <style>
        body { font-family: sans-serif; background: #f4f4f9; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
        .container { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); width: 350px; text-align: center; }
        input { width: 100%; padding: 10px; margin: 10px 0; box-sizing: border-box; }
        button { width: 100%; padding: 10px; background: #007bff; color: white; border: none; cursor: pointer; border-radius: 4px; }
        button:hover { background: #0056b3; }
        #msg { margin-top: 15px; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <h2>Baixador de Vídeos</h2>
        <input type="text" id="url" placeholder="Cole o link aqui...">
        <button onclick="download()">Baixar</button>
        <p id="msg"></p>
    </div>
    <script>
        async function download() {
            const url = document.getElementById('url').value;
            const msg = document.getElementById('msg');
            if (!url) {
                msg.style.color = 'red';
                msg.innerText = "Insira um link!";
                return;
            }
            msg.style.color = 'blue';
            msg.innerText = "Baixando, aguarde...";
            try {
                const res = await fetch('/download', { 
                    method: 'POST', 
                    headers: {'Content-Type': 'application/json'}, 
                    body: JSON.stringify({url}) 
                });
                const data = await res.json();
                if (res.ok) {
                    msg.style.color = 'green';
                    msg.innerText = data.mensagem;
                } else {
                    msg.style.color = 'red';
                    msg.innerText = data.mensagem;
                }
            } catch (error) {
                msg.style.color = 'red';
                msg.innerText = "Erro de conexão.";
            }
        }
    </script>
</body>
</html>
"""

@app.route('/')
def index():
    return render_template_string(HTML_TEMPLATE)

@app.route('/download', methods=['POST'])
def download():
    data = request.get_json()
    url = data.get('url')
    if not url:
        return jsonify({'mensagem': 'URL não fornecida!'}), 400
    try:
        opcoes = {
            'format': 'best',
            'outtmpl': os.path.join(DOWNLOAD_FOLDER, '%(title)s.%(ext)s'),
        }
        with yt_dlp.YoutubeDL(opcoes) as ydl:
            ydl.download([url])
        return jsonify({'mensagem': 'Download concluído com sucesso!'})
    except Exception as e:
        return jsonify({'mensagem': f'Erro: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True)
