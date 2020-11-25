let boxSelect = document.getElementsByClassName('boxSelect')[0];
let pic = document.getElementById('target');
let topLeft = null;
let bottomRight = null;
let numClicks = 0;
let xt = document.getElementById('topLeftX');
let yt = document.getElementById('topLeftY');
let xb = document.getElementById('botRightX');
let yb = document.getElementById('botRightY');
let box = document.getElementsByClassName('box')[0];
let dimensions = document.getElementById('dimensions')
let numDone = 0;
let ansArray = [];

//Box Padding
boxSelect.style.padding = "0px";
boxSelect.style.margin = "20px";
let boxPadding = Number(boxSelect.style.padding.slice(0, boxSelect.style.padding.indexOf('px')));
let boxMargin = Number(boxSelect.style.margin.slice(0, boxSelect.style.margin.indexOf('px')));


function drawRect(topL, bottomR) {
    box.style.left = (topL[0] + boxPadding).toString() + 'px';
    box.style.top = (topL[1] + boxPadding).toString() + 'px';
    let wd = bottomR[0] - topL[0];
    let ht = bottomR[1] - topL[1];
    box.style.height = ht.toString() + 'px';
    box.style.width = wd.toString() + 'px';
    box.style.borderWidth = '2px';
    box.style.borderStyle = 'dashed'; 
}

function eraseRect() {
    box.style.border = 'none';   
}

pic.addEventListener('click',function(e){
    if (numClicks % 2 == 0) {
        topLeft = [e.offsetX, e.offsetY];
        xt.value = e.offsetX;
        yt.value = e.offsetY;
        xb.value = 0;
        yb.value = 0;
        eraseRect();
    }
    else {
        bottomRight = [e.offsetX, e.offsetY];
        xb.value = e.offsetX;
        yb.value = e.offsetY;
        drawRect(topLeft, bottomRight);
    }
    numClicks++;
});

 //Setting value of dimensions AFTER page is fully rendered
window.addEventListener("load", function () {
    dimensions.value = pic.width + ' ' + pic.height + ' ' + pic.naturalWidth + ' ' + pic.naturalHeight;
})



