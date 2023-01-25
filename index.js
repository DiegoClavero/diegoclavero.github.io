document.addEventListener('DOMContentLoaded',domloaded,false);
//[[1, 1], [2, 1], [1, 2], [2, 2], [5, 4], [6, 4], [5, 5], [6, 5], [8, 1], [9, 1], [8, 2], [9, 2], [23, 12], [23, 13], [23, 14], [24, 14], [25, 14], [24, 11], [25, 11], [27, 11], [28, 11], [29, 12], [30, 13], [29, 14], [28, 15], [33, 13], [34, 13], [33, 14], [34, 14], [22, 19], [23, 19], [22, 20], [23, 21], [24, 21], [25, 21], [25, 22]]
//[1,5],[2,5],[1,6],[2,6],[11,5],[11,6],[11,7],[12,4],[12,8],[13,3],[13,9],[14,3],[14,9],[15,6],[16,4],[16,8],[17,5],[17,6],[17,7],[18,6],[21,3],[21,4],[21,5],[22,3],[22,4],[22,5],[23,2],[23,6],[25,1],[25,2],[25,6],[25,7],[35,3],[36,3],[35,4],[36,4]
//[2,2],[3,2],[2,3],[3,3]
let cells = [[1,5],[2,5],[1,6],[2,6],[11,5],[11,6],[11,7],[12,4],[12,8],[13,3],[13,9],[14,3],[14,9],[15,6],[16,4],[16,8],[17,5],[17,6],[17,7],[18,6],[21,3],[21,4],[21,5],[22,3],[22,4],[22,5],[23,2],[23,6],[25,1],[25,2],[25,6],[25,7],[35,3],[36,3],[35,4],[36,4]];
let bg = "#222222";
let cellColor = "#FFFFFF";
let ar = window.innerHeight/window.innerWidth;
let cellSize;
let cellScreenWidth = 45;
let ctx;
let c;
let run = true;
const d = new Date();

//Images
let clinkingGlasses = new Image();
clinkingGlasses.src = '/clinking-glasses.png';

let cake = new Image();
cake.src = '/cake.png';

let present = new Image();
present.src = '/present.png';

function domloaded(){
    c = document.getElementById("bgCanvas");
    c.width *= 8;
    c.height *= 8;
    ctx = c.getContext("2d");

    ctx.fillStyle = "#242424";

    cellSize = c.width / cellScreenWidth;
    window.setInterval(bgLoop, 1000/10);

    if(d.getDate() == 1 && d.getMonth() == 0){
        document.getElementById('day').textContent = 'Happy New Year!';
    } else if(d.getDate() == 5 && d.getMonth() == 6){
        document.getElementById('day').textContent = 'Happy birthday to me!';
    } else if(d.getDate() == 25 && d.getMonth() == 11){
        document.getElementById('day').textContent = 'Merry Christmas!';
    }
}

function existsInArray(item, array){
    for (var i = 0; i < array.length; i++) {
        if (array[i][0] == item[0] && array[i][1] == item[1]) {
            return i;
        }
    }
    return -1;
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
                if(existsInArray(testfor, cells) >= 0){
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
                if(existsInArray(testfor, cells) >= 0 && n == 2){
                    if(existsInArray(testfor, update) < 0){
                        update.push(testfor);
                    }
                } else if(n == 3){
                    if(existsInArray(testfor, update) < 0){
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
    ctx.clearRect(0, 0, c.width, c.height);

    for(let i = 0; i < cells.length; i++){
        drawCell(cells[i][0]*cellSize, cells[i][1]*cellSize, cellSize, cellSize);
    }
}

function drawCell(x, y, w, h){
    let day = d.getDate(); //1-31
    let month = d.getMonth(); //0-11
    
    if(day == 1 && month == 0){
        ctx.drawImage(clinkingGlasses, x, y, w, h);
    } else if(day == 5 && month == 6){
        ctx.drawImage(cake, x, y, w, h);
    } else if(day == 25 && month == 11){
        ctx.drawImage(present, x, y, w, h);
    } else{
        ctx.fillRect(x, y, w, h);
    }
}

function bgLoop(){
    if(run){
        updateCells();
        drawCells();
    }
}

document.addEventListener('click', function(e) {
    const container = c.getBoundingClientRect();
    var x = parseInt(((e.clientX-container.left)/container.width)*cellScreenWidth);
    var y = parseInt(((e.clientY-container.top)/container.height)*cellScreenWidth);
    var xy = [x,y];
    var exists = existsInArray(xy,cells);
    if(exists != -1){
        cells.splice(exists, 1);
        ctx.clearRect(x*cellSize, y*cellSize, cellSize, cellSize);
    } else{
        cells.push([x,y]);
        drawCell(x*cellSize, y*cellSize, cellSize, cellSize);
    }
}, false);

document.addEventListener('keydown', function(e){
    if(e.code == "Space"){
        e.preventDefault();
        run = !run;
    } else if(e.code == "Enter"){
        if(run == false){
            cells = [];
            ctx.clearRect(0, 0, c.width, c.height);
        }
    }
}, false);

document.addEventListener('scroll', function(e){
    var scrollPercentage = window.scrollY/window.innerHeight;
    var upButton = document.getElementById("scrollUp");
    var downButton = document.getElementById("scrollDown");
    if(scrollPercentage == 0){
        upButton.style.display = "none";
    } else{
        upButton.style.display = "flex";
    }

    if(scrollPercentage >= 1){
        downButton.style.display = "none";
    } else{
        downButton.style.display = "flex";
    }
    console.log(scrollPercentage);
}, false);

function scrollUp(){
    var scrollpercentage = window.scrollY/window.innerHeight;
    if(scrollpercentage <= 1){
        window.scroll({top:0,left:0,behavior:'smooth'});
    } else if(scrollpercentage <= 2 && scrollpercentage > 1){
        window.scroll({top:window.innerHeight,left:0,behavior:'smooth'});
    }
}

function scrollDown(){
    var scrollpercentage = window.scrollY/window.innerHeight;
    if(scrollpercentage >= 0 && scrollpercentage < 1){
        window.scroll({top:window.innerHeight,left:0,behavior:'smooth'});
    }
}