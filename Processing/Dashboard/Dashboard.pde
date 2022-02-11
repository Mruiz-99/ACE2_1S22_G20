import org.apache.hc.*;

PShape roundedLargeSquare;
PShape roundedSquare;
PShape termometro;
PShape waterDrop;
PShape sunIcon;
PShape co2Icon;
PShape chevronUP;
PShape chevronDown;
PShape arrowUP;
PShape arrowDown;
PFont titleFont;
PFont valueFont;
int lastChangeTC = 1;
int lastChangeTP = 1;
int lastChangeL = 1;
int lastChangeH = 1;

String APIserver = "http://localhost:7000";


void setup(){
  size(1024,760);
  background(255);
  
  // Textos
  titleFont = createFont("Arial",30,true);
  valueFont = createFont("Arial",20, true);
  
  // Formas
  roundedLargeSquare = loadShape("Util/RoundedLargeSquare.svg");
  roundedLargeSquare.scale(1.25);
  
  roundedSquare = loadShape("Util/RoundedSquare.svg");
  roundedSquare.scale(1.25);
  
  chevronUP = loadShape("Util/Temp_Increase.svg");
  chevronUP.scale(0.02);
  
  chevronDown = loadShape("Util/Temp_Decrease.svg");
  chevronDown.scale(0.02);
  
  arrowUP = loadShape("Util/arrowUp.svg");
  arrowDown = loadShape("Util/arrowDown.svg");
  arrowDown.scale(4);
  
  termometro = loadShape("Util/TempIcon.svg");
  termometro.scale(0.5);
  
  
  waterDrop = loadShape("Util/HumidityIcon.svg");
  waterDrop.scale(0.5);
  
  sunIcon = loadShape("Util/SunIcon.svg");
  sunIcon.scale(0.50);
  
  co2Icon = loadShape("Util/CO2Icon.svg");
  
}

void draw(){
  
  try(final CloseableHttpClient httpclient = HttpClients.createDefault()){
    final HttpGet httpget = new HttpGet("");    
    
  }catch(Exception e){
    
  }
  
  
  drawTemp(30,30,"Temperatura Casa", 45, 50); 
  drawTemp(250,30,"Temperatura Pozo", 35, 2);
  drawLight(30,350,"Nivel de Luz", 45, 45);
  drawHumidity(400,350,"Nivel de Humedad", 35, 45);
  
  
}

void drawHumidity(int x, int y, String title, double new_hum, double old_hum){
  // Background Shape and Icon
  shape(roundedLargeSquare, x, y);
  shape(waterDrop, x+130,y+20);
  
  // Change Indicator
  drawHumidityChevron(x,y, new_hum-old_hum);
  
  // Lumen Information
  int xpos = (185-((new_hum+"").length())*30)/2;
  textFont(valueFont, 60);
  text(new_hum+"", x+xpos,y+180);
  
  // Bottom Title
  textFont(valueFont, 20);
  xpos = 5+(355-(title.length())*10)/2;
  text(title, x+xpos,y+295);
}

void drawHumidityChevron(int x, int y, double chevron_type){
  if(chevron_type > 0){
    lastChangeH = 1;
    shape(arrowUP, x+75, y+100);
  }else if(chevron_type < 0){
    lastChangeH = -1;
    shape(arrowDown, x+75, y+187);
  }else{
    drawHumidityChevron(x,y,lastChangeH);
  }  
}

void drawLight(int x, int y, String title, double new_lumen, double old_lumen){
  // Background Shape and Icon
  shape(roundedLargeSquare, x, y);
  shape(sunIcon, x+55,y+15);
  
  // Change Indicator
  drawLightChevron(x,y, new_lumen-old_lumen);
  
  // Lumen Information
  int xpos = 110+(145-((new_lumen+"").length())*13)/2;
  textFont(valueFont, 30);
  text(new_lumen+"", x+xpos,y+150);
  textFont(valueFont, 20);
  text("lumens", x+150,y+165);
  
  // Bottom Title
  textFont(valueFont, 20);
  xpos = 15+(355-(title.length())*10)/2;
  text(title, x+xpos,y+295);
}

void drawLightChevron(int x, int y, double chevron_type){
  if(chevron_type > 0){
    lastChangeL = 1;
    shape(arrowUP, x+167, y+100);
  }else if(chevron_type < 0){
    lastChangeL = -1;
    shape(arrowDown, x+163, y+167);
  }else{
    drawLightChevron(x,y,lastChangeL);
  }  
}

// type true = casa ; false = pozo
void drawTemp(int x, int y, String title, double new_temp, double old_temp){
  shape(roundedSquare, x, y);
  shape(termometro, x+20,y+20);
  
  // Draw the vertical sign of temp
  stroke(255,134,128);
  fill(255,134,128);
  quad(
    x+60,y+192, // Left Bottom
    x+67,y+192, // Right Bottom
    x+67,(float)(y+192-(new_temp*1.46)), // Right Upper
    x+60,(float)(y+192-(new_temp*1.46))   // Left Upper
  );
  
  // Draw the temperature and a chevron depending on last change
  drawTempNChevron(x, y, new_temp, old_temp, new_temp-old_temp, true);
  // Draw the block title at the bottowm slightly centered
  fill(255);
  textFont(titleFont, 20);
  int xpos = ((200-(title.length()*10))/2)+5; 
  text(title,x+xpos,y+290);
}

void drawTemp(int x, int y, String title, double new_temp, double old_temp, boolean type){
  shape(roundedSquare, x, y);
  shape(termometro, x+20,y+20);
  
  // Draw the vertical sign of temp
  stroke(255,134,128);
  fill(255,134,128);
  quad(
    x+60,y+192, // Left Bottom
    x+67,y+192, // Right Bottom
    x+67,(float)(y+192-(new_temp*1.46)), // Right Upper
    x+60,(float)(y+192-(new_temp*1.46))   // Left Upper
  );
  
  // Draw the temperature and a chevron depending on last change
  drawTempNChevron(x, y, new_temp, old_temp, new_temp-old_temp, type);
  // Draw the block title at the bottowm slightly centered
  fill(255);
  textFont(titleFont, 20);
  int xpos = ((200-(title.length()*10))/2)+5; 
  text(title,x+xpos,y+290);
}

void drawTempNChevron(int x, int y, double new_temp, double old_temp, double chevron_type, boolean type){
  if(chevron_type > 0){
    /** Case Temperature increased */
    if(type){
      lastChangeTC = 1;
    }else{
      lastChangeTP = 1;
    }
    shape(chevronUP, x+135, y+105);
    textFont(valueFont, 25);
    int xpos = (115-(((new_temp+"").length()+2))*10)/2;
    fill(255);
    text(new_temp+" °C",x+85+xpos,y+170);
  }else if(chevron_type < 0){
    /** Case Temperature decreased */
    if(type){
      lastChangeTC = -1;
    }else{
      lastChangeTP = -1;
    }
    // Temp
    fill(255);
    textFont(valueFont, 25);
    int xpos = (115-(((new_temp+"").length()+2))*10)/2;
    text(new_temp+" °C",x+85+xpos,y+135);
    // Chevron
    shape(chevronDown, x+135, y+140);
  }else{
    if(type){
      if(lastChangeTC > 0){
        drawTempNChevron(x, y, new_temp, old_temp, 1, true);
      }else{
        drawTempNChevron(x, y, new_temp, old_temp, -1, true);
      }
    }else{
      if(lastChangeTP > 0){
        drawTempNChevron(x, y, new_temp, old_temp, 1, false);
      }else{
        drawTempNChevron(x, y, new_temp, old_temp, -1, false);
      }
    }
 }
}
