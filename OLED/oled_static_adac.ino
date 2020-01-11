#include <Arduino.h>
#include <SPI.h>
#include <U8g2lib.h>

U8G2_SSD1306_128X32_UNIVISION_F_HW_I2C u8g2(U8G2_R0, /* reset=*/ 16, /* clock=*/ 5, /* data=*/ 4);

char *text = "V1=";
char *texx = "V2=";
char buf[12];

const int analogInPin = A0;  // ESP8266 Analog Pin ADC0 = A0
int sensorValue = 0;  // value read from the pot
int outputValue = 0;  // value to output to a PWM pin

void setup(void) {
  u8g2.begin();
  //Serial.begin(115200);
}

void showOLED(int val1, int val2){
  u8g2.firstPage();
  do {
    u8g2.setFont(u8g2_font_profont29_mf);
    u8g2.drawStr(0,18,"V=");
    u8g2.drawStr(36,18,itoa(val1, buf, 10));
    u8g2.drawStr(64,18,"V=");
    u8g2.drawStr(100,18,itoa(val1, buf, 10));

    u8g2.setFont(u8g2_font_6x13_mr); 
    u8g2.drawStr(0,32 ,"val=");
    u8g2.drawStr(26,32 ,itoa(val2, buf, 10));
    u8g2.drawStr(64,32 ,"val=");
    u8g2.drawStr(90,32 ,itoa(val2, buf, 10));
  } while ( u8g2.nextPage() );
}
void loop(void) {
    sensorValue = analogRead(analogInPin);
    outputValue = map(sensorValue, 0, 1024, 0, 255);
    showOLED(sensorValue,outputValue);
  delay(333);
}
