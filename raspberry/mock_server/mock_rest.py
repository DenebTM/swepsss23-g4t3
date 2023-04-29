from flask import Flask,jsonify
import time 

app = Flask(__name__)
status_called = False
#Route that initiates connection
@app.route('/access-points/', methods=['POST'])
def status():
    global status_called
    status_called = True
    response = {'name': 'office1', 'serverAddress': 'localhost'}
    return jsonify(response), 200

#Route that polls for connection-update
@app.route('/access-points/1/', methods=['GET'])
def accesspoint_connection():
    if status_called: 
        if int(time.time()) >= time_now + 180:
            response = {'status': 'offline'}
        else:
            response = {'status': 'searching'}
        return jsonify(response), 200
    else:
        return 401

#Route that updates Sensorstation Thressholds
@app.route('/access-points/1/sensor-stations/1/', methods=['GET'])
def thresshold_update():
    if status_called:
        response = {
                'name': 'SensorStation1',
                'transmissioninterval': 60,
                'thresholds': {
                    'temperature_max': 25,
                    'temperature_min': 10,
                    'humidity_max': 80,
                    'humidity_min': 30,
                    'air_pressure_max': 1000,
                    'air_pressure_min': 900,
                    'illuminance_max': 1000,
                    'illuminance_min': 100,
                    'air_quality_index_max': 50,
                    'air_quality_index_min': 0,
                    'soil_moisture_max': 50,
                    'soil_moisture_min': 10
                    }
                }
        
        return jsonify(response), 200
    else:
        return 401

# Route that asks for Instructions for each Sensorstation
@app.route('/access-points/1/sensor-stations/', methods=['GET'])
def ask_for_instructions_ss():
    if status_called:
        response = [
            {201: 'OFFLINE'},
            {202: 'ONLINE'},
            {103: 'PAIRING'}
        ]

        return jsonify(response), 200
    else:
        return 401

# Route to send sensor failures to backend
@app.route('sensor-stations/101', methods=['PUT'])
def report_connection_to_ss_to_backend():
    if status_called:
        return 200
    else:
        return 401
    
# Route to send sensor failures to backend
@app.route('/access-points/1/sensor-stations/101', methods=['PUT'])
def send_sensor_failures():
    if status_called:
        return 200
    else:
        return 401
    

#Route to send sensor data
@app.route('/access-points/1/sensor-stations/101', methods=['POST'])
def send_sensor_data():
    if status_called:
        return 200
    else:
        return 401
    

if __name__ == '__main__':
    time_now = int(time.time())
    app.run()
