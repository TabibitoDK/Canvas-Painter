import { STROKESIZE } from "./canvas.js"

const strokesizetextinput = document.getElementById('strokesizetextinput');
const strokesizeslider = document.getElementById('strokesizeslider');


export const STROKESETTING = {
    init: function () {
        strokesizetextinput.onchange = STROKESETTING.textChange;
        strokesizeslider.onchange = STROKESETTING.sliderChange;
        strokesizetextinput.value = 1;
        strokesizeslider.value =1;
    },
    textChange: function () {
        strokesizeslider.value = strokesizetextinput.value;
        STROKESIZE.currentSize = strokesizeslider.value;
        STROKESIZE.refresh();
    },
    sliderChange: function () {
        strokesizetextinput.value = strokesizeslider.value;
        STROKESIZE.currentSize = strokesizeslider.value;
        STROKESIZE.refresh();
    }
}