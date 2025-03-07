from flask import Flask, request, jsonify
from flask_cors import CORS  # ✅ Importação do Flask-CORS
import subprocess
import os
import csv
import mysql.connector

app = Flask(__name__)
CORS(app)


# 📌 Configuração do Banco de Dados MySQL
db_config = {
    "host": "localhost",
    "user": "root",
    "password": "10203040",  # Modifique conforme necessário
    "database": "patentes_db"
}

# 📌 Caminho do arquivo gerado pelo `buscar_patentes.py`
TSV_FILE = "dados_patentes_corrigido.tsv"

# 📌 Função para executar `buscar_patentes.py`
def executar_scraper(termo):
    try:
        print(f"🔍 Buscando patentes para: {termo}")
        script_path = os.path.join(os.path.dirname(__file__), "buscar_patentes.py")
        python_executable = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".venv", "Scripts", "python.exe")
        subprocess.run([python_executable, script_path, termo], check=True)
        print("✅ Scraper concluído!")
    except subprocess.CalledProcessError as e:
        print(f"❌ Erro ao executar scraper: {e}")
# 📌 Função para ler o arquivo `dados_patentes_corrigido.tsv`
def ler_arquivo_tsv():
    if not os.path.exists(TSV_FILE):
        return []

    patentes = []
    with open(TSV_FILE, "r", encoding="utf-8-sig") as file:
        reader = csv.reader(file, delimiter="\t")
        for row in reader:
            if len(row) >= 10:  # Certificando-se de que há dados suficientes
                patentes.append({
                    "numero": row[0],
                    "data_deposito": row[1],
                    "data_publicacao": row[2],
                    "data_concessao": row[3],
                    "classificacao_ipc": row[4],
                    "classificacao_cpc": row[5],
                    "titulo": row[6],
                    "resumo": row[7],
                    "depositante": row[8],
                    "inventor": row[9]
                })
    return patentes

# 📌 Rota para iniciar a busca e ler os resultados
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
        return jsonify({"error": "Nenhum dado para salvar!"}), 400

    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()

        sql = """
            INSERT INTO patentes (numero, data_deposito, data_publicacao, data_concessao, classificacao_ipc, classificacao_cpc, titulo, resumo, depositante, inventor)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """

        for p in patentes:
            cursor.execute(sql, (p["numero"], p["data_deposito"], p["data_publicacao"], p["data_concessao"],
                                 p["classificacao_ipc"], p["classificacao_cpc"], p["titulo"], p["resumo"],
                                 p["depositante"], p["inventor"]))

        connection.commit()
        cursor.close()
        connection.close()

        # ✅ Após salvar no banco, apagar o arquivo `.tsv`
        os.remove(TSV_FILE)

        return jsonify({"message": "✅ Patentes salvas no banco e arquivo apagado!"})
    
    except Exception as e:
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