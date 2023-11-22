from flask import Flask, render_template, send_from_directory, request, jsonify, url_for
import os
from pymongo import MongoClient
from main import criarJson

app = Flask(__name__)
mongo = MongoClient('mongodb://localhost:27017')
colecao = mongo['Notas']['NotasFiscais']

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html', script=url_for('static', filename='script.js'), scriptCam=url_for('static', filename='scriptCam.js'))

@app.route('/api/NFScrapping', methods=['POST'])
def scrapping():
    url = request.json['url']
    # print(url)
    document = criarJson(url)
    # print(document)

    pesquisa = colecao.find_one({'chaveAcesso': document['chaveAcesso']})

    if pesquisa:
        return "Nota Já Cadastrada"

    colecao.insert_one(document=document)

    return 'Nota Cadastrada com sucesso!'

if __name__ == "__main__":
    app.run(debug=True)