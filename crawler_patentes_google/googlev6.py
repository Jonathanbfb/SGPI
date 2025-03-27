import csv
import re
from bs4 import BeautifulSoup

# Ler o HTML corretamente com a codificação original
with open("html_BR 10 2019 004292 3.html", "r", encoding="ISO-8859-1") as file:
    soup = BeautifulSoup(file, "html.parser")

# Encontrar a tabela específica (a segunda tabela com width="780px")
tabelas = soup.find_all("table", {"width": "780px"})
tabela_dados = tabelas[1]  # Pegamos a segunda tabela que contém os dados relevantes

# Abrir um arquivo CSV no formato tabulado
with open("dados_patente_corrigido.tsv", "w", newline="", encoding="utf-8-sig") as csvfile:
    writer = csv.writer(csvfile, delimiter="\t")  # Define TAB como separador

    # Iterar sobre as linhas da tabela
    for row in tabela_dados.find_all("tr"):
        cols = row.find_all(["td", "th"])  # Captura cabeçalhos e células
        # Limpar espaços, remover quebras de linha, converter caracteres especiais e ignorar células vazias
        cols = [re.sub(r"\s+", " ", col.text.strip()).encode("latin1").decode("utf-8") for col in cols if col.text.strip()]
        if cols:  # Apenas adiciona linhas que contenham dados
            writer.writerow(cols)

print("Os dados foram corrigidos e salvos em 'dados_patente_corrigido.tsv'.")
