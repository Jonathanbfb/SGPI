from flask import Flask, request, jsonify
from flask_cors import CORS  # ✅ Importação do Flask-CORS
import subprocess
import os
import csv
import mysql.connector
import sys
from datetime import datetime

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# 📌 Configuração do Banco de Dados MySQL
db_config = {
    "host": "localhost",
    "user": "root",
    "password": "10203040",  
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
    data = request.get_json()
    if not data or "termo" not in data:
        return jsonify({"error": "Nenhum termo de busca fornecido!"}), 400

    termo = data["termo"]
    executar_scraper(termo)  # Executa a busca
    patentes = ler_arquivo_tsv()  # Obtém os dados extraídos

    return jsonify(patentes)

# 📌 Rota para salvar as patentes no banco de dados
@app.route("/salvar", methods=["POST"])
def salvar_patentes():
    data = request.get_json()
    palavra_chave = data.get("palavra_chave")

    if not palavra_chave:
        return jsonify({"error": "Palavra-chave não fornecida!"}), 400

    patentes = ler_arquivo_tsv()
    if not patentes:
        return jsonify({"error": "Nenhum dado para salvar!"}), 400

    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()

        # 1️⃣ Inserir a busca
        cursor.execute("INSERT INTO buscas (palavra_chave) VALUES (%s)", (palavra_chave,))
        id_busca = cursor.lastrowid  # Pega o ID gerado

        # 2️⃣ Inserir patentes vinculadas
        sql = """
            INSERT IGNORE INTO patentes
            (numero, data_deposito, data_publicacao, data_concessao, classificacao_ipc, classificacao_cpc,
             titulo, resumo, depositante, inventor, id_busca)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """

        for p in patentes:
            cursor.execute(sql, (
                p["numero"], p["data_deposito"], p["data_publicacao"], p["data_concessao"],
                p["classificacao_ipc"], p["classificacao_cpc"], p["titulo"], p["resumo"],
                p["depositante"], p["inventor"], id_busca
            ))

        connection.commit()
        cursor.close()
        connection.close()

        os.remove(TSV_FILE)

        return jsonify({"message": "✅ Dados salvos com sucesso!", "id_busca": id_busca})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 📌 Rota para listar histórico de buscas salvas
@app.route("/historico", methods=["GET"])
def listar_historico():
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)

        cursor.execute("""
            SELECT 
                b.id AS id_busca,
                b.palavra_chave,
                b.data_busca,
                COUNT(p.id) AS total_patentes
            FROM buscas b
            LEFT JOIN patentes p ON p.id_busca = b.id
            GROUP BY b.id, b.palavra_chave, b.data_busca
            ORDER BY b.data_busca DESC
        """)
        resultados = cursor.fetchall()

        cursor.close()
        connection.close()

        return jsonify(resultados)

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/patentes/<int:id_busca>", methods=["GET"])
def listar_patentes_por_busca(id_busca):
        try:
            connection = mysql.connector.connect(**db_config)
            cursor = connection.cursor(dictionary=True)

            cursor.execute("SELECT * FROM patentes WHERE id_busca = %s", (id_busca,))
            resultados = cursor.fetchall()

            cursor.close()
            connection.close()

            return jsonify(resultados)

        except Exception as e:
            return jsonify({"error": str(e)}), 500



# 📌 Iniciar servidor
if __name__ == "__main__":
    app.run(debug=True, port=5000)