import { Renderer, Pointer, resize, COLOR, STROKESIZE, PAN, MENUBAR } from './js/canvas.js'
import { ERASER, PEN } from './js/pen.js';
import {TOOLBAR} from './js/toolsbar.js';
import { PICKER } from './js/colorPallate.js';
import {STROKESETTING} from './js/drawSettings.js'

let canvas, renderer, current;

function main () {
    canvas = document.getElementById('canvas');
    resize();
    PICKER.init();
    STROKESETTING.init();
    MENUBAR.init();
    renderer = new Renderer(canvas);
    renderer.clear();
    COLOR.refresh();
    STROKESIZE.refresh();
    canvas.onpointerdown = pointerdown;
    window.onpointerup = pointerup;
    window.onpointermove = pointermove;
    window.onresize = function () {resize(); renderer.refresh();};
    window.onkeydown = onkeydown;
    render()
}

function render () {
    renderer.render();
    requestAnimationFrame(render);
}


function pointerdown (e) {
    renderer.canRedo = false;
    if (TOOLBAR.currentTool == 1) {
        current = new PEN.Pen();
    }
    else if (TOOLBAR.currentTool == 2) {
        current = new ERASER.eraser();
    }
}

function pointerup (e) {
    PICKER.mouseup(e);
}

function pointermove (e) {
    Pointer.update(e);
}

function onkeydown (e) {
    if (e.key == ' ') {
        PAN.pan();
    }
}

window.onload = main () ;


console.log("loaded");


export {canvas, renderer, current};