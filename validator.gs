


function onEdit(e){
  try{
  var config = {
    SHEET_NAME:'Named-User Inventory',
    TIERS:[4,5,6]
  }
  var sheet = SpreadsheetApp.getActiveSheet();
  if(sheet.getName() !== config.SHEET_NAME) return;
  var x = e.range.getColumn();
  var y = e.range.getRow();
  if(y === 1) return;
  //Logger.log(x + ',' + y);
  if(config.TIERS.indexOf(x) === -1) return;
  var spreadsheet = SpreadsheetApp.getActive();
  var validation = spreadsheet.getSheetByName('Validation-Auto');
  if(x === config.TIERS[0]){
    var list = p2r(1,1,validation);
    var index = list.indexOf(e.value);
    if(index === -1) return;
    var validationList = p2r(1,2+index,validation);
    Logger.log(validationList);
    var rule = SpreadsheetApp.newDataValidation().requireValueInList(validationList).build();
    sheet.getRange(y,config.TIERS[1]).setDataValidation(rule);
  }
  if(x === config.TIERS[1]){
    //bad things, bad things
    var list = p2r(1,1,validation);
    var index = list.indexOf(sheet.getRange(y,config.TIERS[0]).getValue());
    if(index === -1) return;
    var nextList = p2r(1,2+index,validation);
    var nextIndex = nextList.indexOf(e.value);
    if(nextIndex === -1) return;
    var validationList = p2r(2+index,2+nextIndex,validation);
    var rule = SpreadsheetApp.newDataValidation().requireValueInList(validationList).build();
    sheet.getRange(y,config.TIERS[2]).setDataValidation(rule);
  }
  }catch(e){
    Logger.log(e);
  }
}

/*read from the value in a position in the validation sheet to an array*/
function p2r(y,x,sheet){
 return JSON.parse(sheet.getRange(y,x).getValue()); 
  
}