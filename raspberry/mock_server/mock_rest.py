from flask import Flask,jsonify, request
import time

app = Flask(__name__)
status_called = False

stations = [
    {'201': 'OFFLINE'},
    {'202': 'ONLINE'},
    {'103': 'PAIRING'}
]

#Route that initiates connection
@app.route('/access-points', methods=['POST'])
def status():
    global status_called
    status_called = True
    response = {'name': 'office1', 'serverAddress': 'localhost'}
    return jsonify(response), 200

# Route that polls for connection-update
@app.route('/access-points/AP1', methods=['GET'])
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

# Route that updates Sensorstation thresholds
@app.route('/access-points/AP1/sensor-stations/<id>', methods=['GET'])
def thresshold_update(id):
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

# Route that asks for instructions for each sensor station
@app.route('/access-points/AP1/sensor-stations', methods=['GET'])
def ask_for_instructions_ss():
    global stations
    if status_called:
        return jsonify(stations), 200
    else:
        return jsonify('Forbidden'), 401

# Route to update connection status in backend
@app.route('/sensor-stations/<id>', methods=['PUT'])
def report_connection_to_ss_to_backend(id):
    global stations
    if status_called:
        idx = [True if id in station else False for station in stations].index(True)
        stations[idx] = { id: 'ONLINE' }
        print(stations)
        return jsonify('OK'), 200
    else:
        return jsonify('Forbidden'), 401
    
# Route to send sensor failures to backend
@app.route('/access-points/AP1/sensor-stations/<id>', methods=['PUT'])
def send_sensor_failures(id):
    if status_called:
        return jsonify('OK'), 200
    else:
        return jsonify('Forbidden'), 401

# Route to send back the sensor stations
@app.route('/access-points/AP1/sensor-stations', methods=['POST'])
def send_found_ss():
    # global sensorstations
    if status_called:
        # json_data = request.get_json()
        # sensorstations.append(json_data)
        return jsonify('OK'), 200
    else:
        return jsonify('Forbidden'), 401

    

# Route to send sensor data
@app.route('/access-points/AP1/sensor-stations/<id>', methods=['POST'])
def send_sensor_data(id):
    if status_called:
        return jsonify('OK'), 200
    else:
        return jsonify('Forbidden'), 401
    

if __name__ == '__main__':
    time_now = int(time.time())
    app.run()
