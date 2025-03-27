from flask import Flask, jsonify, request
import main

app = Flask(__name__)

def search(search_term):
    patents_links = main.GooglePatentsScraper(search_term).resultados
    #patents_data = main.GooglePatentsScraper(search_term).dados_resultados
    return(patents_links)

    '''
    @app.route('/')
    def obter_liks():
        return jsonify(patents_links)
    
    @app.route('/google/files')
    def obter_dados_links():
        return jsonify(patents_data)
    
    app.run(port=2000, host = 'localhost', debug = True)
    '''