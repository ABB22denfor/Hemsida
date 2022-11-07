
#ifndef ARDUINO_TEMPHUM_CLIENT_H
#define ARDUINO_TEMPHUM_CLIENT_H

bool push_sensor_values(const char streamPath[], float sensorTemp, float sensorHum, time_t epochTime);

bool get_sensor_values(float* sensorTemp, float* sensorHum, int* errorCode);

bool connect_local_wifi(const char wifiSSID[], const char wifiPasw[]);

bool setup_connect_dbase(const char streamPath[], const char dbaseHost[], const char dbaseAuth[]);

bool display_sensor_values(float sensorTemp, float sensorHum);

bool print_display_string(const char string[], int width, int height, uint16_t textColor, int textSize);

#endif
