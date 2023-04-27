from flask import Flask,jsonify


app = Flask(__name__)


@app.route('/accesspoints', methods=['POST'])
def status():
    response = {'name': 'office1', 'serverAddress': 'localhost'}
    return jsonify(response), 200


if __name__ == '__main__':
    app.run()
