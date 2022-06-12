const OPENSEA_API_URL_VOX_R = "https://api.opensea.io/api/v1/asset/0xad9fd7cb4fc7a0fbce08d64068f60cbde22ed34c/";

function crawlingOpenSea_part() {
  var doc = SpreadsheetApp.openById('1lRPfufXFGLUSsdeiU8p9TAK03a6-aZyWt8pn3g4H74A').getSheetByName('tempPrice');

  for (partNum=0; partNum<8; partNum++) {
    Logger.log(partNum);
    startingIndexSheet = partNum*1111 + 2
    endIndexSheet = (partNum+1)*1111 + 1
    goods = doc.getRange(startingIndexSheet,1,1111,1).getValues()
    requests = goods.map((c) => ({
      url: OPENSEA_API_URL_VOX_R + c, 
      muteHttpExceptions: true})
      );
    response = UrlFetchApp.fetchAll(requests);
    data = response.map((r) => JSON.parse(r.getContentText()));
    
    for (idx=0; idx<1111; idx++) {
      dataAll = data[idx] 
      fullName = dataAll.name;
      Logger.log(fullName);
      try {
        tempArrayName = fullName.split("#");

        onlyName = tempArrayName[0]
        voxID = tempArrayName[1]

        destinationRange = doc.getRange(startingIndexSheet+idx,1,1,3);
        values = [[idx+startingIndexSheet, onlyName, voxID]];
        destinationRange.setValues(values)

        // Logger.log(dataAll.name);    
        for (i in dataAll.orders){
          if (dataAll.orders[i].side>0.0){
            Logger.log(idx + "->" + onlyName + "(" + voxID + ")" + ": " + dataAll.orders[i].current_price/1.0E18 + " " + dataAll.orders[i].payment_token_contract.symbol);

            // record in the sheet
            destinationRange = doc.getRange(startingIndexSheet+idx,4,1,2);
            symbolCurrency = dataAll.orders[i].payment_token_contract.symbol;
            priceBefore = dataAll.orders[i].current_price;
            if (symbolCurrency == "ETH") {
              values = [[priceBefore/1.0E18, symbolCurrency]];
            } else if (symbolCurrency == "GALA") {
              values = [[priceBefore/1.0E8, symbolCurrency]];
            } else if (symbolCurrency == "USDC") {
              values = [[priceBefore/1.0E6, symbolCurrency]];
            } else {
              values = [[priceBefore/1.0E8, symbolCurrency]];
            }
            
            destinationRange.setValues(values)

            break;        
          }
        }     
      } catch (e) {
        // Logs an ERROR message.
        Logger.log(dataAll)
        Logger.log(fullName)
        Logger.log('Error: ' + e);
        Utilities.sleep(100*1000);
      }
    }

  }
  
}
