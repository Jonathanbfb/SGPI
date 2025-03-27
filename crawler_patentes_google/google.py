from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import time

# Configurar opções do navegador
options = webdriver.ChromeOptions()
options.add_argument("--disable-gpu")  # Evita erro de GPU
options.add_argument("--no-sandbox")  # Necessário para alguns ambientes
options.add_argument("--disable-dev-shm-usage")  # Reduz uso de memória compartilhada
options.headless = False  # Para visualizar o navegador durante os testes

# Inicializar o WebDriver
service = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(service=service, options=options)
wait = WebDriverWait(driver, 10)

# 1️⃣ Acessar a página inicial
url_inicial = "https://busca.inpi.gov.br/pePI/"
driver.get(url_inicial)
print("✅ Página inicial acessada!")

# 2️⃣ Acessar a página de login
url_login = "https://busca.inpi.gov.br/pePI/servlet/LoginController?action=login"
driver.get(url_login)
print("🔑 Página de login acessada!")

# 3️⃣ Acessar a página de pesquisa
url_pesquisa = "https://busca.inpi.gov.br/pePI/jsp/patentes/PatenteSearchBasico.jsp"
driver.get(url_pesquisa)
print("🔍 Página de pesquisa acessada!")

try:
    # 4️⃣ Preencher campo de pesquisa
    campo_pesquisa = wait.until(EC.presence_of_element_located((By.NAME, "ExpressaoPesquisa")))
    campo_pesquisa.send_keys("cupuaçu")
    print("✍️ Campo de pesquisa preenchido!")

    # 5️⃣ Selecionar tipo de busca
    select = wait.until(EC.presence_of_element_located((By.NAME, "FormaPesquisa")))
    select.send_keys(Keys.DOWN)  # Escolher "todas as palavras"
    print("📌 Tipo de busca selecionado!")

    # 6️⃣ Clicar no botão de pesquisa
    botao_pesquisa = wait.until(EC.element_to_be_clickable((By.NAME, "botao")))
    botao_pesquisa.click()
    print("▶️ Botão de pesquisa clicado!")

    # 7️⃣ Aguardar o carregamento dos resultados
    time.sleep(5)

    # 8️⃣ Extrair resultados
    patentes = []
    for tr in driver.find_elements(By.XPATH, "//tr[@bgcolor='#E0E0E0' or @bgcolor='white']"):
        cols = tr.find_elements(By.TAG_NAME, "td")
        if len(cols) >= 3:  # Garantir que há colunas suficientes
            numero_patente = cols[0].text.strip()
            titulo = cols[2].text.strip()
            patentes.append({"numero_patente": numero_patente, "titulo": titulo})

    print("📄 Resultados encontrados:")
    for patente in patentes:
        print(patente)

except Exception as e:
    print(f"❌ Erro durante a execução: {e}")

finally:
    # Fechar navegador
    driver.quit()
