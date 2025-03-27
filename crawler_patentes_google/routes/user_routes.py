from flask import Blueprint, request, jsonify
from db import get_db_connection

user_routes = Blueprint("user_routes", __name__)

@user_routes.route("/usuarios", methods=["GET"])
def get_usuarios():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id, nome, email, perfil FROM usuarios")
    usuarios = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(usuarios)

@user_routes.route("/usuarios/<int:id>", methods=["DELETE"])
def delete_usuario(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM usuarios WHERE id = %s", (id,))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Usuário removido com sucesso!"})
