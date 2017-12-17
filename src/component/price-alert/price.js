const electron = require('electron')
const path = require('path')
const remote = require('electron').remote
const ipc = require('electron').ipcRenderer
const $ = require("jquery");

$("#cancelDeviation").on('click', function(event) {
    var window = remote.getCurrentWindow();
    window.close()
})

$("#submitDeviation").on('click', function() {
    ipc.send('setDeviationValue', document.getElementById('priceDeviationInput').value||9999999999)
    var window = remote.getCurrentWindow();
    window.close()
})