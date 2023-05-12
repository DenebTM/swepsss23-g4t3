INSERT INTO userx (FIRST_NAME, LAST_NAME, PASSWORD, USERNAME, CREATE_DATE, EMAIL, USER_ROLE) VALUES('Admin', 'Istrator',    '$2a$12$7EtEJP.p94px6dTVNvMPeOK61pgCNyqcA8X9uetAyR6ohgCmGOcXi', 'admin', '2016-01-01 00:00:00', 'admin@example.at', 'ADMIN');
INSERT INTO userx (FIRST_NAME, LAST_NAME, PASSWORD, USERNAME, CREATE_DATE, EMAIL, USER_ROLE) VALUES('Susi',  'Gruen',       '$2a$12$maZ21vfYESvLGjKiyuYXBOREyo2w.y61hc1NSC6BIBGJKMYFywvla', 'susi', '2016-01-01 00:00:00', 'susi@example.at', 'GARDENER');
INSERT INTO userx (FIRST_NAME, LAST_NAME, PASSWORD, USERNAME, CREATE_DATE, EMAIL, USER_ROLE) VALUES('Max',   'Mustermann',  '$2a$12$5111Zqs2OXpalPoUfWdbhO3nGJGBc9/tsWtGGrTYkgOn8znsemlUS', 'max', '2016-01-01 00:00:00', 'max@example.at', 'USER');
INSERT INTO userx (FIRST_NAME, LAST_NAME, PASSWORD, USERNAME, CREATE_DATE, EMAIL, USER_ROLE) VALUES('Elvis', 'The King',    '$2a$12$qxzS0FvYminkczt76S813OvrmYMpfRh/OcmRi2Qh9AlpUbv6aRiiO', 'elvis', '2016-01-01 00:00:00', 'elvis@example.at', 'ADMIN');
INSERT INTO userx (FIRST_NAME, LAST_NAME, PASSWORD, USERNAME, CREATE_DATE, EMAIL, USER_ROLE) VALUES('Hans',  'G',           '$2a$12$mUtI13l8bq9vZ0Ogme7gqO0ZaP7mfyw4OY6/./jWBkeyv6sQCW2FK', 'hans', '2016-01-01 00:00:00', 'hans@example.at', 'GARDENER');
INSERT INTO userx (FIRST_NAME, LAST_NAME, PASSWORD, USERNAME, CREATE_DATE, EMAIL, USER_ROLE) VALUES('Peter', 'G',           '$2a$12$IQmnsgEXkQ8XxqIPQqdBqOS/T/4wi3P8iMkc56fhPVZQpqaJ5UVQC', 'peter', '2016-01-01 00:00:00', 'peter@example.at', 'GARDENER');
INSERT INTO userx (FIRST_NAME, LAST_NAME, PASSWORD, USERNAME, CREATE_DATE, EMAIL, USER_ROLE) VALUES('Franz', 'g',           '$2a$12$fWwsyvehfVMvcvegf2qMe.pmE5I/bnpJOn063Za9j5bXnldx5g33q', 'franz', '2016-01-01 00:00:00', 'franz@example.at', 'GARDENER');

INSERT INTO access_point (AP_NAME, LAST_UPDATE, SERVER_ADDRESS, AP_STATUS) VALUES ('AP 1', '2016-01-01 00:00:00', '192.168.0.101', 'ONLINE');

insert into sensor_values (VALUES_ID, AIR_PRESSURE, AIR_QUALITY, HUMIDITY, LIGHT_INTENSITY, SOIL_MOISTURE, TEMPERATURE) VALUES ('1', '20', '20', '20', '20', '20', '20');
insert into sensor_values (VALUES_ID, AIR_PRESSURE, AIR_QUALITY, HUMIDITY, LIGHT_INTENSITY, SOIL_MOISTURE, TEMPERATURE) VALUES ('2', '0', '0', '0', '0', '0', '0');
insert into sensor_values (VALUES_ID, AIR_PRESSURE, AIR_QUALITY, HUMIDITY, LIGHT_INTENSITY, SOIL_MOISTURE, TEMPERATURE) VALUES ('3', '30', '30', '30', '30', '30', '30');

insert into sensor_station (SS_ID, STATUS, AGGREGATION_PERIOD, AP_NAME, UPPER_VALUES_ID, LOWER_VALUES_ID) VALUES ('1', 'OK', '30', 'AP 1', '1', '2');
insert into sensor_station (SS_ID, STATUS, AGGREGATION_PERIOD, AP_NAME, UPPER_VALUES_ID, LOWER_VALUES_ID) VALUES ('2', 'OK', '60', 'AP 1', '3', '2');

insert into measurement(ID, TIMESTAMP, VALUES_ID, SENSOR_STATION_SS_ID) VALUES ('1', '2023-04-01 00:00:00', '1', '1');
insert into measurement(ID, TIMESTAMP, VALUES_ID, SENSOR_STATION_SS_ID) VALUES ('2', '2023-04-15 00:00:00', '1', '1');
insert into measurement(ID, TIMESTAMP, VALUES_ID, SENSOR_STATION_SS_ID) VALUES ('3', '2023-04-23 00:00:00', '2', '2');
insert into measurement(ID, TIMESTAMP, VALUES_ID, SENSOR_STATION_SS_ID) VALUES ('4', '2023-05-02 00:00:00', '3', '2');

insert into gardener_ss (USERNAME, SS_ID) VALUES ('susi', '1');
INSERT INTO gardener_ss (USERNAME, SS_ID) VALUES ('hans', '1');
INSERT INTO gardener_ss (USERNAME, SS_ID) VALUES ('peter', '1');
INSERT INTO gardener_ss (USERNAME, SS_ID) VALUES ('franz', '2');

#Timestamp is May 1st, zero hour
INSERT INTO logging_event (timestmp, formatted_message, logger_name, level_string, event_id, caller_method, caller_class, caller_filename, caller_line) values ('1682892000000', 'first log', 'first logger', 'INFO', '1L', null, null, null, null);
#Timestamp is May 2nd, zero hour
INSERT INTO logging_event (timestmp, formatted_message, logger_name, level_string, event_id, caller_method, caller_class, caller_filename, caller_line) values ('1682978400000L', 'second log', 'second logger', 'WARN', '2L', null, null, null, null);
#Timestamp is May 3rd, zero hour
INSERT INTO logging_event (timestmp, formatted_message, logger_name, level_string, event_id, caller_method, caller_class, caller_filename, caller_line) values ('1683064800000L', 'third log', 'third logger', 'ERROR', '3L', null, null, null, null);
#Timestamp is May 4th, zero hour
INSERT INTO logging_event (timestmp, formatted_message, logger_name, level_string, event_id, caller_method, caller_class, caller_filename, caller_line) values ('1683151200000L', 'fourth log', 'fourth logger', 'INFO', '4L', null, null, null, null);
