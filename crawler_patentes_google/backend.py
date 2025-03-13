from flask import Flask, request, jsonify
from flask_cors import CORS  # ✅ Importação do Flask-CORS
import subprocess
import os
import csv
import mysql.connector
import sys

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# 📌 Configuração do Banco de Dados MySQL
db_config = {
    "host": "localhost",
    "user": "root",
    "password": "10203040",  # Modifique conforme necessário
    "database": "patentes_db"
}

# 📌 Caminho do arquivo gerado pelo `buscar_patentes.py`
#TSV_FILE = "dados_patentes_corrigido.tsv"

TSV_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "dados_patentes_corrigidos.tsv")
print(f"📌 O backend está procurando o TSV em: {TSV_FILE}")

print(f"📌 O script está rodando de: {os.getcwd()}")


# 📌 Função para executar `buscar_patentes.py`
def executar_scraper(termo):
    try:
        print(f"🔍 Buscando patentes para: {termo}")
        #python_executable = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".venv", "Scripts", "python.exe")
        python_executable = sys.executable
        script_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "buscar_patentes.py"))
        if not os.path.exists(script_path): raise FileNotFoundError(f"❌ ERRO: O arquivo {script_path} não foi encontrado!")
       # python_executable = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".venv", "Scripts", "python.exe")
        subprocess.run([python_executable, script_path, termo], check=True)
        print("✅ Scraper concluído!")
    except subprocess.CalledProcessError as e:
        print(f"❌ Erro ao executar scraper: {e}")
# 📌 Função para ler o arquivo `dados_patentes_corrigido.tsv`

from datetime import datetime

def converter_data(data_str):
    """ Converte data do formato 'DD/MM/YYYY' para 'YYYY-MM-DD' """
    try:
        return datetime.strptime(data_str, "%d/%m/%Y").strftime("%Y-%m-%d")
    except ValueError:
        return None  # Retorna None se a data for inválida
    
def ler_arquivo_tsv():
    print(f"📌 Verificando existência do arquivo: {TSV_FILE}")

    if not os.path.exists(TSV_FILE):
        print(f"❌ Arquivo {TSV_FILE} NÃO encontrado!")
        return []
    
    patentes = []
    with open(TSV_FILE, "r", encoding="utf-8-sig") as file:
        reader = csv.reader(file, delimiter="\t")
        dados_patente = {}

        for row in reader:
            if len(row) < 2:
                continue

            chave, valor = row[0].strip(), row[1].strip()

            if "(21) Nº do Pedido:" in chave:
                if dados_patente:
                    patentes.append(dados_patente)
                dados_patente = {"numero": valor}

            elif "(22) Data do Depósito:" in chave:
                dados_patente["data_deposito"] = converter_data(valor)

            elif "(43) Data da Publicação:" in chave:
                dados_patente["data_publicacao"] = converter_data(valor)

            elif "(47) Data da Concessão:" in chave:
                dados_patente["data_concessao"] = converter_data(valor)

            elif "(51) Classificação IPC:" in chave:
                 dados_patente["classificacao_ipc"] = valor[:255]  # Limita a 255 caracteres

            elif "(52) Classificação CPC:" in chave:
                dados_patente["classificacao_cpc"] = valor[:255]  # Limita a 255 caracteres

            elif "(54) Título:" in chave:
                dados_patente["titulo"] = valor

            elif "(57) Resumo:" in chave:
                dados_patente["resumo"] = valor

            elif "(71) Nome do Depositante:" in chave:
                dados_patente["depositante"] = valor

            elif "(72) Nome do Inventor:" in chave:
                dados_patente["inventor"] = valor

        if dados_patente:
            patentes.append(dados_patente)

    print(f"✅ Total de patentes carregadas: {len(patentes)}")
    return patentes



@app.route("/buscar", methods=["POST"])
def buscar_patentes():
    termo = request.json.get("termo")
    if not termo:
        return jsonify({"error": "Nenhum termo de busca fornecido!"}), 400
    # Executar o Web Scraper
    executar_scraper(termo)
    # Ler os dados extraídos
    patentes = ler_arquivo_tsv()
    return jsonify(patentes)
# 📌 Rota para salvar as patentes no banco de dados
@app.route("/salvar", methods=["POST"])
def salvar_patentes():
    patentes = ler_arquivo_tsv()
    if not patentes:
        print("❌ Nenhum dado foi encontrado para salvar no banco!")
        return jsonify({"error": "Nenhum dado para salvar!"}), 400

    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()

        sql = """
            INSERT INTO patentes (numero, data_deposito, data_publicacao, data_concessao, classificacao_ipc, classificacao_cpc, titulo, resumo, depositante, inventor)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """

        print(f"✅ Tentando salvar {len(patentes)} patentes no banco...")

        for p in patentes:
            print(f"🔹 Salvando patente: {p['titulo']}")
            cursor.execute(sql, (p["numero"], p["data_deposito"], p["data_publicacao"], p["data_concessao"],
                                 p["classificacao_ipc"], p["classificacao_cpc"], p["titulo"], p["resumo"],
                                 p["depositante"], p["inventor"]))

        connection.commit()
        cursor.close()
        connection.close()

        print("✅ Dados salvos no banco com sucesso!")

        os.remove(TSV_FILE)  # Removendo o arquivo após salvar

        return jsonify({"message": "✅ Patentes salvas no banco e arquivo apagado!"})
    
    except Exception as e:
        print(f"❌ ERRO no salvamento: {e}")
        return jsonify({"error": str(e)}), 500


# 📌 Rota para listar histórico de buscas salvas
@app.route("/historico", methods=["GET"])
def listar_historico():
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)
        
        cursor.execute("SELECT * FROM patentes ORDER BY id DESC")
        results = cursor.fetchall()

        cursor.close()
        connection.close()

        return jsonify(results)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 📌 Iniciar servidor
if __name__ == "__main__":
    app.run(debug=True, port=5000)