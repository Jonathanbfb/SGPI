from flask import Flask, request, jsonify
from scrapy.crawler import CrawlerRunner
from twisted.internet import reactor
from scrapy.utils.project import get_project_settings
from inpi_scraper.spiders.patentes import PatentesSpider

app = Flask(__name__)
runner = CrawlerRunner(get_project_settings())

@app.route('/buscar_patente', methods=['POST'])
def buscar_patente():
    data = request.json
    termo = data.get('termo', '')
    forma = data.get('forma', 'todasPalavras')

    if not termo:
        return jsonify({"erro": "O campo 'termo' é obrigatório."}), 400

    d = runner.crawl(PatentesSpider, termo=termo, forma=forma)
    d.addCallback(lambda _: {"status": "Busca iniciada. Aguarde resultados no log."})
    return jsonify({"status": "Busca em andamento..."})

if __name__ == '__main__':
    reactor.run()
