
#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>

#include <SPI.h>
#include <U8g2lib.h>

U8G2_SSD1306_128X32_UNIVISION_F_HW_I2C u8g2(U8G2_R0, /* reset=*/ 16, /* clock=*/ 5, /* data=*/ 4);
char buf1[16];
char buf2[16];
char buf3[16];
char *text = "V1=";
String t1="";
String t2="";
String t3="";
String payload = "_______________";
char   buftt[16];
String tt="";

byte bajt = 0;

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
                    byte moda2 = bajt % 2;
                    byte moda4 = bajt % 4;
                    bajt++;
                    Serial.println(bajt);
                    Serial.println(moda2);
                    Serial.println(moda4);
                    int podzial = payload.indexOf("\n");
                    int dlugosc = payload.length();
                    Serial.println(podzial);
                    Serial.println(dlugosc);
                    t1 = payload.substring(0,podzial);
                    t2 = payload.substring(podzial+1);
                    //String sym = t2.substring(t2.length()-1); // ostatnia litera symbolem
                    //t2 = t2.substring(0,t2.length()-1);       // usuwamy ostania litere
                    //Serial.println(t1);
                    //Serial.println(t2);
                    //Serial.println(sym);
                    
                    u8g2.setFont(u8g2_font_profont29_mf);// 10,11,12,15,17,22,29

                    String sym = "";
                    if (moda2==0) {
                        sym = t1.substring(t1.length()-1); // ostatnia litera symbolem 
                        t1 = t1.substring(0,t1.length()-1);       // usuwamy ostania litere
                        t1.toCharArray(buftt, 16);
                    }
                    if (moda2==1) {
                        sym = t2.substring(t2.length()-1); // ostatnia litera symbolem 
                        t2 = t2.substring(0,t2.length()-1);       // usuwamy ostania litere
                        t2.toCharArray(buftt, 16);
                    }
                    u8g2.drawUTF8(0, 32, buftt); 
                   /*
                    u8g2.setFont(u8g2_font_profont17_mf);// 10,11,12,15,17,22,29
                    t1.toCharArray(buftt, 16);
                    u8g2.drawUTF8(0, 16, buftt); 
                    
                    t2.toCharArray(buftt, 16);
                    u8g2.drawUTF8(0, 32, buftt); 
                    */
                        u8g2.setFont(u8g2_font_open_iconic_weather_4x_t); // 4x=32px  2x=16px
                        sym.toCharArray(buftt, 16);
                        u8g2.drawUTF8(96, 32, buftt); 
                                          
                  } while ( u8g2.nextPage() );
                  /*OLED*/
}

void server() {
    printOLED("Update");
    if ((WiFiMulti.run() == WL_CONNECTED)) {
      WiFiClient client;
      HTTPClient http;
      //Serial.print("[HTTP] begin...\n");
      printOLED("[HTTP]...");
      if (http.begin(client, "http://zszczech.zut.edu.pl/e/oled.php")) { 
        //Serial.print("[HTTP] GET...\n");
        printOLED("[HTTP] GET...");
        int httpCode = http.GET();
        if (httpCode > 0) {
            //Serial.printf("[HTTP] GET... code: %d\n", httpCode);
            printOLED(itoa(httpCode, buftt, 10));
            if (httpCode == HTTP_CODE_OK || httpCode == HTTP_CODE_MOVED_PERMANENTLY) {
                payload = http.getString();
                oleOLED(payload);
            }
        } else {printOLED("Error"); Serial.printf("[HTTP] GET... failed, error: %s\n", http.errorToString(httpCode).c_str()); }
        http.end();
      } else {printOLED("Unable to connect"); Serial.printf("[HTTP} Unable to connect\n");}
      
    } // if connected 
}

long intervalServer = 900*1000; // 15 minut
long previousServerMillis = 0;    

long intervalOled = 3*1000; // 3 se
long previousOledMillis = 0;    


void loop() {
  unsigned long currentMillis = millis();
  
  if(currentMillis - previousOledMillis > intervalOled) {
      previousOledMillis = currentMillis;   
      Serial.println("OLED=1");
      oleOLED(payload);
  }
  
  if(currentMillis - previousServerMillis > intervalServer || previousServerMillis == 0) {
      previousServerMillis = currentMillis;   
      Serial.println("server=");
      printOLED("Server=900");
      server();
  }

    // LOOP version
    //server();
    //delay(60000*15);
}
