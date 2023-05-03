from flask import Flask,jsonify, request
import time

sensorstations = []

app = Flask(__name__)
status_called = False

#Route that initiates connection
@app.route('/access-points', methods=['POST'])
def status():
    global status_called
    status_called = True
    response = {'name': 'office1', 'serverAddress': 'localhost'}
    return jsonify(response), 200

#Route that polls for connection-update
@app.route('/access-points/'+ 'AP1', methods=['GET'])
def accesspoint_connection():
    if status_called:
        if int(time.time()) >= time_now + 50 and int(time.time()) <= time_now + 70:
            response = {'status': 'offline'}
        elif (int(time.time())) >= time_now + 70:
            response = {'status': 'online'}
        else:
            response = {'status': 'searching'}
        return jsonify(response), 200
    else:
        return jsonify('Forbidden'), 401

#Route that updates Sensorstation Thressholds
@app.route('/access-points/1/sensor-stations/1/', methods=['GET'])
def thresshold_update():
    if status_called:
        response = {
            'id': 'SensorStation1',
            'status': 'OK',
            'gardeners':[
                'user1',
                'user2'
            ],
            'transmission_interval': 500,
            'accessPoint': 'AccessPoint1',
            'lowerBound': {
                'airPressure': 0,
                'airQuality': 0,
                'humidity': 0,
                'lightIntensity': 0,
                'soilMoisture': 0,
                'temperature': 0
            },
            'upperBound': {
                'airPressure': 20,  
                'airQuality': 20,
                'humidity': 20,
                'lightIntensity': 20,
                'soilMoisture': 20,
                'temperature': 20
            }
        }
        
        return jsonify(response), 200
    else:
        return jsonify('Forbidden'), 401

# Route that asks for Instructions for each Sensorstation
@app.route('/access-points/AP1/sensor-stations', methods=['GET'])
def ask_for_instructions_ss():
    global sensorstations
    if status_called:
        response = [
            {201: 'OFFLINE'},
            {202: 'ONLINE'},
            {103: 'PAIRING'}
        ]

        return jsonify(response), 200
    else:
        return jsonify('Forbidden'), 401

# Route to send sensor failures to backend
@app.route('/sensor-stations/101', methods=['PUT'])
def report_connection_to_ss_to_backend():
    if status_called:
        return jsonify('OK'), 200
    else:
        return jsonify('Forbidden'), 401
    
# Route to send sensor failures to backend
@app.route('/access-points/1/sensor-stations/101', methods=['PUT'])
def send_sensor_failures():
    if status_called:
        return jsonify('OK'), 200
    else:
        return jsonify('Forbidden'), 401

#Route to send back the Sensorstations
@app.route('/access-points/AP1/sensor-stations', methods=['POST'])
def send_found_ss():
    global sensorstations
    if status_called:
        json_data = request.get_json()
        sensorstations.append(json_data)
        return jsonify('OK'), 200
    else:
        return jsonify('Forbidden'), 401

    

#Route to send sensor data
@app.route('/access-points/1/sensor-stations/101', methods=['POST'])
def send_sensor_data():
    if status_called:
        return jsonify('OK'), 200
    else:
        return jsonify('Forbidden'), 401
    

if __name__ == '__main__':
    time_now = int(time.time())
    app.run()
