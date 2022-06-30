import { canvas, renderer } from "../main.js";

export class Renderer {
    constructor(canvas) {
        this.update = [];
        this.undoHist = [];
        this.canvas = canvas;
        this.canvas.style.cursor = 'crosshair'
        this.ctx = canvas.getContext("2d");
        this.canRedo = false;
        if ("TextEncoder" in window && "TextDecoder" in window) {
            this.enc = new TextEncoder();
            this.dec = new TextDecoder('utf-8');
        }
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
    clear() {
        this.ctx.fillStyle = "#ffffff";
        this.ctx.fillRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
        this.update = [];
        this.undoHist = [];
        COLOR.refresh();
        STROKESIZE.refresh();
    }
    undo() {
        this.ctx.fillStyle = "#ffffff";
        this.ctx.fillRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
        this.undoHist.push(this.update[this.update.length-1]);
        this.update.pop();
        COLOR.refresh();
        STROKESIZE.refresh();
        this.refresh();
        this.canRedo = true;
    }
    redo() {
        if (this.undoHist.length == 0) return;
        this.update.push(this.undoHist.pop());
        this.refresh();
    }
}


export const Pointer = {
    canvasX: 0,
    canvasY: 0,
    pastX: 0,
    pastY: 0,
    update: function (e) {
        Pointer.pastX = Pointer.canvasX;
        Pointer.pastY = Pointer.canvasY;
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
        renderer.ctx.lineCap = 'round';
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


export const MENUBAR = {
    init: function () {
        MENUBAR.clearbtn = document.getElementById('clearbtn');
        MENUBAR.savebtn = document.getElementById('savebtn');
        MENUBAR.undobtn = document.getElementById('undobtn');
        MENUBAR.redobtn = document.getElementById('redobtn');
        MENUBAR.newbtn = document.getElementById('newbtn');
        MENUBAR.savebtn.onclick = MENUBAR.save;
        MENUBAR.clearbtn.onclick = MENUBAR.clearCanvas;
        MENUBAR.undobtn.onclick = MENUBAR.undo;
        MENUBAR.redobtn.onclick = MENUBAR.redo;
        MENUBAR.newbtn.onclick = MENUBAR.load;
    },
    clearCanvas: function () {
        renderer.clear();
    },
    undo: function () {
        renderer.undo();
    },
    redo: function () {
        renderer.redo();
    },
    save: function () {
        let data = {
            CanvasName: "Canvas",
            Update: renderer.update,
            UndoHistory: renderer.undoHist,
            FillColour: "#000000",
            StrokeColour: "#000000",
            StrokeSize: 1,
        }
        let dataJSON = JSON.stringify(data);
        dataJSON = '\nDATA\n' + dataJSON + '\nDATA\n';
        if (confirm("Download canvas file")) {
            if (renderer.enc !== undefined) {
                let strBuff = renderer.enc.encode(dataJSON);
                let colors = renderer.ctx.getImageData(0, 0, renderer.canvas.clientWidth, renderer.canvas.clientHeight);
                console.log(colors);
                for (let i=0; i<strBuff.length; i++) {
                    for (let j=0; j<8; j++) {
                        let res = (strBuff[i] >>> j) & 1;
                        colors.data[(i*8)+j] ^= (-res ^ colors.data[(i*8)+j]) & (1 << 0);
                    } 
                }
                renderer.ctx.putImageData(colors, 0, 0);
            }
            let dataURL = renderer.canvas.toDataURL();
            fetch(dataURL).then(data => data.arrayBuffer()).then(newT => toBlob(newT));
            const a = document.createElement('a');
            a.style.display = 'none';
            document.body.appendChild(a);
            function str2ab(str) {
                var bufView = new Uint8Array(str.length);
                for (var i=0, strLen=str.length; i < strLen; i++) {
                bufView[i] = str.charCodeAt(i);
                }
                return bufView;
            }
            function toBlob (text) {
                let newT;
                if (renderer.enc !== undefined) {
                    newT = text;
                }
                else {
                    let imgbuff = new Uint8Array(text);
                    let textbuff = str2ab(dataJSON);
                    newT = new Uint8Array(imgbuff.length + textbuff.length);
                    console.log(imgbuff);
                    newT.set(imgbuff, 0);
                    newT.set(textbuff, imgbuff.length);
                }
                console.log(newT);
                let blob = new Blob([newT], {type: "data:image/png"});
                a.href = window.URL.createObjectURL(blob);
                a.download = `${data.CanvasName}.png`;
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(a.href);
            }
        
        }
    },
    load: function () {
        renderer.clear();
        if (confirm("Load a saved data file ?")) {
            const inp = document.createElement('input');
            inp.type = 'file';
            inp.style.display = 'hidden';
            inp.onchange = function () {
                var file = this.files[0];
                var fs = new FileReader();
                var mode = 0;
                fs.onload = function () {
                    if (mode == 0) {
                        let result = fs.result.split('DATA');
                        if (result.length !==3) {
                            mode = 1;
                            fs.readAsDataURL(file);
                            return
                        }
                        let dataJSON = result[1];
                        loadData(dataJSON);
                    }
                    if (mode == 1) {
                        let img = document.getElementById('imgloaded');
                        img.src = fs.result;
                        img.onload = function () {
                            let canvas = document.createElement('canvas');
                            canvas.style.visibility = "hidden";
                            img.style.display = 'block';
                            canvas.width = img.clientWidth;
                            canvas.height = img.clientHeight;
                            console.log(img.clientWidth, img.clientHeight, canvas.width, canvas.height);
                            img.style.display = 'none';
                            document.body.appendChild(canvas);
                            let ctx = canvas.getContext('2d');
                            ctx.drawImage(img, 0, 0);
                            let strsrc = ctx.getImageData(0,0,canvas.width, canvas.height).data;
                            document.body.removeChild(canvas);
                            window.URL.revokeObjectURL(fs.result);
                            let strans = new Uint8Array(strsrc.length);
                            // console.log(strsrc);
                            for (let i=0, j=0; i<strsrc.length; i++) {
                                if (i%8 == 0 && i!=0) j++;
                                let res = (strsrc[i] >>> 0) & 1;
                                strans[j] ^= (-res ^ strans[j]) & (1 << i%8);
                            }
                            let result = renderer.dec.decode(strans);
                            result = result.split('DATA');
                            if (result.length !==3) {
                                console.log(result);
                                alert("Error loading this file, data not found");
                                return
                            }
                            let dataJSON = result[1];
                            console.log(dataJSON);
                            loadData(dataJSON);
                        }
                    }
                }
                function loadData(dataJSON) {
                    let data = JSON.parse(dataJSON);
                    console.log(data);
                    for (let i=0 ; i<data.Update.length; i++) {
                        let trace = new TRACE(data.Update[i]);
                    }
                    renderer.refresh();
                    console.log(data);
                }
                fs.readAsBinaryString(file);
                // console.log(this.files[0])
            };
            document.body.appendChild(inp);
            inp.click();
            document.body.removeChild(inp);
        }
    }
}


class TRACE {
    constructor(data) {
        this.strokestyle = data.strokestyle;
        this.strokesize = data.strokesize;
        this.path = data.path;
        renderer.update.push(this);
    }
    draw () {
        return;
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
