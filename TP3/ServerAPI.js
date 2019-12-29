// -------------- SERVER COMMUNICATION -----------------

// Gets the data from a prolog request, listening on the server port
function getPrologRequest(requestString, onSuccess, onError, port)
{
    var requestPort = port || 8080
    var request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);

    request.onload = onSuccess || function(data){console.log("Request successful. Reply: " + data.target.response);};
    request.onerror = onError || function(){console.log("Error waiting for response");};

    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send();
}

// Makes a request, and specificis how to handle the reply
function makeRequest(request, handleReply) {			
    return getPrologRequest(request, handleReply);
}

// Prints the reply
function printReply(data) {
    console.log(data.target.response);
}



// -------------- PROLOG FUNCTIONS ----------------

// Checks if a game mode is valid
function serverCheckValidGamemode(gamemode, callback) {
    let request = "valid_game_mode(" + gamemode + ")";

    makeRequest(request, callback);
} 

// Generates fill positions
function serverValidFillPositions(board, callback) {
    let request = "valid_fill_positions(" 
                + JSON.stringify(board).replace(/"+/g, '') 
                + ")";

    makeRequest(request, callback);
}

// Chooses a fill position for the cpu
function serverCpuFillChoose(board, callback) {
    let request = "cpu_fill_choose(" 
                + JSON.stringify(board).replace(/"+/g, '') 
                + ")";

    makeRequest(request, callback);
}

// Gets the player frogs
function serverGetPlayerFrogs(board, player, callback){
    let request = "get_player_frogs("
                + JSON.stringify(board).replace(/"+/g, '')
                + ","
                + player
                + ")";

    makeRequest(request, callback);
}

// Checks/Generates a valid fill position
function serverValidJumpPosition(board, startPosition, callback) {
    let request = "valid_jump_position(" 
                + JSON.stringify(board).replace(/"+/g, '')
                + ","
                + JSON.stringify(startPosition).replace(/"+/g, '')
                + ")";

    makeRequest(request, callback);
}

// Removes the outer frogs from the board
function serverRemoveOuterFrogs(board, callback) {
    let request = "remove_outer_frogs("
                + JSON.stringify(board).replace(/"+/g, '')
                + ")";

    makeRequest(request, callback);
}

// Makes a move
function serverMakeMove(move, board, callback) {
    let request = "move("
                + JSON.stringify(move).replace(/"+/g, '')
                + ","
                + JSON.stringify(board).replace(/"+/g, '')
                + ")";

    makeRequest(request, callback);
}

// Checks if the game's over
function serverCheckGameOver(board, lastPlayer, callback) {
    let request = "game_over("
                + JSON.stringify(board).replace(/"+/g, '')
                + ","
                + lastPlayer
                + ")";

    makeRequest(request, callback);
} 

// Chooses the best move
function serverChooseBestMove(board, player, level, callback) {
    let request = "choose_move("
                + JSON.stringify(board).replace(/"+/g, '')
                + ","
                + player
                + ","
                + level
                + ")";

    makeRequest(request, callback);
}

// Closes connection
function closeServer() {
    let request = "quit";
    
    makeRequest(request, printReply);
}



// -------------- TESTING ----------------

function test_server() {

    let board = 
    [
        ["empty","empty","empty","empty","empty","empty","empty","empty"],
        ["empty","empty","empty","empty","empty","empty","empty","empty"],
        ["empty","empty","empty","empty","empty","empty","empty","empty"],
        ["empty","empty","empty","empty","empty","empty","empty","empty"],
        ["empty","empty","empty","empty","empty","empty","empty","empty"],
        ["empty","empty","empty","empty","empty","empty","empty","empty"],
        ["empty","empty","empty","empty","empty","empty","empty","empty"],
        ["empty","empty","empty","empty","empty","empty","empty","empty"]
    ];

    let board2 = 
    [
        ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty"],
        ["empty", "blue", "yellow", "yellow", "blue", "blue", "yellow", "empty"],
        ["empty", "blue", "blue", "blue", "yellow", "yellow", "yellow", "empty"],
        ["empty", "blue", "blue", "yellow", "blue", "yellow", "yellow", "empty"],
        ["empty", "blue", "blue", "yellow", "blue", "yellow", "yellow", "empty"],
        ["empty", "yellow", "yellow", "blue", "yellow", "blue", "blue", "empty"],
        ["empty", "blue", "yellow", "blue", "yellow", "blue", "yellow", "empty"],
        ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty"]
    ];
    
    serverValidFillPositions(board, printReply);
    //serverRemoveOuterFrogs(board2, printReply);
    serverCpuFillChoose(board, printReply);
}
