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
  Serial.begin(115200);
}

void loop(void) {
  u8g2.firstPage();
    sensorValue = analogRead(analogInPin);
    outputValue = map(sensorValue, 0, 1024, 0, 255);
        Serial.print("sensor = ");
        Serial.print(sensorValue);
        Serial.print("\t output = ");
        Serial.println(outputValue);   
        //texx = (outputValue) 
          //itoa(sensorValue, text, 10)
          //itoa(outputValue, texx, 10)
        //lcd.printIn(itoa(random(1024)-512, buf, 10));
        
  do {
    //u8g2.setFont(u8g2_font_ncenB18_tr);
    //u8g2.setFont(u8g2_font_10x20_tf);
    u8g2.setFont(u8g2_font_profont29_mf); // 19px
    u8g2.drawStr(0,18,text);
    u8g2.drawStr(50,18,itoa(sensorValue, buf, 10));

    //u8g2.setFont(u8g2_font_ncenB10_tr);
    //u8g2.setFont(u8g2_font_10x20_tf); 
    u8g2.setFont(u8g2_font_6x13_mr);  // 9px  
    u8g2.drawStr(0,32 ,texx);
    u8g2.drawStr(20,32 ,itoa(outputValue, buf, 10));
    //const char *str
  } while ( u8g2.nextPage() );
  delay(500);
}
