from bs4 import BeautifulSoup
import csv

# Carregar o HTML
with open("html_BR 10 2019 004292 3.html", "r", encoding="ISO-8859-1") as file:
    soup = BeautifulSoup(file, "html.parser")

# Encontrar a tabela específica (a segunda tabela com width="780px")
tabelas = soup.find_all("table", {"width": "780px"})  # Obtém todas as tabelas com esse width
tabela_dados = tabelas[1]  # Pegamos a segunda tabela, que contém os dados relevantes

# Abrir um arquivo CSV para salvar os dados
with open("dados_patente.csv", "w", newline="", encoding="utf-8-sig") as csvfile:
    writer = csv.writer(csvfile)

    # Iterar sobre as linhas da tabela
    for row in tabela_dados.find_all("tr"):
        cols = row.find_all(["td", "th"])  # Captura cabeçalhos e células
        cols = [col.text.strip() for col in cols if col.text.strip()]  # Remove espaços extras e vazios
        if cols:
            writer.writerow(cols)  # Escreve a linha no CSV

print("Os dados da tabela foram extraídos e salvos em 'dados_patente.csv'.")
