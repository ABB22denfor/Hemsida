
#ifndef ARDUINO_TEMPHUM_CLIENT_H
#define ARDUINO_TEMPHUM_CLIENT_H

// Push temperature, humidity and epochTime to the Firebase database
bool push_sensor_values(const char streamPath[], float sensorTemp, float sensorHum, time_t epochTime);

// Collects temperature and humidity from the AM2320 sensor, stores potential errorCode
bool get_sensor_values(float* sensorTemp, float* sensorHum, int* errorCode);

// Connects to local WIFI using WIFI SSID and password, also checks for WIFI shield
bool connect_local_wifi(const char wifiSSID[], const char wifiPasw[]);

// Setup Firebase database communication with host and auth, and beginning stream
bool setup_connect_dbase(const char streamPath[], const char dbaseHost[], const char dbaseAuth[]);

// Display the temperature and humidity to the arduino display
bool display_sensor_values(float sensorTemp, float sensorHum);

// Print a formatted string to the arduino display at (width, height) with textColor and textSize
bool print_display_string(const char string[], int width, int height, uint16_t textColor, int textSize);

#endif
