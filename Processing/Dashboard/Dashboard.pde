import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.*;

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
HttpURLConnection connection;
BufferedReader reader;
String line;
StringBuffer responseContent;

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
  co2Icon.scale(6);
}

JSONArray sendGetRequest(String path){
  try{
    URL url = new URL(APIserver+path);
    connection = (HttpURLConnection) url.openConnection();
    
    connection.setRequestMethod("GET");
    connection.setConnectTimeout(200);
    connection.setReadTimeout(200);
    
    responseContent = new StringBuffer();
    int status = connection.getResponseCode();
    
    if(status > 299){
      reader = new BufferedReader(new InputStreamReader(connection.getErrorStream()));
      while((line = reader.readLine()) != null){
        responseContent.append(line);
      }
      reader.close();
    }else{
      reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
      while((line = reader.readLine()) != null){
        responseContent.append(line);
      }
      reader.close();
    }
    return parseJSONArray(responseContent.toString());
  }catch(Exception e){
    println("Error in request is: "+e.getMessage());
    return parseJSONArray("[{}]");
  }
}

void draw(){
  JSONArray arrayJSONObject = sendGetRequest("/getTempRecords/Casa/");
  double oldValue = 0,newValue = 0;
  JSONObject newJSONvalue = arrayJSONObject.getJSONObject(0);
  JSONObject oldJSONvalue = arrayJSONObject.getJSONObject(1);
  newValue = newJSONvalue.getDouble("temperatura");
  oldValue = oldJSONvalue.getDouble("temperatura");
  drawTemp(30,30,"Temperatura Casa", newValue, oldValue);
  
  arrayJSONObject = sendGetRequest("/getTempRecords/Pozo/");
  newJSONvalue = arrayJSONObject.getJSONObject(0);
  oldJSONvalue = arrayJSONObject.getJSONObject(1);
  newValue = newJSONvalue.getDouble("temperatura");
  oldValue = oldJSONvalue.getDouble("temperatura");
  drawTemp(250,30,"Temperatura Pozo", newValue, oldValue);
  
  drawCO2(500,30,"Nivel de CO2", newValue, oldValue);
  /*
  arrayJSONObject = sendGetRequest("/getHumidityRecords/");
  newJSONvalue = arrayJSONObject.getJSONObject(0);
  oldJSONvalue = arrayJSONObject.getJSONObject(1);
  newValue = newJSONvalue.getDouble("nivel");
  oldValue = oldJSONvalue.getDouble("nivel");
  */
  
  arrayJSONObject = sendGetRequest("/getLumenRecords/");
  newJSONvalue = arrayJSONObject.getJSONObject(0);
  oldJSONvalue = arrayJSONObject.getJSONObject(1);
  newValue = newJSONvalue.getDouble("nivel");
  oldValue = oldJSONvalue.getDouble("nivel");
  drawLight(30,350,"Nivel de Luz", newValue, oldValue);
  
  arrayJSONObject = sendGetRequest("/getHumidityRecords/");
  newJSONvalue = arrayJSONObject.getJSONObject(0);
  oldJSONvalue = arrayJSONObject.getJSONObject(1);
  newValue = newJSONvalue.getDouble("nivel");
  oldValue = oldJSONvalue.getDouble("nivel");
  drawHumidity(400,350,"Nivel de Humedad", newValue, oldValue);  
}

void drawCO2(int x, int y, String title, double new_ppm, double old_ppm){
  shape(roundedSquare, x, y);
  shape(co2Icon, x+40,y+170);
  
  // Draw the vertical sign of temp
  stroke(255,134,128);
  fill(255,134,128);
    
  // Draw the temperature and a chevron depending on last change
  //drawTempNChevron(x, y, new_temp, old_temp, new_temp-old_temp, type);
  // Draw the block title at the bottowm slightly centered
  fill(255);
  textFont(titleFont, 20);
  int xpos = ((200-(title.length()*10))/2)+5; 
  text(title,x+xpos,y+290);
}

void drawCO2Chevron(int x, int y, double new_temp, double old_temp, double chevron_type, boolean type){
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
