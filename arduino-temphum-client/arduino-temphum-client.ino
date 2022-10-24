
// Includes the necessary headers for this project
#include "temphum-include-header.h"

// Declare variables for the temperature-humidity sensor and the Firebase database object
AM2320 THSensor;
FirebaseData fbaseData;
Adafruit_SSD1306 display(128, 64, &Wire, -1, 400000UL, 100000UL);

// The setup function connects to the local WIFI and setups communication with the Firebase database
void setup() {
  Serial.begin(BAUD_VALUE); // Allocates the Serial Monitor value
  Wire.begin(SENSOR_PIN1, SENSOR_PIN2); // Allocates the pins for the AM2320 sensor
  display.begin(SSD1306_SWITCHCAPVCC, DISPLAY_ADDR);
  WiFi.mode(WIFI_STA);

  // Tries to connect to the local WIFI using the WIFI SSID and Password
  if(!connect_local_wifi(WIFI_SSID, WIFI_PASW))
  {
    Serial.println("Error: Could not connect to local WIFI");
  }
  else Serial.println("Success! Connected to WIFI");
 
  // Tries to setup and connect to the Firebase Database
  if(!setup_connect_dbase(STREAM_PATH, DBASE_HOST, DBASE_AUTH))
  {
    Serial.println("Error: Could not setup and connect to database");
  }
}

// The loop function will execute continuously. Collect values and push them to the Firebase database
void loop() {
  float sensorTemp = 0.0f, sensorHum = 0.0f; int errorCode;

  // Collect temperature and humidity from the AM2320 sensor
  if(!get_sensor_values(&sensorTemp, &sensorHum, &errorCode))
  {
    // Prints out the error that occured when collecting values
    if(errorCode == 1) Serial.println("Error: Sensor is offline");
    if(errorCode == 2) Serial.println("Error: CRC validation failed");
  }

  const char timeString[] = "2022-10-20 14:05";

  Serial.print("SensorTemp: "); Serial.print(sensorTemp); 
  Serial.print("\tSensorHum: "); Serial.print(sensorHum); 
  Serial.print("\tTimeString: "); Serial.println(timeString);
  
  /*if(!display_sensor_values(sensorTemp, sensorHum))
  {
    Serial.println("Error: Could not display sensor values");
  }*/
  
  // Tries to push the temperature and humidity to the Firebase database
  if(!push_sensor_values(STREAM_PATH, sensorTemp, sensorHum, timeString))
  {
    // Prints out the error that occured when pushing the values
    Serial.println("Error" + fbaseData.errorReason());
  }
  delay(LOOP_DELAY);
}

bool display_sensor_values(float sensorTemp, float sensorHum)
{
  display.clearDisplay();

  display.setTextColor(TEXT_COLOR); display.setTextSize(TEXT_SIZE);
  display.setCursor(0, 0);

  display.print("TEMP:"); display.println(sensorTemp);
  display.print("HUM :"); display.println(sensorHum);

  display.display();
}

// Takes in the temperature and humidity and creates a JSON object that it pushes to the Firebase database
bool push_sensor_values(const char streamPath[], float sensorTemp, float sensorHum, const char timeString[])
{
  // Creates a JSON package and stores the temperature and the humidity
  FirebaseJson jsonPackage;
  if(!create_json_package(&jsonPackage, sensorTemp, sensorHum, timeString))
  {
    Serial.println("Error: Could not create json package"); 
    return false;
  }
  // Tries to push the JSON Package to the Firebase Databse
  return Firebase.pushJSON(fbaseData, streamPath, jsonPackage);
}

// Creates a JSON package and stores the temperature and the humidity
bool create_json_package(FirebaseJson* jsonPackage, float sensorTemp, float sensorHum, const char timeString[])
{
  (*jsonPackage).set("teperature", sensorTemp);
  (*jsonPackage).set("humidity", sensorHum);
  (*jsonPackage).set("time", timeString);

  return true;
}

// Collects temperature and humidity from the AM2320 sensor, stores them in pointers and return if successful
bool get_sensor_values(float* sensorTemp, float* sensorHum, int* errorCode)
{
  // Checks if the sensor is active and will measure temperature and humidity
  if(!THSensor.measure()) { *errorCode = THSensor.getErrorCode(); return false; }

  // Collect temperature and humidity and store the value at the pointers
  *sensorTemp = THSensor.getTemperature();
  *sensorHum = THSensor.getHumidity();

  return true;
}

// Tries to connect to local WIFI using WIFI SSID and Password, stores the local address at pointer
bool connect_local_wifi(const char wifiSSID[], const char wifiPasw[])
{
  if (WiFi.status() == WL_NO_SHIELD) 
  {
      Serial.println("Error: WiFi shield not present");
      return false;
  }
 
  WiFi.begin(wifiSSID, wifiPasw);
  
  for(int index = 0; WiFi.status() != WL_CONNECTED; index += 1)
  {
    Serial.print("Connecting to WIFI: "); Serial.println(index + 1);
    if(index >= CONNECT_TRIES) break; delay(WIFI_DELAY);
  }
  return (WiFi.status() == WL_CONNECTED);
}

// Tries to setupt Firebase Database communication and beginning stream
bool setup_connect_dbase(const char streamPath[], const char dbaseHost[], const char dbaseAuth[])
{
  Firebase.begin(dbaseHost, dbaseAuth);

  Firebase.reconnectWiFi(true);
  Firebase.setMaxRetry(fbaseData, 3);

  // Tries to begin the Firebase database stream
  return Firebase.beginStream(fbaseData, streamPath);
}
