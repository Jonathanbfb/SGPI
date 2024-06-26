import requests
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

try:
    driver = webdriver.Chrome(r"C:\Users\Callidus\Downloads\chromedriver-win64\chromedriver-win64\chromedriver", options=Options())
    print(driver.get('http://patents.google.com/advanced'))
    response = requests.get('http://patents.google.com/advanced')
    if response.status_code == 200:
        print('Conectado à internet')
    else:
        print('Não conectado à internet')
except:
    print('Não conectado à internet')
