document.addEventListener('DOMContentLoaded',domloaded,false);
let cells = [[1, 1], [2, 1], [1, 2], [2, 2], [5, 4], [6, 4], [5, 5], [6, 5], [8, 1], [9, 1], [8, 2], [9, 2], [23, 12], [23, 13], [23, 14], [24, 14], [25, 14], [24, 11], [25, 11], [27, 11], [28, 11], [29, 12], [30, 13], [29, 14], [28, 15], [33, 13], [34, 13], [33, 14], [34, 14], [22, 19], [23, 19], [22, 20], [23, 21], [24, 21], [25, 21], [25, 22]];
let bg = "#222222";
let cellColor = "#FFFFFF"
let cellSize = 50;
let ctx;
let c;

function domloaded(){
    c = document.getElementById("bgCanvas");
    c.width *= 8;
    c.height *= 8;
    ctx = c.getContext("2d");

    let cl = cellSize;
    cellSize = c.width / cl;
    window.setInterval(bgLoop, 1000/10);
}

function existsInArray(e, a){
    let one = a;
    let two = e;
    one = JSON.stringify(one);
    two = JSON.stringify(two);

    var three = one.indexOf(two);
    if(three != -1){
        return true;
    }
    return false;
}

function getNeighbours(x, y){
    let testfor = [x, y];
    let neighbours = 0;
    for(let j = -1; j <= 1; j++){
        for(let k = -1; k <= 1; k++){
            if(k == 0 && j == 0){
                continue;
            } else {
                testfor = [x + k, y + j];
                if(existsInArray(testfor, cells)){
                    neighbours++;
                }
            }
        }
    }
    return neighbours;
}

function updateCells(){   
    let update = [];
    for(let i = 0; i < cells.length; i++){
        //For each live cell, calculate if its neighbours will live again
        for(let j = -1; j <= 1; j++){
            for(let k = -1; k <= 1; k++){
                //Check if each of the surrounding cells of a live cell exists
                let testfor = [cells[i][0]+k, cells[i][1]+j];
                let n = getNeighbours(testfor[0], testfor[1]);
                if(existsInArray(testfor, cells) && n == 2){
                    if(!existsInArray(testfor, update)){
                        update.push(testfor);
                    }
                } else if(n == 3){
                    if(!existsInArray(testfor, update)){
                        update.push(testfor);
                    }
                }
            }
        }
    }
    cells = [...update];
    update = [];
}

function drawCells(){
    ctx.fillStyle = "#000000";
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = "#282828";

    for(let i = 0; i < cells.length; i++){
        ctx.fillRect(cells[i][0]*cellSize, cells[i][1]*cellSize, cellSize, cellSize);
    }
}

function bgLoop(){
    updateCells();
    drawCells();
}