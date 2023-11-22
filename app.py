from flask import Flask, render_template, send_from_directory
import os
from pymongo import MongoClient
from main import criarJson

app = Flask(__name__)
mongo = MongoClient('mongodb://localhost:27017')
colecao = mongo['Notas']['NotasFiscais']

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/js/<path:filename>')
def serve_js(filename):
    js_directory = os.path.join(os.getcwd(), 'static', 'js')
    return send_from_directory(js_directory, filename)


if __name__ == "__main__":
    app.run(debug=True)