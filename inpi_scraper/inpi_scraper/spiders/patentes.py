import scrapy
import json
from urllib.parse import urlencode

class PatentesSpider(scrapy.Spider):
    name = 'patentes'
    base_url = 'https://gru.inpi.gov.br'
    start_urls = ['https://gru.inpi.gov.br/pePI/servlet/LoginController?action=login']

    custom_settings = {
        'DOWNLOAD_TIMEOUT': 600,
    }

    def __init__(self, termo=None, forma='todasPalavras', *args, **kwargs):
        super(PatentesSpider, self).__init__(*args, **kwargs)
        self.termo = termo
        self.forma = forma

    def parse(self, response):
        """ Acessa a página de busca de patentes """
        yield scrapy.Request(
            f"{self.base_url}/pePI/jsp/patentes/PatenteSearchBasico.jsp",
            callback=self.pre_consulta
        )

    def pre_consulta(self, response):
        headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/109.0",
    "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8",
    "Referer": "https://gru.inpi.gov.br/pePI/jsp/patentes/PatenteSearchBasico.jsp"
}
        """ Envia a pesquisa """
        form_data = {
            'ExpressaoPesquisa': self.termo,
            'FormaPesquisa': self.forma,
            'botao': ' pesquisar » ',
            'Action': 'SearchBasico'
        }
        yield scrapy.FormRequest(
            url=f"{self.base_url}/pePI/servlet/PatenteServletController",
            formdata=form_data,
            callback=self.lista,
              headers=headers
        )

    def lista(self, response):
        """ Captura os resultados da pesquisa """
        patentes = []
        items = response.css('tbody.Context tr')
        for item in items:
            link = item.css('td font a.visitado::attr(href)').get()
            if link:
                patentes.append(f"{self.base_url}{link}")

        yield {'patentes': patentes}
