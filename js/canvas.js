import { canvas, renderer } from "../main.js";

export class Renderer {
    constructor(canvas) {
        this.update = []
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
    }
    render() {
        if (this.update.length == 0) return;
        this.update[this.update.length - 1].draw(this.canvas, this.ctx);
    }
    refresh() {
        for (let i = 0; i < this.update.length; i++) {
            this.update[i].update(this.canvas, this.ctx);            
        }
    }
}


export const Pointer = {
    canvasX: 0,
    canvasY: 0,
    update: function (e) {
        Pointer.canvasX = e.clientX - canvas.offsetLeft;
        Pointer.canvasY = e.clientY - canvas.offsetTop;
    }
}

export function resize () {
    // console.log(canvas.parentElement.parentElement.children);
    canvas.setAttribute('width', `${canvas.parentElement.clientWidth - (4*(window.innerWidth / 100))}`)
    canvas.setAttribute('height', `${canvas.parentElement.clientHeight - (8*(window.innerHeight / 100))}`)
}


export const COLOR = {
    currentFill: "#000000",
    currentStroke: "#000000",
    refresh: function () {
        renderer.ctx.strokeStyle = COLOR.currentStroke;
        renderer.ctx.fillStyle = COLOR.currentFill;
    }
}

export const STROKESIZE = {
    currentSize: 4,
    refresh: function () {
        renderer.ctx.lineWidth = STROKESIZE.currentSize;
    }
}

export const PAN = {
    oriX: 0,
    oriy: 0,
    setted: false,
    pan () {
        if (PAN.setted == false) {
            PAN.oriX = Pointer.canvasX + canvas.offsetLeft;
            PAN.oriy = Pointer.canvasY + canvas.offsetTop;
            PAN.setted = true;
        }
        PAN.x = Pointer.canvasX + canvas.offsetLeft;
        PAN.y = Pointer.canvasY + canvas.offsetTop;
        canvas.style.left = `${(canvas.offsetLeft + (PAN.x - PAN.oriX)) / 10}px`;
        canvas.style.top = `${(canvas.offsetTop + (PAN.y - PAN.oriy)) / 10}px`;
    }
}