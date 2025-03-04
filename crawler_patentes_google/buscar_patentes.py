import os
import time
import csv
import subprocess
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

# 📌 Configuração do WebDriver
options = Options()
options.add_argument("--disable-gpu")
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")
options.headless = False  # Mudar para True para rodar sem abrir o navegador

service = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(service=service, options=options)
wait = WebDriverWait(driver, 30)

# Criar diretório para armazenar os HTMLs das patentes
os.makedirs("html_patentes", exist_ok=True)

# 🔍 1️⃣ Acessar a página inicial
driver.get("https://busca.inpi.gov.br/pePI/")
print("✅ Página inicial acessada!")

# 🔑 2️⃣ Acessar a página de login
driver.get("https://busca.inpi.gov.br/pePI/servlet/LoginController?action=login")
print("🔑 Página de login acessada!")

# 🔍 3️⃣ Acessar a página de pesquisa
driver.get("https://busca.inpi.gov.br/pePI/jsp/patentes/PatenteSearchBasico.jsp")
print("🔍 Página de pesquisa acessada!")

try:
    # 4️⃣ Preencher campo de pesquisa
    campo_pesquisa = wait.until(EC.presence_of_element_located((By.NAME, "ExpressaoPesquisa")))
    campo_pesquisa.send_keys("alfabetização")
    print("✍️ Campo de pesquisa preenchido!")

    # 5️⃣ Selecionar tipo de busca
    select = wait.until(EC.presence_of_element_located((By.NAME, "FormaPesquisa")))
    select.send_keys("todas as palavras")
    print("📌 Tipo de busca selecionado!")

    # 6️⃣ Clicar no botão de pesquisa
    botao_pesquisa = wait.until(EC.element_to_be_clickable((By.NAME, "botao")))
    botao_pesquisa.click()
    print("▶️ Botão de pesquisa clicado!")

    # 7️⃣ Aguardar o carregamento dos resultados
    time.sleep(5)

    # 8️⃣ Extrair lista de patentes com links
    patentes = []
    for tr in driver.find_elements(By.XPATH, "//tr[@bgcolor='#E0E0E0' or @bgcolor='white']"):
        cols = tr.find_elements(By.TAG_NAME, "td")
        if len(cols) >= 3:
            numero_patente = cols[0].text.strip()
            titulo = cols[2].text.strip()

            # Encontrar o link de detalhes
            link_element = cols[0].find_element(By.TAG_NAME, "a")
            link = link_element.get_attribute("href") if link_element else None

            if link:
                patentes.append({"numero_patente": numero_patente, "titulo": titulo, "link": link})

    print(f"📄 {len(patentes)} patentes encontradas!")

    # 9️⃣ Acessar cada página e salvar HTML
    for index, patente in enumerate(patentes, start=1):
        driver.get(patente["link"])
        time.sleep(10)  # Aguardar carregamento completo

        print(f"🔎 Extraindo detalhes de {patente['numero_patente']}")

        # Salvar HTML
        html_pagina = driver.page_source
        filename = f"html_patentes/{patente['numero_patente']}.html"
        with open(filename, "w", encoding="utf-8") as file:
            file.write(html_pagina)

        print(f"✅ Página salva: {filename}")

except Exception as e:
    print(f"❌ Erro: {e}")

finally:
    driver.quit()

# 🔹 Após buscar as patentes, chamar o script de extração de dados
print("⏳ Executando extração de dados...")
subprocess.run(["python", "extrair_dados.py"])
