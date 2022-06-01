import { COLOR } from "./canvas.js";

const colourPicker = document.getElementById('colourPicker');
const rainbowBox = document.getElementById('rainbow-box');
const fillcolourdisp = document.getElementById('fillcolourdisp');
const strokecolourdisp = document.getElementById('strokecolourdisp');
const fillbtn = document.getElementById('fillColour');
const strokebtn = document.getElementById('strokeColour');


export const PICKER = {
    currentType: fillcolourdisp,
    types: [fillcolourdisp, strokecolourdisp],
    buttons: [fillbtn, strokebtn],
    init: function () {
        colourPicker.style.left = rainbowBox.offsetLeft;
        colourPicker.style.top = rainbowBox.offsetTop;
        colourPicker.setAttribute('height', `${rainbowBox.clientHeight}px`)
        colourPicker.setAttribute('width', `${rainbowBox.clientWidth}px`)
        PICKER.ctx = colourPicker.getContext('2d');

        var spectrum = document.getElementById('spectrum');
        PICKER.ctx.drawImage(spectrum, 0, 0, colourPicker.clientWidth, colourPicker.clientHeight);

        // var grd = PICKER.ctx.createLinearGradient(0, 0, colourPicker.clientWidth, 0);
        // grd.addColorStop(0.0, "white");
        // grd.addColorStop(0.1, "black");
        // grd.addColorStop(0.2, "red");
        // grd.addColorStop(0.3, "orange");
        // grd.addColorStop(0.4, "yellow");
        // grd.addColorStop(0.5, "green");
        // grd.addColorStop(0.6, "blue");
        // grd.addColorStop(0.7, "indigo");
        // grd.addColorStop(0.8, "purple");
        // grd.addColorStop(0.9, "black");
        // grd.addColorStop(1.0, "white");

        // PICKER.ctx.fillStyle = grd;
        // PICKER.ctx.fillRect(0,0, colourPicker.clientWidth, colourPicker.clientHeight);

        fillbtn.onmouseup = function () {
            PICKER.change(0);
        };
        strokebtn.onmouseup = function () {
            PICKER.change(1);
        }
    },
    mouseup: function (e) {
        PICKER.canvasX = e.clientX - colourPicker.offsetLeft;
        PICKER.canvasY = e.clientY - colourPicker.offsetTop;
        console.log(PICKER.canvasX, PICKER.canvasY);
        if (PICKER.canvasX >= 0 && PICKER.canvasX <= colourPicker.clientWidth) {
            if (PICKER.canvasY >= 0 && PICKER.canvasY <= colourPicker.clientHeight) {
                let data = PICKER.ctx.getImageData(PICKER.canvasX, PICKER.canvasY, 1, 1).data;
                let hex = "#" + ("000000" + rgbToHex(data[0], data[1], data[2])).slice(-6);
                console.log(hex);
                PICKER.currentType.style.backgroundColor = hex;
                COLOR.currentFill = fillcolourdisp.style.backgroundColor;
                COLOR.currentStroke = strokecolourdisp.style.backgroundColor;
                COLOR.refresh();
                console.log(COLOR.currentFill);
            }
        }
    },
    change: function (num) {
        PICKER.currentType = this.types[num];
        PICKER.colorChange(num)
    },
    colorChange: function (num) {
        for (let i=0 ; i<PICKER.types.length ; i++) {
            if (i == num) {
                PICKER.buttons[i].style.backgroundColor = "grey"
            }
            else {
                PICKER.buttons[i].style.backgroundColor = "white"
            }
        }
    }
}


function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}

