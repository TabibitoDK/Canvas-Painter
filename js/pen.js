import { renderer, current } from '../main.js'
import { Pointer, STROKESIZE, COLOR } from './canvas.js';

export const PEN = {
    Pen: class {
        constructor() {
            this.ended  = false;
            this.path = [];
            window.addEventListener('pointerup', this.pointerup)
            renderer.update.push(this);
        }
        pointerup (e) {
            current.ended = true;
            window.removeEventListener('pointerup', current.pointerup);
        }
        draw(canvas, ctx) {
            if (this.ended == true) return;
            if (this.path.length == 0) {
                ctx.beginPath()
                ctx.moveTo(Pointer.canvasX, Pointer.canvasY);
            }
            ctx.lineTo(Pointer.canvasX, Pointer.canvasY);
            ctx.stroke();
            this.path.push([Pointer.canvasX, Pointer.canvasY])
        }
        update(canvas, ctx) {
            if (this.path.length == 0) return;
            ctx.beginPath()
            ctx.moveTo(this.path[0][0], this.path[0][1])
            this.path.forEach(path => {
                ctx.lineTo(path[0], path[1])
                ctx.stroke();
            });
        }
    }
}


export const ERASER = {
    eraser: class {
        constructor () {
            this.ended = false;
            this.path = []
            window.addEventListener('pointerup', this.pointerup)
            renderer.update.push(this);
        }
        pointerup (e) {
            current.ended = true;
            COLOR.refresh();
            window.removeEventListener('pointerup', current.pointerup);
        }
        draw(canvas, ctx) {
            if (this.ended == true) return;
            if (this.path.length == 0) {
                ctx.fillStyle = "#FFFFFF";
            }
            ctx.beginPath()
            ctx.arc(Pointer.canvasX - STROKESIZE.currentSize, Pointer.canvasY - STROKESIZE.currentSize, STROKESIZE.currentSize, 0, 2 * Math.PI);
            ctx.fill()
            this.path.push([Pointer.canvasX - STROKESIZE.currentSize, Pointer.canvasY - STROKESIZE.currentSize, STROKESIZE.currentSize])
        }
        update(canvas, ctx) {
            if (this.path.length == 0) return;
            ctx.beginPath()
            this.path.forEach(path => {
                ctx.arc(path[0], path[1], path[2], 0, 2 * Math.PI);
                ctx.fill()
            });
        }
    } 
}