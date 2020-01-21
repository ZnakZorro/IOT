/*
  Rui Santos
  Complete project details at https://RandomNerdTutorials.com
  
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files.
  
  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.
*/

// Import required libraries
#include <ESP8266WiFi.h>
#include <ESPAsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <FS.h>
#include <Wire.h>

int piny[] = {2,3,4,5,12,13,14,15,16};
const int ledPin = LED_BUILTIN;
String ledState;

AsyncWebServer server(80);


// Replaces placeholder with LED state value
String processor(const String& var){
  Serial.println(var);
  if(var == "STATE"){
    if(digitalRead(ledPin)){
      ledState = "ON";
    }
    else{
      ledState = "OFF";
    }
    Serial.print(ledState);
    return ledState;
  }
}
 
void setup(){
  // Serial port for debugging purposes
  Serial.begin(115200);
  Serial.println(ledPin);
  Serial.println(LED_BUILTIN);
  pinMode(ledPin, OUTPUT);


  // Initialize SPIFFS
  if(!SPIFFS.begin()){Serial.println("An Error has occurred while mounting SPIFFS"); return; }

String debugLogData;
String r;
File file2 = SPIFFS.open("/wifi.txt","r");
    if(!file2){Serial.println("Failed to open file for reading");return;}
String odczyt[4];
    int i=0;
    while (file2.available()){
      if (i<4) {odczyt[i]= file2.readString();}
      i++;
    }
      Serial.println("===="); 
      Serial.println(odczyt[0]); 
      Serial.println(odczyt[1]); 
      Serial.println(odczyt[2]); 
      Serial.println(odczyt[3]); 

  // Connect to Wi-Fi
  int pentla=0;
  WiFi.begin(odczyt[0], odczyt[1]);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print("WiFi... "); Serial.println(pentla);
    pentla++;
    if (pentla>10) WiFi.begin(odczyt[2],odczyt[3]);
  }
  Serial.println(WiFi.localIP());

  // Route for root / web page
  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/index.html", String(), false, processor);
  });
  server.on("/style.css", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/style.css", "text/css");
  });
  server.on("/script.js", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/script.js", "application/javascript");
  });
  server.on("/lamp200.png", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/lamp200.png", "image/png");
  });
  server.on("/webmanifest.json", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/webmanifest.json", "application/manifest+json");
  });
  server.on("/what", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(200, "application/json", "{\"state\":\""+ledState+"\",\"pin\":\""+ledPin+"\"}");
  });

          


        server.on("/pin", HTTP_GET, [] (AsyncWebServerRequest *request) {
          String id;
          int    pin;
          String state;
          bool   stan;
          
          Serial.print("/pin ");
          if (request->hasParam("id"))   {id    = request->getParam("id")->value();}
          if (request->hasParam("state")){state = request->getParam("state")->value();}
          if (id && state){
            pin = id.toInt();
            stan = state == "1";
            //Serial.printf("pin=%s stan=%s", id,state);
           
          
            if (piny[0]==pin  || piny[1]==pin  || piny[2]==pin){
               Serial.println(" % is in piny");
               digitalWrite(pin,stan);
               //digitalWrite(id.toInt(),state == "1");
            } else Serial.println("verboten");
          }
        
          request->send(200, "application/json", "{\"state\":\""+state+"\",\"pin\":\""+id+"\"}"); 
        });






  // Route to set GPIO to HIGH
  server.on("/on", HTTP_GET, [](AsyncWebServerRequest *request){
    digitalWrite(ledPin, HIGH);    
    request->send(SPIFFS, "/index.html", String(), false, processor);
  });
  
  // Route to set GPIO to LOW
  server.on("/off", HTTP_GET, [](AsyncWebServerRequest *request){
    digitalWrite(ledPin, LOW);    
    request->send(SPIFFS, "/index.html", String(), false, processor);
  });

  // Start server
   DefaultHeaders::Instance().addHeader("Access-Control-Allow-Origin", "*");
   server.begin();
}
 
void loop(){
  
}
