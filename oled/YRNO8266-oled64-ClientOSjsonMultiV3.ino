/*2020.02.21 wi*/
#include <Arduino.h>
#include <ESP8266WiFi.h>        // Include the Wi-Fi library
#include <ESP8266WiFiMulti.h>   // Include the Wi-Fi-Multi library
#include <ESP8266mDNS.h>        // Include the mDNS library
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <SPI.h>
#include <U8g2lib.h>
#include <ArduinoJson.h>    //https://github.com/bblanchon/ArduinoJson

StaticJsonDocument<512> doc;
ESP8266WiFiMulti wifiMulti; 

#define width8 16
#define height8 16
#define width16 16
#define height16 16
static unsigned char kropla16_bits[] = { 0x80, 0x00, 0x80, 0x00, 0xc0, 0x01, 0xc0, 0x01, 0xe0, 0x03, 0xe0, 0x03, 0xf0, 0x07, 0xf0, 0x07, 0xf8, 0x0f, 0xf8, 0x0f, 0xfc, 0x1f, 0xfc, 0x1f, 0xfc, 0x1f, 0xf8, 0x0f, 0xf0, 0x07, 0xc0, 0x01 };

//U8G2_SSD1306_128X32_UNIVISION_F_HW_I2C u8g2(U8G2_R0, /* reset=*/ 16, /* clock=*/ 5, /* data=*/ 4);
//U8G2_SSD1306_128X32_UNIVISION_F_HW_I2C u8g2(U8G2_R0, /* reset=*/ 16, /* clock=*/ 5, /* data=*/ 4);
U8G2_SSD1306_128X64_NONAME_F_HW_I2C u8g2(U8G2_R0,U8X8_PIN_NONE,SCL,SDA); // 255/4/4

int unsigned deszcze[4];
int unsigned wiatry[4];
int unsigned cisnienia[4];
String symbole[4];
String linie[4];

char   buftt[16];
String txt  = "";
byte   bajt = 0;

void setup() {
      u8g2.begin();
      u8g2.setFontMode(0); // mode transparent
      Serial.begin(115200);
      // Serial.setDebugOutput(true);
      
      wifiMulti.addAP("", ""); 
      wifiMulti.addAP("", ""); 
      wifiMulti.addAP("", ""); 
     
      Serial.println("Connecting ...");
      int i = 0;
      while (wifiMulti.run() != WL_CONNECTED) {
        delay(500);
        printOLED(0,32," #"+String(i));
        Serial.print(++i); Serial.print(' ');
      } 
        Serial.println("");
        Serial.println("WiFi connected");
        Serial.println("IP address: ");
        printOLED(0,50,WiFi.localIP().toString());
       delay(2500);
}

String dajZnak(String t){
    return ((t.toInt()<1) ? "" : "+");
}

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
    //Serial.println(txt);
    setFontSize(txt);
    u8g2.firstPage();
    do {
      txt.toCharArray(buftt, 16);
      u8g2.drawUTF8(x,y,buftt);
    } while (u8g2.nextPage());   
}



void parseJsonSingle(int nr){
    byte nrr=nr-1;
  //Serial.println("parseJsonSingle---");
    if (nr==1){
        String t = doc["t1"]; if(t=="null") {t="?";}
        String d = doc["d1"]; if(d=="null") {d="0";}
        String s = doc["s1"]; if(s=="null") {s="A";}
        String w = doc["w1"]; if(w=="null") {w="0";}
        String c = doc["c1"]; if(c=="null") {c="0";}
        linie[nrr]   = dajZnak(t)+t;
        symbole[nrr]   = s;
        deszcze[nrr]   = d.toInt();
        wiatry[nrr]    = w.toInt();
        cisnienia[nrr] = c.toInt();
    }
    if (nr==2){ 
        String t = doc["t2"]; if(t=="null") {t="?";}
        String d = doc["d2"]; if(d=="null") {d="0";}
        String s = doc["s2"]; if(s=="null") {s="A";}
        String w = doc["w2"]; if(w=="null") {w="0";}
        String c = doc["c2"]; if(c=="null") {c="0";}
        linie[nrr]   = dajZnak(t)+t;
        symbole[nrr]   = s;
        deszcze[nrr]   = d.toInt();
        wiatry[nrr]    = w.toInt();
        cisnienia[nrr] = c.toInt();
    }
    if (nr==3){ 
        String t = doc["t3"]; if(t=="null") {t="?";}
        String d = doc["d3"]; if(d=="null") {d="0";}
        String s = doc["s3"]; if(s=="null") {s="A";}
        String w = doc["w3"]; if(w=="null") {w="0";}
        String c = doc["c3"]; if(c=="null") {c="0";}
        linie[nrr]   = dajZnak(t)+t;
        symbole[nrr]   = s;
        deszcze[nrr]   = d.toInt();
        wiatry[nrr]    = w.toInt();
        cisnienia[nrr] = c.toInt();
    }
    if (nr==4){ 
        String t = doc["t4"]; if(t=="null") {t="?";}
        String d = doc["d4"]; if(d=="null") {d="0";}
        String s = doc["s4"]; if(s=="null") {s="A";}
        String w = doc["w4"]; if(w=="null") {w="0";}
        String c = doc["c4"]; if(c=="null") {c="0";}
        linie[nrr]   = dajZnak(t)+t;
        symbole[nrr]   = s;
        deszcze[nrr]   = d.toInt();
        wiatry[nrr]    = w.toInt();
        cisnienia[nrr] = c.toInt();
    }
}

void YRNOparseJson(){
    for (int i=1;i<5;i++) {
       parseJsonSingle(i);
    }
}


void olejOLED(){
        byte moda = bajt % 4;
        bajt++;            
        String symbolIcon      = symbole[moda]; 
        int unsigned deszcz    = deszcze[moda];
        int unsigned wiatr     = wiatry[moda];
        int unsigned cisnienie = cisnienia[moda]; 
        txt                    = linie[moda];

           // preliczenie na osX
           wiatr = wiatr * 3;
           if (wiatr > 60) wiatr = 60;
           cisnienie = ((cisnienie - 1013) + 30);
           if (cisnienie > 60) cisnienie = 60;
           //Serial.print("wiatr=");Serial.print(wiatr); Serial.print("   cisni=");Serial.print(cisnienie); Serial.println();
            
       u8g2.firstPage();
        do {
          /*Wybór fontu zaleznie od dlugosci 10,11,12,15,17,22,29 //_mr=krotki  _mf=pelny _tr=skrocony _mn=numery */
             u8g2.setFontMode(0);
             setFontSize(txt);
             txt.toCharArray(buftt, 16);
             u8g2.drawUTF8(0, 32, buftt);

            // print symbol
            u8g2.setFont(u8g2_font_open_iconic_weather_4x_t); // 4x=32px  2x=16px
            symbolIcon.toCharArray(buftt, 16);
            u8g2.drawUTF8(78, 32, buftt); 

           if (deszcz==1) {u8g2.drawXBM(114, 2, width16, height16, kropla16_bits);}
           if (deszcz==2) {u8g2.drawXBM(114, 6, width16, height16, kropla16_bits);}
           if (deszcz==3) {u8g2.drawXBM(114,10, width16, height16, kropla16_bits);}
           if (deszcz>3)  {u8g2.drawXBM(114,16, width16, height16, kropla16_bits);}
            
            // test drawBox
           u8g2.drawBox(wiatr,        52, 3, 10);  // kreska wiatr
           u8g2.drawBox(cisnienie+67, 52, 3, 10);  // kreska cisnienie

            u8g2.drawBox(0,  58, 60, 1);  // bar wiatr
            u8g2.drawBox(67, 58, 60, 1);  // bar cisnienie
          
          // kreski godzin
          int xm = 1 << moda;
          for (int x=0; x<xm; x++){     
             u8g2.drawBox(x*16, 38, 12, 1);
          }
        } while ( u8g2.nextPage() );
}


void server() {
    printOLED(0,32,"Update");
    Serial.print("wifiMulti.run()=");Serial.println(wifiMulti.run());  //0=not conect
    if ((wifiMulti.run() == WL_CONNECTED)) {
      WiFiClient client;
      HTTPClient http;
      printOLED(0,32," HTTP ...");
      if (http.begin(client, "http://zszczech.zut.edu.pl/e/oled.json.php")) { 
        printOLED(0,32," GET ...");
        int httpCode = http.GET();
        //Serial.printf("[HTTP] GET... code: %d\n", httpCode);
        if (httpCode > 0) {
            //Serial.printf("[HTTP] GET... code: %d\n", httpCode);
            printOLED(0,32,itoa(httpCode, buftt, 10));
            if (httpCode == HTTP_CODE_OK || httpCode == HTTP_CODE_MOVED_PERMANENTLY) {
                String payload = http.getString();
                Serial.println(payload);
                DeserializationError error = deserializeJson(doc, payload);
                if (error) {
                  Serial.println(error.c_str());
                } else {
                   //parseJson();
                   YRNOparseJson();
                   olejOLED();
                }
            }
        } else {printOLED(0,32,"Error"); Serial.printf("[HTTP] GET... failed, error: %s\n", http.errorToString(httpCode).c_str()); }
        http.end();
      } else {printOLED(0,32,"Unable to connect"); Serial.printf("[HTTP} Unable to connect\n");}
      
    } // if connected 
}


long intervalOled = 3*777; // ~3 sek
long previousOledMillis = 0;    

long intervalServer = 3*900*1000; // 15 minut
long previousServerMillis = 0;    

void loop() {
  unsigned long currentMillis = millis();

  // OLED timing system
  if(currentMillis - previousOledMillis > intervalOled  && previousServerMillis > 0) {
      previousOledMillis = currentMillis;   
      //Serial.print(currentMillis);Serial.println(" intervalOled===");
      olejOLED();
  }

   // Server timing system
  if(currentMillis - previousServerMillis > intervalServer || previousServerMillis == 0) {
      previousServerMillis = currentMillis;   
      //Serial.print(currentMillis); Serial.println(" intervalServer===");
      printOLED(0,32,"Server start");
      server();
  }

    // LOOP version
    //server();
    //delay(60000*15);
}
