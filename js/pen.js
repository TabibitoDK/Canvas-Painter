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
            COLOR.refresh();
            STROKESIZE.refresh();
            window.removeEventListener('pointerup', current.pointerup);
        }
        draw(canvas, ctx) {
            if (this.ended == true) return;
            if (this.path.length == 0) {
                ctx.beginPath()
                ctx.moveTo(Pointer.canvasX, Pointer.canvasY);
                this.strokestyle = COLOR.currentStroke;
                this.strokesize = STROKESIZE.currentSize;
            }
            ctx.lineTo(Pointer.canvasX, Pointer.canvasY);
            ctx.stroke();
            this.path.push([Pointer.canvasX, Pointer.canvasY])
        }
        update(canvas, ctx) {
            if (this.path.length == 0) return;
            ctx.strokeStyle = this.strokestyle;
            ctx.lineWidth = this.strokesize;
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
            STROKESIZE.refresh();
            window.removeEventListener('pointerup', current.pointerup);
        }
        draw(canvas, ctx) {
            if (this.ended == true) return;
            if (this.path.length == 0) {
                ctx.strokeStyle = '#ffffff';
                this.strokesize = STROKESIZE.currentSize;
                ctx.beginPath()
                ctx.moveTo(Pointer.canvasX, Pointer.canvasY);
            }
            ctx.lineTo(Pointer.canvasX, Pointer.canvasY);
            ctx.stroke();
            this.path.push([Pointer.canvasX, Pointer.canvasY])
        }
        update(canvas, ctx) {
            if (this.path.length == 0) return;
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = this.strokesize;
            ctx.beginPath()
            ctx.moveTo(this.path[0][0], this.path[0][1])
            this.path.forEach(path => {
                ctx.lineTo(path[0], path[1])
                ctx.stroke();
            });
        }
    } 
}



function lerp (x, y, a) {
    let ans = x * (1-a) + y * a;
    return ans
}

function linelerp (x1, y1, x2, y2, a) {
    let ans = {x: x1, y:y1};
    ans.x = lerp(x1, x2, a);
    ans.y = lerp(y1, y2, a);
    return ans;
}



