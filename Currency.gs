function updateCurrency() {
  var doc = SpreadsheetApp.openById('11xWAb_qDwjbFB9NGNj8lhdbIYjsTchu-_Xg6-_ZTseg').getSheetByName('Info');

  //ETH,TOWN,GALA
  for (i=1; i<4; i++) {    
    currency = doc.getRange(i+7,2,1,1).getValue()
    Logger.log(currency)
    url = "https://min-api.cryptocompare.com/data/price?fsym=" + currency + "&tsyms=USD"
    var websiteContent = UrlFetchApp.fetch(url).getContentText();
    var dataAll = JSON.parse(websiteContent);
    Logger.log(dataAll)

    destinationRange = doc.getRange(i+7,3,1,1);
    destinationRange.setValue(dataAll.USD)
    Logger.log(dataAll.USD)
  }  
}
