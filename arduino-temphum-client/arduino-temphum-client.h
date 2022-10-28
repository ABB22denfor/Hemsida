
#ifndef ARDUINO_TEMPHUM_CLIENT_H
#define ARDUINO_TEMPHUM_CLIENT_H

bool push_sensor_values(const char streamPath[], float sensorTemp, float sensorHum, const char timeString[]);

bool create_json_package(FirebaseJson* jsonPackage, float sensorTemp, float sensorHum, const char timeString[]);

bool get_sensor_values(float* sensorTemp, float* sensorHum, int* errorCode);

bool connect_local_wifi(const char wifiSSID[], const char wifiPasw[]);

bool setup_connect_dbase(const char streamPath[], const char dbaseHost[], const char dbaseAuth[]);

bool display_sensor_values(float sensorTemp, float sensorHum);

#endif
