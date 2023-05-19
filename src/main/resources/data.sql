INSERT INTO userx (FIRST_NAME, LAST_NAME, PASSWORD, USERNAME, CREATE_DATE, EMAIL, USER_ROLE) VALUES
    ('Admin', 'Istrator',    '$2a$12$7EtEJP.p94px6dTVNvMPeOK61pgCNyqcA8X9uetAyR6ohgCmGOcXi', 'admin', '2016-01-01 00:00:00', 'admin@example.at', 'ADMIN'),
    ('Susi',  'Gruen',       '$2a$12$maZ21vfYESvLGjKiyuYXBOREyo2w.y61hc1NSC6BIBGJKMYFywvla', 'susi',  '2016-01-01 00:00:00', 'susi@example.at',  'GARDENER'),
    ('Max',   'Mustermann',  '$2a$12$5111Zqs2OXpalPoUfWdbhO3nGJGBc9/tsWtGGrTYkgOn8znsemlUS', 'max',   '2016-01-01 00:00:00', 'max@example.at',   'USER'),
    ('Elvis', 'The King',    '$2a$12$qxzS0FvYminkczt76S813OvrmYMpfRh/OcmRi2Qh9AlpUbv6aRiiO', 'elvis', '2016-01-01 00:00:00', 'elvis@example.at', 'ADMIN'),
    ('Hans',  'G',           '$2a$12$mUtI13l8bq9vZ0Ogme7gqO0ZaP7mfyw4OY6/./jWBkeyv6sQCW2FK', 'hans',  '2016-01-01 00:00:00', 'hans@example.at',  'GARDENER'),
    ('Peter', 'G',           '$2a$12$IQmnsgEXkQ8XxqIPQqdBqOS/T/4wi3P8iMkc56fhPVZQpqaJ5UVQC', 'peter', '2016-01-01 00:00:00', 'peter@example.at', 'GARDENER'),
    ('Franz', 'g',           '$2a$12$fWwsyvehfVMvcvegf2qMe.pmE5I/bnpJOn063Za9j5bXnldx5g33q', 'franz', '2016-01-01 00:00:00', 'franz@example.at', 'GARDENER')
  ON DUPLICATE KEY UPDATE USERNAME=USERNAME;

INSERT INTO access_point (AP_NAME, LAST_UPDATE, SERVER_ADDRESS, CLIENT_ADDRESS, AP_STATUS) VALUES
    ('Test AP', '2016-01-01 00:00:00', '192.168.0.101', '192.168.0.102', 'OFFLINE')
  ON DUPLICATE KEY UPDATE AP_NAME=AP_NAME;

INSERT INTO sensor_values (VALUES_ID, AIR_PRESSURE, AIR_QUALITY, HUMIDITY, LIGHT_INTENSITY, SOIL_MOISTURE, TEMPERATURE) VALUES
    ( '1', '900', '20', '20', '20', '20', '20'),
    ( '2', '812',  '0',  '0',  '0',  '0',  '0'),
    ( '3', '920', '30', '30', '30', '30', '30'),
    ( '4', '835', '15',  '4', '29', '24', '15'),
    ( '5', '943', '13', '16', '18',  '6',  '8'),
    ( '6', '855', '25', '22', '20', '17',  '8'),
    ( '7', '969', '29', '29', '11',  '9',  '2'),
    ( '8', '877', '27',  '9', '13', '12', '17'),
    ( '9', '980', '30', '13',  '9', '20', '13'),
    ('10', '893',  '3',  '1', '10', '29', '28'),
    ('11', '900', '20',  '7', '25', '23', '20'),
    ('12', '811', '21', '17', '23', '27', '16'),
    ('13', '929', '19', '15', '18', '11',  '6')
  ON DUPLICATE KEY UPDATE VALUES_ID=VALUES_ID;

INSERT INTO sensor_station (SS_ID, SS_STATUS, AGGREGATION_PERIOD, AP_NAME, UPPER_VALUES_ID, LOWER_VALUES_ID) VALUES
    ('1', 'OFFLINE', '30', 'Test AP', '1', '2'),
    ('2', 'OFFLINE', '60', 'Test AP', '3', '2')
  ON DUPLICATE KEY UPDATE SS_ID=SS_ID;

INSERT INTO measurement (ID, TIMESTAMP, VALUES_ID, SENSOR_STATION_SS_ID) VALUES
    ( '1', '2023-04-01 00:00:00',  '1', '1'),
    ( '2', '2023-04-15 00:00:00',  '1', '1'),
    ( '3', '2023-04-23 00:00:00',  '2', '2'),
    ( '4', '2023-05-02 00:00:00',  '3', '2'),
    ( '5', '2023-05-03 00:00:00',  '4', '1'),
    ( '6', '2023-05-05 00:00:00', '13', '1'),
    ( '7', '2023-05-06 00:00:00',  '8', '1'),
    ( '8', '2023-05-06 00:00:00',  '5', '2'),
    ( '9', '2023-05-06 00:00:00',  '6', '2'),
    ('10', '2023-05-08 00:00:00',  '7', '1'),
    ('11', '2023-05-09 00:00:00',  '7', '2'),
    ('12', '2023-05-11 00:00:00',  '8', '2'),
    ('13', '2023-05-12 00:00:00',  '9', '1'),
    ('14', '2023-05-12 00:00:00', '10', '1'),
    ('15', '2023-05-12 00:00:00',  '3', '1'),
    ('16', '2023-05-13 00:00:00', '11', '2'),
    ('17', '2023-05-14 00:00:00', '11', '1'),
    ('18', '2023-05-15 00:00:00',  '4', '2'),
    ('19', '2023-05-16 00:00:00', '12', '1'),
    ('20', '2023-05-17 00:00:00', '13', '2'),
    ('21', '2023-05-18 00:00:00',  '6', '2')
  ON DUPLICATE KEY UPDATE ID=ID;
