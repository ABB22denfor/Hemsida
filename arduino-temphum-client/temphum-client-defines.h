
#ifndef TEMPHUM_CLIENT_DEFINES_H
#define TEMPHUM_CLIENT_DEFINES_H

const char DBASE_HOST[] = "https://kylskap-c5f3b-default-rtdb.europe-west1.firebasedatabase.app";
const char DBASE_AUTH[] = "f17uoDIiCqTEs929Ak1TnkMK7fNBYV3LEFoUbDXW";

const char WIFI_SSID[] = "ABBgym_2.4";
const char WIFI_PASW[] = "mittwifiarsabra";

const unsigned int CONNECT_TRIES = 100;

const char STREAM_PATH[] = "/stream";

const unsigned int LOOP_DELAY = 1000;
const unsigned int WIFI_DELAY = 300;

const unsigned int BAUD_VALUE = 9600;

const unsigned int SENSOR_PIN1 = 14;
const unsigned int SENSOR_PIN2 = 12;

const int DISPLAY_ADDR = 0x3C;

const unsigned int TEXT_SIZE = 2;
const uint16_t TEXT_COLOR = WHITE;

#endif
