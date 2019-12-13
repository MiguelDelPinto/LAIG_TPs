// Gest the data from a prolog request, listening on the server port
function getPrologRequest(requestString, onSuccess, onError, port)
{
    var requestPort = port || 8081
    var request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);

    request.onload = onSuccess || function(data){console.log("Request successful. Reply: " + data.target.response);};
    request.onerror = onError || function(){console.log("Error waiting for response");};

    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send();
}

// Makes a request, and specificis how to handle the reply
function makeRequest(request, handleReply) {			
    getPrologRequest(request, handleReply);
}

// Handle the Reply
function printReply(data) {
    console.log(data.target.response);
}

// Checks if a game mode is valid
function checkValidGamemode(gamemode) {
    request = "valid_game_mode(" + gamemode + ")";

    makeRequest(request, printReply);   // TODO change handler
} 

// Closes connection
function closeServer() {
    request = "quit";
    
    makeRequest(request, printReply);
}