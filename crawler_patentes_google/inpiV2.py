import time
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)
CORS(app)

# URLs do site do INPI
HOME_URL = "https://busca.inpi.gov.br/pePI/"
LOGIN_URL = "https://busca.inpi.gov.br/pePI/servlet/LoginController?action=login"
SEARCH_PAGE_URL = "https://busca.inpi.gov.br/pePI/jsp/patentes/PatenteSearchBasico.jsp"
SEARCH_URL = "https://busca.inpi.gov.br/pePI/servlet/PatenteServletController"

@app.route('/buscar_patente', methods=['POST'])
def buscar_patente():
    """ Realiza a pesquisa de patentes no site do INPI e retorna os resultados encontrados """

    dados = request.json
    termo_pesquisa = dados.get("termo", "").strip()
    forma_pesquisa = dados.get("forma", "todasPalavras")  # Opções: todasPalavras, expExata, qualquerPalavra, aproximacao

    if not termo_pesquisa:
        return jsonify({"erro": "Nenhum termo de pesquisa fornecido"}), 400

    session = requests.Session()
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
        "Referer": HOME_URL,
        "Content-Type": "application/x-www-form-urlencoded"
    }

    try:
        # 1️⃣ Acessar a página inicial para obter os cookies
        home_response = session.get(HOME_URL, headers=headers)
        time.sleep(3)
        print("🔍 [PASSO 1] Página Inicial Acessada - Cookies:", session.cookies.get_dict())

        # 2️⃣ Acessar o login (caso necessário)
        login_response = session.get(LOGIN_URL, headers=headers, cookies=session.cookies.get_dict())
        time.sleep(3)
        print("🔍 [PASSO 2] Login Automático Realizado - Cookies:", session.cookies.get_dict())

        # 🔄 **Forçar um segundo carregamento da página após o login**
        search_page_response = session.get(SEARCH_PAGE_URL, headers=headers, cookies=session.cookies.get_dict())
        time.sleep(5)  # Aumentando o tempo de espera para evitar bloqueios
        print("🔍 [PASSO 3] Página de Pesquisa Acessada - Cookies:", session.cookies.get_dict())

        # **Verificação: Se a página de pesquisa não carregou corretamente, recarregar**
        if "ExpressaoPesquisa" not in search_page_response.text:
            print("❌ ERRO: Página de pesquisa não carregou corretamente")
            return jsonify({"erro": "Erro ao acessar a página de pesquisa. O site pode ter bloqueado a requisição."}), 500

        # 4️⃣ Enviar a pesquisa simulando um navegador real
        payload = {
            "ExpressaoPesquisa": termo_pesquisa,
            "FormaPesquisa": forma_pesquisa,
            "botao": "pesquisar »"
        }

        resposta = session.post(SEARCH_URL, data=payload, headers=headers, cookies=session.cookies.get_dict())
        time.sleep(5)  # Tempo extra para evitar bloqueios
        print("🔍 [PASSO 4] Pesquisa realizada - Cookies:", session.cookies.get_dict())

        if resposta.status_code != 200:
            return jsonify({"erro": "Erro ao acessar o site do INPI"}), 500

        # 5️⃣ Exibir o HTML retornado para depuração
        print("🔎 HTML Retornado da Pesquisa:")
        print(resposta.text[:10000])  # Mostra os primeiros 3000 caracteres

        # 6️⃣ Verificar se a página retornada contém "RESULTADO DA PESQUISA"
        if "RESULTADO DA PESQUISA" not in resposta.text:
            return jsonify({"erro": "A pesquisa não retornou resultados. O site do INPI pode ter bloqueado a requisição."}), 500

        # 7️⃣ Parseando o HTML retornado
        soup = BeautifulSoup(resposta.text, "html.parser")

        # Encontrar a tabela de resultados correta
        tabela = soup.find("table")

        if not tabela:
            return jsonify({"erro": "Nenhuma tabela encontrada com os resultados da pesquisa"}), 404

        # Extrair os dados das patentes
        resultados = []
        linhas = tabela.find_all("tr")[1:]  # Pula o cabeçalho da tabela

        for linha in linhas:
            colunas = linha.find_all("td")

            if len(colunas) >= 4:
                numero_patente = colunas[0].text.strip()
                link_detalhe = colunas[0].find("a")["href"] if colunas[0].find("a") else None
                data_deposito = colunas[1].text.strip()
                titulo = colunas[2].text.strip()
                classificacao_ipc = colunas[3].text.strip()

                detalhes = {
                    "numero_patente": numero_patente,
                    "link_detalhe": f"https://busca.inpi.gov.br{link_detalhe}" if link_detalhe else None,
                    "data_deposito": data_deposito,
                    "titulo": titulo,
                    "classificacao_ipc": classificacao_ipc
                }

                resultados.append(detalhes)

        return jsonify({"patentes": resultados})

    except Exception as e:
        return jsonify({"erro": f"Erro inesperado: {str(e)}"}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)
