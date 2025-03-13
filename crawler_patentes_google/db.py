import mysql.connector

db_config = {
    "host": "localhost",
    "user": "root",
    "password": "10203040",
    "database": "patentes_db"
}

def get_db_connection():
    return mysql.connector.connect(**db_config)
