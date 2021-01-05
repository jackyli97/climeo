$(function(){

    chrome.storage.sync.get('limit', function(result){
        $('#limit').val(result.limit);
    })

    $('#saveLimit').click(function(){
        let newLimit = $('#limit').val();
        if (newLimit){
        chrome.storage.sync.set({ limit: newLimit }, function(){
            close();
        });
        }

        $('#limit').val('');
    });

    $('#resetTotal').click(function(){
        chrome.storage.sync.set({'total': 0}, function(){
            let notifOptions = {
                type: "basic",
                iconUrl: "icon48.png",
                title: "Total reset!",
                message: "Total has been reset to 0!",
            };
            chrome.notifications.create("limitNotif", notifOptions);
        });
    });
})