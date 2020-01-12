
#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>

#include <Event.h>
#include <Timer.h>

Timer t;

#include <SPI.h>
#include <U8g2lib.h>

U8G2_SSD1306_128X32_UNIVISION_F_HW_I2C u8g2(U8G2_R0, /* reset=*/ 16, /* clock=*/ 5, /* data=*/ 4);
char buf1[16];
char buf2[16];
char *text = "V1=";
String t1="";
String t2="";

char buftt[16];
String tt="";

long previousMillis = 0;
long interval = 1000;     
long numer = 0;     


ESP8266WiFiMulti WiFiMulti;




void setup() {
u8g2.begin();
  Serial.begin(115200);
  // Serial.setDebugOutput(true);

  Serial.println();
  Serial.println();
  Serial.println();

  for (uint8_t t = 4; t > 0; t--) {
    Serial.printf("[SETUP] WAIT %d...\n", t);
    t1 = "WiFi:";
    t1.concat(t);
    printOLED(t1);
    Serial.flush();
    delay(1000);
  }

  WiFi.mode(WIFI_STA);
  WiFiMulti.addAP("znakzorro_plus", "niemieckiewino");
  t.every(1000, intervalOLED);
}

void printOLED(String txt) {
  Serial.println(txt);
  u8g2.firstPage();
  do {
    u8g2.setFont(u8g2_font_profont29_mf);
    txt.toCharArray(buftt, 16);
    u8g2.drawStr(0,32,buftt);
  } while (u8g2.nextPage());   
}

void oleOLED(String payload) {
          Serial.println(payload);
                  /*OLED*/
                 u8g2.firstPage();
                  do {
                    int podzial = payload.indexOf("\n");
                    int dlugosc = payload.length();
                    Serial.println(podzial);
                    Serial.println(dlugosc);
                    t1 = payload.substring(0,podzial);
                    t2 = payload.substring(podzial+1);
                    Serial.println(t1);
                    Serial.println(t2);
                    
                    u8g2.setFont(u8g2_font_profont15_mf);// 10,11,12,15,17,22,29
                    t1.toCharArray(buftt, 16);
                    u8g2.drawUTF8(0, 16, buftt); 
                    t2.toCharArray(buftt, 16);
                    u8g2.drawUTF8(0, 32, buftt); 
                    //u8g2.setCursor(0, 16);
                    //u8g2.print(t1);
                    //u8g2.setCursor(0, 32);
                    //u8g2.print(t2);
                        u8g2.setFont(u8g2_font_unifont_t_symbols);
                        u8g2.drawUTF8(100, 20, "☃");                    
                  } while ( u8g2.nextPage() );
                  /*OLED*/
  
}


void loop() {
  printOLED("Start");
  // wait for WiFi connection
  if ((WiFiMulti.run() == WL_CONNECTED)) {

    WiFiClient client;

    HTTPClient http;

    Serial.print("[HTTP] begin...\n");
    if (http.begin(client, "http://zszczech.zut.edu.pl/e/oled.php")) { 
      Serial.print("[HTTP] GET...\n");
      // start connection and send HTTP header
      int httpCode = http.GET();

      // httpCode will be negative on error
      if (httpCode > 0) {
        // HTTP header has been send and Server response header has been handled
        Serial.printf("[HTTP] GET... code: %d\n", httpCode);

        // file found at server
        if (httpCode == HTTP_CODE_OK || httpCode == HTTP_CODE_MOVED_PERMANENTLY) {
          String payload = http.getString();
          intervalOLED();
          oleOLED(payload);
        }
      } else {
        Serial.printf("[HTTP] GET... failed, error: %s\n", http.errorToString(httpCode).c_str());
      }

      http.end();
    } else {
      Serial.printf("[HTTP} Unable to connect\n");
    }
    
  }
  t.update();
  delay(60000*15);
}

void intervalOLED(){
  unsigned long currentMillis = millis();
  if(currentMillis - previousMillis > interval) {
    previousMillis = currentMillis;   
    Serial.println("numer=");
    Serial.println(numer);
    numer++;
    if (numer>1) numer=0;
  }
  //delay(10);
  //intervalOLED(payload);
}
