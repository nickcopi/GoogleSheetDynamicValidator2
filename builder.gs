var config = {
  SOURCE_SHEET:'Unit-Data-Structure',
  TIER1:5,
  TIER2:7,
  TIER3:9,
  ASSUMED_MAX:3000,
  USER_SHEET:'Named-User Inventory',
  USER_T1:4
}


function buildValidation() {
  var spreadSheet = SpreadsheetApp.getActive();
  var sheet = spreadSheet.getSheetByName(config.SOURCE_SHEET);
  var out = {};
  var tier1s = sheet.getRange(2,config.TIER1,config.ASSUMED_MAX,2).getValues();
  var tier2s = sheet.getRange(2,config.TIER2,config.ASSUMED_MAX,2).getValues();
  var tier3s = sheet.getRange(2,config.TIER3,config.ASSUMED_MAX,2).getValues();
  tier1s = tier1s.map(function(item){
    var t1 = item[1] + ' - ' + item[0];
    var mbuIndex = t1.indexOf(' MBU');
    if(mbuIndex !== -1){
     t1 = t1.substring(0,mbuIndex+1) + t1.substring(mbuIndex+4,t1.length); 
    }
    if(!out[t1]) out[t1] = {};
    return t1;
  });
  tier2s = tier2s.map(function(item,i){
    var t2 = item[1] + ' - ' + item[0];
    var t1 = tier1s[i];
    if(!out[t1][t2]) out[t1][t2] = {};
    return t2;
  });
  tier3s.forEach(function(item,i){
    var t3 = item[1] + ' - ' + item[0];
    var t1 = tier1s[i];
    var t2 = tier2s[i];
    if(!out[t1][t2][t3]) out[t1][t2][t3] = 0;
  });
  var stringOut = JSON.stringify(out,null,2);
  //sheet.getRange(1, 1).setValue(stringOut);
  Logger.log(stringOut);
  buildSheet(out);
  initValid(Object.keys(out));
}

function buildSheet(data){
  var spreadSheet = SpreadsheetApp.getActive(); 
  var validation = spreadSheet.getSheetByName('Validation-Auto');
  if(validation) spreadSheet.deleteSheet(validation);
  var validation = spreadSheet.insertSheet();
  validation.setName('Validation-Auto');
  validation.getRange(1,1).setValue(JSON.stringify(Object.keys(data)));
  Object.keys(data).forEach(function(item,i){
    validation.getRange(1,i+2).setValue(JSON.stringify(Object.keys(data[item])));
    Object.keys(data[item]).forEach(function(subItem,j){
      validation.getRange(2+i,j+2).setValue(JSON.stringify(Object.keys(data[item][subItem])));
    });
  });
  
}

function initValid(list){
  var spreadSheet = SpreadsheetApp.getActive();
  var sheet = spreadSheet.getSheetByName(config.USER_SHEET);
  var rule = SpreadsheetApp.newDataValidation().requireValueInList(list).build();
  sheet.getRange(1,config.USER_T1,config.ASSUMED_MAX,1).setDataValidation(rule);
}