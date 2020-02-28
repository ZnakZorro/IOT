/* Voltomierz V2a 28.02.2020 */

#include <ESP8266WiFi.h>
#include <ESPAsyncTCP.h>
#include <ESPAsyncWebServer.h>
    #include <ESP8266WiFiMulti.h>   // Include the Wi-Fi-Multi library
    #include <ESP8266mDNS.h>        // Include the mDNS library
    #include <ESP8266HTTPClient.h>
#include <FS.h>
#include <Wire.h>
#include <SPI.h>
#include <U8g2lib.h>

char   buftt[16];
const char* PARAM_MESSAGE = "message";
const int ledPin = 2;
String ledState;
float podzial = 183;  // dla dodatkowy 250kE
int Volt = 0;
int Volty[50];
int licznik=0;

U8G2_SSD1306_128X32_UNIVISION_F_HW_I2C u8g2(U8G2_R0, /* reset=*/ 16, /* clock=*/ 5, /* data=*/ 4);

ESP8266WiFiMulti wifiMulti; 

// Create AsyncWebServer object on port 80
AsyncWebServer server(80);


void setFontSize(String txt) {
    int unsigned txtLong = txt.length();
    u8g2.setFontMode(0); 
    if      (txtLong>12){u8g2.setFont(u8g2_font_profont15_mr);} 
    else if (txtLong>9) {u8g2.setFont(u8g2_font_profont17_mr);} 
    else if (txtLong>6) {u8g2.setFont(u8g2_font_profont22_mr);} 
    else {               u8g2.setFont(u8g2_font_profont29_mr);}    
    /*Wybór fontu zaleznie od dlugosci 10,11,12,15,17,22,29 //_mr=krotki  _mf=pelny _tr=skrocony _mn=numery */
}
void printOLED(int x, int y, String txt) {
    setFontSize(txt);
    u8g2.firstPage();
    do {
      txt.toCharArray(buftt, 16);
      u8g2.drawStr(x,y,buftt);
    } while (u8g2.nextPage());   
}

// Replaces placeholder with LED state value
String processor(const String& var){
  Serial.println(var);
  return var;
}
 
void setup(){
      u8g2.begin();
      u8g2.clear();
      u8g2.setFontMode(0); // mode transparent

      // Serial port for debugging purposes
      Serial.begin(115200);
      Serial.println("\nVoltimeter...");
      pinMode(ledPin, OUTPUT);
    
    
      // Initialize SPIFFS
      if(!SPIFFS.begin()){
        Serial.println("An Error has occurred while mounting SPIFFS");
        return;
      }

      wifiMulti.addAP("", ""); 
      wifiMulti.addAP("", ""); 
      wifiMulti.addAP("", ""); 
     
      Serial.println("Connecting ...");
      int i = 0;
      while (wifiMulti.run() != WL_CONNECTED) {
          delay(500);
          printOLED(0,32," #"+String(i));
          Serial.println(i);
          i++;
      } 
        
      Serial.print("WiFi connected");  
      Serial.print("IP address: ");
      Serial.println(WiFi.localIP());
      printOLED(0,50,WiFi.localIP().toString());
      delay(2500);
  
  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/index.html", String(), false, processor);
  });
  server.on("/index.html", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/index.html", String(), false, processor);
  });
  server.on("/style.css", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/style.css", "text/css");
  });
  server.on("/script.js", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/script.js", "text/css");
  });
  server.on("/voltomierz.png", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/voltomierz.png", "image/png");
  });
  server.on("/webmanifest.json", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/webmanifest.json", "application/manifest+json");
  });
  server.on("/heap", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(200, "text/plain", String(ESP.getFreeHeap()));
  });

    // Send a GET request to <IP>/podzial?message=<message>
    server.on("/podzial", HTTP_GET, [] (AsyncWebServerRequest *request) {
        String message;
        if (request->hasParam(PARAM_MESSAGE)) {
            message = request->getParam(PARAM_MESSAGE)->value();
        } else {message = "no";}
        Serial.println(message);
        int faktor = message.toInt();
        podzial = float(faktor) /1000;
        Serial.println(podzial);
        request->send(200, "text/plain", message);
    });
  
  // Route to load /ADC
  server.on("/adc", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(200, "application/json", "["+ String(Volt)+"]"); 
  });
  

  // Start server
  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Origin", "*");
  server.begin();
  u8g2.setFont(u8g2_font_profont29_mr);
}

void printWykres() {
    u8g2.firstPage();
    do {
      float fVolt = float(Volt)/podzial;   //310;
      //Serial.println(fVolt);
        u8g2.setCursor(0,31);        
        u8g2.print(fVolt);
      for (int i=0; i<50; i++){
        int punkt = Volty[i]/32;
        u8g2.drawLine(78+i,31,78+i,31-punkt);
      }
    } while (u8g2.nextPage());   
}

void pomiarADC(){
    Volt = analogRead(A0);
    //Serial.println(Volt);
    memcpy(Volty, &Volty[1], sizeof(Volty) - sizeof(int));
    Volty[49] = Volt;
    printWykres();
}


long previousMillis = 0;    
long intervalADC = 500; // 500ms

void loop(){
      unsigned long currentMillis = millis();
      // ADC timing system
      if((currentMillis - previousMillis > intervalADC)) {
          previousMillis = currentMillis;   
          pomiarADC();
      }  
}
