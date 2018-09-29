document.onkeydown = function (e) {
    e = e || window.event;
    console.log(e.keyCode);

    switch(e.keyCode) {
        case 37: 
            showInput('l');
        break;
        case 39: 
            showInput('r');
        break;
        case 38: 
            showInput('u');
        break;
        case 40: 
            showInput('d');
        break;
    }
}

function showInput(direction) {
    var node = document.createElement("div");
    node.className = "icon " + direction;

    document.getElementById("Container").appendChild(node);
}