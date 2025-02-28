import time
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)
CORS(app)  # Permite chamadas do frontend

# URLs do site do INPI
BASE_URL = "https://busca.inpi.gov.br/pePI/"
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

    # Criar uma sessão para manter cookies e navegar corretamente no site
    session = requests.Session()
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
        "Referer": SEARCH_PAGE_URL,
        "Content-Type": "application/x-www-form-urlencoded"
    }

    try:
        # 1️⃣ Acessar a página inicial para iniciar a sessão
        home_response = session.get(BASE_URL, headers=headers)
        time.sleep(3)  # Espera para evitar bloqueios
        print("🔍 [PASSO 1] Página Inicial Carregada - Cookies:", session.cookies.get_dict())

        # 2️⃣ Realizar login automático
        login_response = session.get(LOGIN_URL, headers=headers)
        time.sleep(3)
        print("🔍 [PASSO 2] Login Automático Realizado - Cookies:", session.cookies.get_dict())

        # 3️⃣ Acessar a página de pesquisa
        search_page_response = session.get(SEARCH_PAGE_URL, headers=headers)
        time.sleep(3)
        print("🔍 [PASSO 3] Página de Pesquisa Acessada - Cookies:", session.cookies.get_dict())

        # Verificar se chegamos na página correta
        if "ExpressaoPesquisa" not in search_page_response.text:
            print("❌ ERRO: Não chegamos na página correta")
            return jsonify({"erro": "Erro na navegação, não chegamos à página de pesquisa"}), 500

        # 4️⃣ Enviar a pesquisa com os parâmetros corretos
        payload = {
            "ExpressaoPesquisa": termo_pesquisa,
            "FormaPesquisa": forma_pesquisa,
            "botao": " pesquisar » "
        }

        resposta = session.post(SEARCH_URL, data=payload, headers=headers, cookies=session.cookies.get_dict())
        time.sleep(3)
        print("🔍 [PASSO 4] Pesquisa realizada - Cookies:", session.cookies.get_dict())

        if resposta.status_code != 200:
            return jsonify({"erro": "Erro ao acessar o site do INPI"}), 500

        # 5️⃣ Exibir o HTML retornado para depuração
        print("🔎 HTML Retornado da Pesquisa:")
        print(resposta.text[:3000])  # Imprime os primeiros 3000 caracteres

        # 6️⃣ Verificar se a página retornada contém "RESULTADO DA PESQUISA"
        if "RESULTADO DA PESQUISA" not in resposta.text:
            return jsonify({"erro": "A pesquisa não retornou resultados. Verifique se o site do INPI bloqueou a requisição."}), 500

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
