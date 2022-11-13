
// Includes the necessary headers for this project
#include "temphum-include-header.h"

AM2320 THSensor; // Declares THSensor to communicate with the AM2320 sensor

FirebaseData fbaseData; // Declare fbaseData to communicate with the Firebase databse

// Declare display object to access the arduino display
Adafruit_SSD1306 display(DISPLAY_WIDTH, DISPLAY_HEIGHT, &Wire, -1, 400000UL, 100000UL);

// Declare timeClient object to communicate with the ntp server
WiFiUDP ntpUDP; NTPClient timeClient(ntpUDP, "pool.ntp.org");

// Setup connects to WIFI, syncs with NTP and connects to Firebase database
void setup() {
  Serial.begin(BAUD_VALUE); // Allocates the Serial Monitor value
  Wire.begin(SENSOR_PIN1, SENSOR_PIN2); // Allocates the pins for the AM2320 sensor
  display.begin(SSD1306_SWITCHCAPVCC, DISPLAY_ADDR); // Allocates the display address

  print_display_string("CONNECT\nWIFI\n", 0, 0, TEXT_COLOR, TEXT_SIZE);

  // Tries to connect to the local WIFI using the WIFI SSID and Password
  if(!connect_local_wifi(WIFI_SSID, WIFI_PASW))
  {
    Serial.println("Error: Could not connect to local WIFI");
  }
  else Serial.println("Success! Connected to WIFI");

  // Begin the sync with the NTP server
  timeClient.begin(); timeClient.setTimeOffset(0);

  print_display_string("CONNECT\nFBASE\n", 0, 0, TEXT_COLOR, TEXT_SIZE);

  // Tries to setup and connect to the Firebase Database
  if(!setup_connect_dbase(STREAM_PATH, DBASE_HOST, DBASE_AUTH))
  {
    Serial.println("Error: Could not setup and connect to database");
  }
  else Serial.println("Success! Setup and connected to Firebase!");
}

// Loop collects values from sensor, display them and push them to the database
void loop()
{
  // Update the NTP epoch time and store it in epochTime
  timeClient.update(); time_t epochTime = timeClient.getEpochTime();

  float sensorTemp = 0.0f, sensorHum = 0.0f; int errorCode;

  // Collect temperature and humidity from the AM2320 sensor
  if(!get_sensor_values(&sensorTemp, &sensorHum, &errorCode))
  {
    // Prints out the error that occured when collecting values
    if(errorCode == 1) Serial.println("Error: Sensor is offline");
    if(errorCode == 2) Serial.println("Error: CRC validation failed");
  }
  else Serial.println("Collected temperature and humidity from sensor");

  Serial.println("EpochTime: " + String(epochTime) + "\tSensorTemp: " + String(sensorTemp) + "\tSensorHum: " + String(sensorHum));

  // Displays the temperature and humidity on the arduino screen
  if(!display_sensor_values(sensorTemp, sensorHum))
  {
    Serial.println("Error: Could not display sensor values");
  }
  else Serial.println("Displayed temperature and humidity on screen");

  // Tries to push the epochTime, temperature and humidity to the Firebase database
  if(!push_sensor_values(STREAM_PATH, sensorTemp, sensorHum, epochTime))
  {
    Serial.println("Error: " + fbaseData.errorReason());
  }
  else Serial.println("Success! Pushed sensor values to Firebase");

  delay(LOOP_DELAY); // This delay determines how much data is collected
}

// Display the temperature and humidity to the arduino display
bool display_sensor_values(float sensorTemp, float sensorHum)
{
  char string[128]; // Format string to display on the screen
  if(!sprintf(string, "TEMP: %.1f\nHUM: %.1f\n", sensorTemp, sensorHum)) return false;

  print_display_string(string, 0, 0, TEXT_COLOR, TEXT_SIZE); return true;
}

// Push temperature, humidity and epochTime to the Firebase database
bool push_sensor_values(const char streamPath[], float sensorTemp, float sensorHum, time_t epochTime)
{
  char tempPath[128], humPath[128], timePath[128];

  // Creates database variable paths to temperature, humidity and epochTime
  if(!sprintf(tempPath, "%s/%lld/temperature", streamPath, epochTime) ||
    !sprintf(humPath, "%s/%lld/humidity", streamPath, epochTime) ||
    !sprintf(timePath, "%s/%lld/epochTime", streamPath, epochTime)) return false;

  // Allocates the values to the databse (pushing the values)
  return (Firebase.setFloat(fbaseData, tempPath, sensorTemp) &&
    Firebase.setFloat(fbaseData, humPath, sensorHum) &&
    Firebase.setInt(fbaseData, timePath, epochTime));
}

// Collects temperature and humidity from the AM2320 sensor, stores potential errorCode
bool get_sensor_values(float* sensorTemp, float* sensorHum, int* errorCode)
{
  // Checks if the sensor is active and will measure temperature and humidity
  if(!THSensor.measure())
  { *errorCode = THSensor.getErrorCode(); return false; }

  // Collect temperature and humidity and store the value at the pointers
  *sensorTemp = THSensor.getTemperature(); *sensorHum = THSensor.getHumidity();

  return true;
}

// Connects to local WIFI using WIFI SSID and password, also checks for WIFI shield
bool connect_local_wifi(const char wifiSSID[], const char wifiPasw[])
{
  WiFi.mode(WIFI_STA);

  if (WiFi.status() == WL_NO_SHIELD)
  {
      Serial.println("Error: WiFi shield not present");
      return false;
  }

  WiFi.begin(wifiSSID, wifiPasw); // Begins asking for the WIFI connection

  // Checks if the connection is sucessful every WIFI_DELAY milliseconds
  for(int index = 0; (index >= CONNECT_TRIES && WiFi.status() != WL_CONNECTED); index += 1)
  {
    Serial.print("Connecting to WIFI: "); Serial.println(index + 1);

    delay(WIFI_DELAY);
  }
  return (WiFi.status() == WL_CONNECTED); // Returns if the connection was sucessful or not
}

// Setup Firebase database communication with host and auth, and beginning stream
bool setup_connect_dbase(const char streamPath[], const char dbaseHost[], const char dbaseAuth[])
{
  Firebase.begin(dbaseHost, dbaseAuth); // Begins the Firebase communication

  Firebase.reconnectWiFi(true); Firebase.setMaxRetry(fbaseData, DBASE_RETRIES);

  return Firebase.beginStream(fbaseData, streamPath);
}

// Print a formatted string to the arduino display at (width, height) with textColor and textSize
bool print_display_string(const char string[], int width, int height, uint16_t textColor, int textSize)
{
  // Clears display and moves the cursor to start at (width, height)
  display.clearDisplay(); display.setCursor(width, height);

  // Allocates the text color and size
  display.setTextColor(TEXT_COLOR); display.setTextSize(TEXT_SIZE);

  // Prints the string, updates the display buffer and return successful
  display.print(string); display.display(); return true;
}
