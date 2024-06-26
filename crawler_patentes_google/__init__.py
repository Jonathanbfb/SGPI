from flask import Flask, jsonify, request
import main
print('here')
app = Flask(__name__)

def search(search_term):
    print('\n\nsearch_term\n\n')
    patents_links = main.GooglePatentsScraper(search_term).resultados
    #patents_data = main.GooglePatentsScraper(search_term).dados_resultados


    @app.route('/')
    def obter_liks():
        return jsonify(patents_links)
    '''
    @app.route('/google/files')
    def obter_dados_links():
        return jsonify(patents_data)
    '''
    app.run(port=4000, host = 'localhost', debug = True)

search('bernoulli')
