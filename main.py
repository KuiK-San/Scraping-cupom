import requests
from bs4 import BeautifulSoup
import json

def criarJson(url):

    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
    response = requests.get(url, headers=headers)

    doc = {'chaveAcesso': "","link":url,'empresa': {}, 'itens': {}}

    if response.status_code == 200:

        soup = BeautifulSoup(response.text, 'html.parser')

        # CABEÇALHO
        chave = soup.find(class_='chave').string
        doc['chaveAcesso'] = chave
        empresa = soup.find(id='u20').string
        texts = soup.find_all(class_='text')
        cnpj = texts[0].contents[0].split(':')[1].replace('\n', '').replace('\t', '').replace(' ', '')
        endereco = texts[1].contents[0].replace('\n', '').replace('\t', '')
        infoEmp = {'nome': empresa, 'cnpj': cnpj, 'endereco': endereco}
        doc['empresa'] = infoEmp  


        # TOTAIS
        linhasTotal = soup.find_all(id='linhaTotal')

        for i, linha in enumerate(linhasTotal):
            if linha.find('label').string == 'Qtd. total de itens:':
                itensTotal = linha.find('span').string.replace(',', '.')
                doc['totalItens'] = int(itensTotal)
                
            elif linha.find('label').string == 'Valor total R$:':
                valorTotal = float(linha.find('span').string.replace(',', '.'))
                doc['valorTotal'] = valorTotal

            elif linha.find('label').string == 'Descontos R$:': 
                desconto = float(linha.find('span').string.replace(',', '.'))
                doc['desconto'] = desconto

            elif linha.find('label').string == 'Valor a pagar R$:':
                valorPagar = float(linha.find('span').string.replace(',', '.'))
                doc['valorPago'] = valorPagar
        

            formaPagamento = linha.find(class_='tx')
        

        # ITENS    
        table = soup.find('table')
        itens = table.find_all('tr')

        for item in itens:
            nome = item.find(class_="txtTit2").string

            quantidade = float(item.find(class_="Rqtd").contents[2].replace('\n', ''))
            medida = item.find(class_="RUN").contents[2].replace("\n", '').replace('    ', '')

            VUnit = item.find(class_="RvlUnit").contents[2].replace("\n", '')
            VUnit = float(VUnit.replace(",", "."))

            codigo = int(item.find(class_="RCod").string.split(":")[1].split(")")[0].replace(" ", ""))
            Vtotal = float(item.find(class_="valor").string.replace(',', '.'))
            doc['itens'][nome] = {
                'codigo': codigo,
                'quantidade': quantidade,
                'valorUnidade': VUnit,
                'valorTotalItem': Vtotal,
                'medida': medida
            }
        
        doc = json.dumps(doc, indent=4)
        return doc
        


    else:
        return {'falha': True}
