let contextMenuItem = {
    "id": "spendMoney",
    "title": "SpendMoney",
    "contexts": ["selection"]
};
chrome.contextMenus.create(contextMenuItem);

function isInt(value) {
    return !isNaN(value) &&
        parseInt(Number(value)) == value &&
        !isNaN(parseInt(value, 10));
}

chrome.contextMenus.onClicked.addListener(function(result){
    if (result.menuItemId == "spendMoney" && result.selectionText){
        if (isInt(result.selectionText)){
            chrome.storage.sync.get(['total', 'limit'], function(budget){
                let newTotal = 0;
                if (budget.total) newTotal += parseInt(budget.total);
                newTotal += parseInt(result.selectionText);
                
                chrome.storage.sync.set({'total': newTotal}, function(){
                    if (newTotal >= budget.limit){
                         let notifOptions = {
                             type: "basic",
                             iconUrl: "icon48.png",
                             title: "Limit reached!",
                             message:
                                 "Uh oh! Looks like you've reached your limit!",
                         };
                         chrome.notifications.create(
                             "limitNotif",
                             notifOptions
                         );
                    }
                })
            })
        }
    };
});

chrome.storage.onChanged.addListener(function(changes, storageName){
    chrome.browserAction.setBadgeText({"text": changes.total.newValue.toString()});
});