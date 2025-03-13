from flask import Blueprint, request, jsonify
from db import get_db_connection

patent_routes = Blueprint("patent_routes", __name__)

@patent_routes.route("/patentes", methods=["POST"])
def add_patente():
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO patentes (natureza, cpf_cnpj, responsavel, titulo, documento, usuario_id) VALUES (%s, %s, %s, %s, %s, %s)",
                   (data["natureza"], data["cpf_cnpj"], data["responsavel"], data["titulo"], data["documento"], data["usuario_id"]))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Patente cadastrada com sucesso!"}), 201

@patent_routes.route("/patentes/<int:id>", methods=["DELETE"])
def delete_patente(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM patentes WHERE id = %s", (id,))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Patente removida com sucesso!"})
