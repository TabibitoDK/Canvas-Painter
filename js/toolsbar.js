
const pen = document.getElementById('pen');
const eraser = document.getElementById('eraser')

export const TOOLBAR = {
    currentTool: 0,
    tools: [null, pen, eraser],
    change: function (num) {
        switch (num) {
            case 1: 
                    TOOLBAR.currentTool = 1;
                    TOOLBAR.colorChange(1);
                break;
            case 2: 
                    TOOLBAR.currentTool = 2;
                    TOOLBAR.colorChange(2);
                break;
            default: 
                    TOOLBAR.currentTool = 0;
                break;
        }
    },
    colorChange: function (num) {
        for (let i=1 ; i<TOOLBAR.tools.length ; i++) {
            if (i == num) {
                TOOLBAR.tools[i].style.backgroundColor = "grey"
            }
            else {
                TOOLBAR.tools[i].style.backgroundColor = "white"
            }
        }
    }
}


pen.onmouseup = function () {
    TOOLBAR.change(1);
    console.log("cc")
}
eraser.onmouseup = function () {
    TOOLBAR.change(2);
}