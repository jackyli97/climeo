$(function(){
    let color = $('#fontColor').data-jscolor();
    $('#fontColor').on("change paste keyup", function(){
        color = $(this).data-jscolor();
    });

    $('#btnChange').click(function(){
        chrome.tabs.query({active: true, currentWindow:true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, {todo: "changeColor", clickColor: color})
        })
    })
});