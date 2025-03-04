import csv
import time
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
options.headless = False  # Mudar para True se quiser rodar sem abrir o navegador

service = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(service=service, options=options)
wait = WebDriverWait(driver, 30)  # Aumentado para garantir carregamento completo

# 1️⃣ Acessar a página inicial
driver.get("https://busca.inpi.gov.br/pePI/")
print("✅ Página inicial acessada!")

# 2️⃣ Acessar a página de login
driver.get("https://busca.inpi.gov.br/pePI/servlet/LoginController?action=login")
print("🔑 Página de login acessada!")

# 3️⃣ Acessar a página de pesquisa
driver.get("https://busca.inpi.gov.br/pePI/jsp/patentes/PatenteSearchBasico.jsp")
print("🔍 Página de pesquisa acessada!")

try:
    # 4️⃣ Preencher campo de pesquisa
    campo_pesquisa = wait.until(EC.presence_of_element_located((By.NAME, "ExpressaoPesquisa")))
    campo_pesquisa.send_keys("chocolate branco amargo")
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

    # 🔹 Criar lista para armazenar os detalhes de cada patente
    detalhes_patentes = []

    # 9️⃣ Clicar em cada link para extrair mais informações
    for patente in patentes:
        driver.get(patente["link"])
        time.sleep(10)  # Tempo extra para garantir carregamento completo

        print(f"🔎 Extraindo detalhes de {patente['numero_patente']}")

        # 📌 **Depuração**: Verificar HTML carregado
        html_pagina = driver.page_source
        with open(f"html_{patente['numero_patente']}.html", "w", encoding="utf-8") as file:
            file.write(html_pagina)

        print("🔍 HTML salvo para análise.")

        # 📌 Esperar até que o título da patente esteja visível
        try:
            titulo_elemento = wait.until(EC.presence_of_element_located((By.XPATH, "//td[contains(text(),'Título:')]/following-sibling::td/div/font")))
            print(f"✅ Página carregada corretamente para {patente['numero_patente']}")
            time.sleep(3)
        except:
            print(f"⚠️ Erro: Página de detalhes não carregou corretamente para {patente['numero_patente']}")
            continue

        def extrair_texto(xpath):
            """Função para extrair texto de um elemento se ele existir, senão retorna '-'."""
            try:
                elemento = driver.find_element(By.XPATH, xpath)
                return elemento.text.strip()
            except:
                return "-"

        detalhes = {
            "numero_pedido": extrair_texto("//td[contains(text(),'Nº do Pedido:')]/following-sibling::td/font"),
            "data_deposito": extrair_texto("//td[contains(text(),'Data do Depósito:')]/following-sibling::td/font"),
            "data_publicacao": extrair_texto("//td[contains(text(),'Data da Publicação:')]/following-sibling::td/font"),
            "data_concessao": extrair_texto("//td[contains(text(),'Data da Concessão:')]/following-sibling::td/font"),
            "classificacao_ipc": extrair_texto("//td[contains(text(),'Classificação IPC:')]/following-sibling::td/a"),
            "classificacao_cpc": extrair_texto("//td[contains(text(),'Classificação CPC:')]/following-sibling::td/a"),
            "titulo": extrair_texto("//td[contains(text(),'Título:')]/following-sibling::td/div/font"),
            "resumo": extrair_texto("//td[contains(text(),'Resumo:')]/following-sibling::td/div/font"),
            "depositante": extrair_texto("//td[contains(text(),'Nome do Depositante:')]/following-sibling::td/font"),
            "inventores": extrair_texto("//td[contains(text(),'Nome do Inventor:')]/following-sibling::td/font"),
            "link": patente["link"]
        }

        detalhes_patentes.append(detalhes)

    # 🔹 Salvar os detalhes em um CSV
    with open("detalhes_patentes.csv", "w", newline="", encoding="utf-8") as file:
        fieldnames = ["numero_pedido", "data_deposito", "data_publicacao", "data_concessao", "classificacao_ipc",
                      "classificacao_cpc", "titulo", "resumo", "depositante", "inventores", "link"]
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(detalhes_patentes)

    print("📁 Dados detalhados salvos em 'detalhes_patentes.csv'!")

except Exception as e:
    print(f"❌ Erro durante a execução: {e}")

finally:
    # Fechar navegador
    driver.quit()
