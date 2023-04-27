from flask import Flask,jsonify
import time 

app = Flask(__name__)

time_now = int(time.time())

@app.route('/access-points/', methods=['POST'])
def status():
    response = {'name': 'office1', 'serverAddress': 'localhost'}
    return jsonify(response), 200

@app.route('/access-points/1/', methods=['GET'])
def accesspoint_connection():
    if time_now == time_now + 500:
        response = {status: 'offline'}
    else:
        response = {status: 'searching'}
    return jsonify(response), 200

@app.route('/access-points/1/sensor-stations/1/', methods=['GET'])
def thresshold_update():
    response = {
            "name": "SensorStation1",
            "transmissioninterval": 60,
            "thresholds": {
                "temperature_max": 25,
                "temperature_min": 10,
                "humidity_max": 80,
                "humidity_min": 30,
                "air_pressure_max": 1000,
                "air_pressure_min": 900,
                "illuminance_max": 1000,
                "illuminance_min": 100,
                "air_quality_index_max": 50,
                "air_quality_index_min": 0,
                "soil_moisture_max": 50,
                "soil_moisture_min": 10
                }
            }
    
    return jsonify(response), 200


@app.route('/access-points/1/sensor-stations/', methods=['GET'])
def ask_for_instructions_ss():
    response = [
        {201: "OFFLINE"},
        {202: "ONLINE"},
        {103: "PAIRING"}
        ]

    
    return jsonify(response), 200


if __name__ == '__main__':
    app.run()
