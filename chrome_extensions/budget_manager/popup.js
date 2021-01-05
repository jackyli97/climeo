$(function(){

    chrome.storage.sync.get(['total', 'limit'], function(result){
        $('#total').text(result.total);
        $("#limit").text(result.limit);
    });

    $('#spendAmount').click(function(){
        chrome.storage.sync.get(['total', 'limit'], function(result){
            let newTotal = 0;
            if (result.total){
                newTotal += parseInt(result.total);
            }

            let amount = $('#amount').val();
            if(amount){
                newTotal += parseInt(amount);
            }

            chrome.storage.sync.set({'total': newTotal}, function(){
                if (amount && newTotal >= result.limit){
                    let notifOptions = {
                        type: 'basic',
                        iconUrl: 'icon48.png',
                        title: 'Limit reached!',
                        message: "Uh oh! Looks like you've reached your limit!"
                    };
                    chrome.notifications.create('limitNotif', notifOptions);
                };
            });

            $('#total').text(newTotal);
            $('#amount').val('');
        });
    });
});