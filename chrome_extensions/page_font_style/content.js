chrome.runtime.sendMessage({todo: "showPageAction"});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if (request.todo == "changeColor"){
        let addColor = '#' + request.clickedColor;
        $(".code-sections").css("color", addColor);
    }
})