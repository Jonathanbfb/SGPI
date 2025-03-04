import os
import csv
import re
from bs4 import BeautifulSoup

# Criar arquivo final de saída
output_file = "dados_patentes_corrigido.tsv"

# Abrir o arquivo para escrita no formato tabulado (TSV)
with open(output_file, "w", newline="", encoding="utf-8-sig") as csvfile:
    writer = csv.writer(csvfile, delimiter="\t")  # Define TAB como separador

    # Processar cada arquivo HTML salvo na pasta 'html_patentes'
    for index, filename in enumerate(sorted(os.listdir("html_patentes"))):
        filepath = os.path.join("html_patentes", filename)

        # Tenta abrir o arquivo com UTF-8, se falhar tenta ISO-8859-1
        try:
            with open(filepath, "r", encoding="utf-8") as file:
                soup = BeautifulSoup(file, "html.parser")
        except UnicodeDecodeError:
            with open(filepath, "r", encoding="ISO-8859-1") as file:
                soup = BeautifulSoup(file, "html.parser")

        # Encontrar todas as tabelas na página (a segunda geralmente contém os dados)
        tabelas = soup.find_all("table", {"width": "780px"})
        if len(tabelas) < 2:
            print(f"⚠️ Aviso: Nenhuma tabela válida encontrada em {filename}")
            continue

        tabela_dados = tabelas[1]  # Pegamos a segunda tabela que contém os dados relevantes

        # Iterar sobre as linhas da tabela e extrair os dados
        for row in tabela_dados.find_all("tr"):
            cols = row.find_all(["td", "th"])  # Captura cabeçalhos e células
            # Limpar espaços extras, remover quebras de linha e caracteres especiais corretamente
            cols = [re.sub(r"\s+", " ", col.text.strip()) for col in cols if col.text.strip()]
            if cols:  # Apenas adiciona linhas que contenham dados
                writer.writerow(cols)

        print(f"📄 Dados extraídos de {filename} e salvos no arquivo.")

print(f"✅ Extração concluída! Os dados foram salvos em '{output_file}'.")
