INSERT INTO userx (FIRST_NAME, LAST_NAME, PASSWORD, USERNAME, CREATE_DATE, EMAIL, USER_ROLE) VALUES
    ('Admin', 'Istrator',    '$2a$12$7EtEJP.p94px6dTVNvMPeOK61pgCNyqcA8X9uetAyR6ohgCmGOcXi', 'admin', '2016-01-01 00:00:00', 'admin@example.at', 'ADMIN'),
    ('Susi',  'Gruen',       '$2a$12$maZ21vfYESvLGjKiyuYXBOREyo2w.y61hc1NSC6BIBGJKMYFywvla', 'susi', '2016-01-01 00:00:00', 'susi@example.at', 'GARDENER'),
    ('Max',   'Mustermann',  '$2a$12$5111Zqs2OXpalPoUfWdbhO3nGJGBc9/tsWtGGrTYkgOn8znsemlUS', 'max', '2016-01-01 00:00:00', 'max@example.at', 'USER'),
    ('Elvis', 'The King',    '$2a$12$qxzS0FvYminkczt76S813OvrmYMpfRh/OcmRi2Qh9AlpUbv6aRiiO', 'elvis', '2016-01-01 00:00:00', 'elvis@example.at', 'ADMIN'),
    ('Hans',  'G',           '$2a$12$mUtI13l8bq9vZ0Ogme7gqO0ZaP7mfyw4OY6/./jWBkeyv6sQCW2FK', 'hans', '2016-01-01 00:00:00', 'hans@example.at', 'GARDENER'),
    ('Peter', 'G',           '$2a$12$IQmnsgEXkQ8XxqIPQqdBqOS/T/4wi3P8iMkc56fhPVZQpqaJ5UVQC', 'peter', '2016-01-01 00:00:00', 'peter@example.at', 'GARDENER'),
    ('Franz', 'g',           '$2a$12$fWwsyvehfVMvcvegf2qMe.pmE5I/bnpJOn063Za9j5bXnldx5g33q', 'franz', '2016-01-01 00:00:00', 'franz@example.at', 'GARDENER')
  ON DUPLICATE KEY UPDATE USERNAME=USERNAME;

INSERT INTO access_point (AP_NAME, LAST_UPDATE, SERVER_ADDRESS, AP_STATUS) VALUES
    ('AP 1', '2016-01-01 00:00:00', '192.168.0.101', 'ONLINE')
  ON DUPLICATE KEY UPDATE AP_NAME=AP_NAME;

INSERT INTO sensor_values (VALUES_ID, AIR_PRESSURE, AIR_QUALITY, HUMIDITY, LIGHT_INTENSITY, SOIL_MOISTURE, TEMPERATURE) VALUES
    ('1', '20', '20', '20', '20', '20', '20'),
    ('2', '0', '0', '0', '0', '0', '0'),
    ('3', '30', '30', '30', '30', '30', '30')
  ON DUPLICATE KEY UPDATE VALUES_ID=VALUES_ID;

INSERT INTO sensor_station (SS_ID, STATUS, AGGREGATION_PERIOD, AP_NAME, UPPER_VALUES_ID, LOWER_VALUES_ID) VALUES
    ('1', 'OK', '30', 'AP 1', '1', '2'),
    ('2', 'OK', '60', 'AP 1', '3', '2')
  ON DUPLICATE KEY UPDATE SS_ID=SS_ID;

INSERT INTO measurement (ID, TIMESTAMP, VALUES_ID, SENSOR_STATION_SS_ID) VALUES
    ('1', '2023-04-01 00:00:00', '1', '1'),
    ('2', '2023-04-15 00:00:00', '1', '1'),
    ('3', '2023-04-23 00:00:00', '2', '2'),
    ('4', '2023-05-02 00:00:00', '3', '2')
  ON DUPLICATE KEY UPDATE ID=ID;
