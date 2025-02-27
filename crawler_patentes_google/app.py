from flask import Flask, jsonify, render_template, url_for, request
import google_api
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')     
@app.route("/ola", methods = ['POST', 'GET'])
def resultado():
    return 'data'   

@app.route("/result", methods = ['POST'])
def result():
    #print('---------------inicio---------------')
    #print(request.get_json())
    output = request.get_json()
    #print(output.get('buscaPatente'))
    buscaPatente = output["buscaPatente"]
    #buscaPatente = 'fibonacci'
    buscaPatente = (google_api.search(buscaPatente))
    #buscaPatente = [{'link': 'https://patents.google.com/patent/KR19990075769A/en', 'titulo': 'Tire bead consisting of elliptical steel wire with Fibonacci ratio'}, {'link': 'https://patents.google.com/patent/SU1324019A2/en', 'titulo': 'P-number fibonacci sequence generator'}, {'link': 'https://patents.google.com/patent/SU1149261A1/en', 'titulo': 'Device for checking optimum fibonacci p-codes'}]
    data = jsonify({'patentes': buscaPatente, 'result':'sucesso'})
    return data
if __name__ == '__main__':
    app.run(debug=True, port=3012)