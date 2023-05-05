from flask import Flask,jsonify, request
import time
import json

app = Flask(__name__)
status_called = False

stations = []
def station_idx(id):
    try:
        return [station['id'] == id for station in stations].index(True)
    except ValueError:
        return -1


#Route that initiates connection
@app.route('/access-points', methods=['POST'])
def status():
    global status_called
    status_called = True
    response = {'name': 'AP1', 'serverAddress': 'localhost'}
    return jsonify(response), 200

# Route that polls for connection-update
@app.route('/access-points/AP1', methods=['GET'])
def accesspoint_connection():
    if status_called:
        response = {'status': 'searching'}
        # if int(time.time()) >= time_now + 50 and int(time.time()) <= time_now + 70:
        #     response = {'status': 'searching'}
        # elif (int(time.time())) >= time_now + 70:
        #     response = {'status': 'online'}
        # else:
        #     response = {'status': 'searching'}
        return jsonify(response), 200
    else:
        return jsonify('Forbidden'), 401

# Route that updates Sensorstation thresholds
@app.route('/access-points/AP1/sensor-stations/<id>', methods=['GET'])
def threshold_update(id):
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
        id = int(id)
        try:
            idx = station_idx(int(id))
            if idx == -1:
                raise ValueError
            stations[idx]['status'] = 'ONLINE'
            print(f'station {id} set to ONLINE; current stations:', stations)
        except ValueError:
            print(f'Sensor station {id} not known')
            return jsonify(f'Sensor station {id} not known'), 404
        except Exception as e:
            print(e)
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
    global stations
    if status_called:
        new_ss = request.get_json()
        for ss in new_ss:
            ss_id = ss['id']
            idx = station_idx(ss_id)
            if idx == -1:
                stations.append({ 'id': ss_id, 'status': 'PAIRING' })
                print('new station added; current stations: ', stations)

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
