const $ = require("jquery");
const axios = require('axios');
const path=require('path');
const BrowserWindow=require('electron').remote.BrowserWindow;
const ipc = require('electron').ipcRenderer
const desktopNotification = require('electron-notification-desktop')
var deviationPrice=25000;
var prevNotifiedAMount=0;
var todaysPeak=0;
const notification = {
    title: '',
    body: '',
    icon: path.join(__dirname, '../assets/icons/bitcoin_color.svg')
}
function getBitCoinPrice() {
    axios.get('https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC&tsyms=INR')
        .then(response => {
            
            $("#currentPrice").text(convertToINR(response.data.BTC.INR));
            var costTime=new Date();
            if(!prevNotifiedAMount){
                prevNotifiedAMount=response.data.BTC.INR;
                todaysPeak=response.data.BTC.INR;
                $("#todaysPrice").text(convertToINR(response.data.BTC.INR));
                $("#todaysPeak").text(convertToINR(response.data.BTC.INR));
            }
            if(response.data.BTC.INR>todaysPeak){
                todaysPeak=response.data.BTC.INR;
                $("#todaysPeak").text(convertToINR(todaysPeak));
            }
            if ($("#targetPriceValue").val()>0 && ($("#targetPriceValue").val() < response.data.BTC.INR)) {
                //const targetNotification = new window.Notification('BTC Alert @'+costTime.toString().substring(16,21), notification)
                const not3 = desktopNotification.notify('BTC Alert @'+costTime.toString().substring(16,21),{
                    message:"Bitcoin reached your Target Price!!!",
                    duration: 0
                });
            }
            
            if(Math.abs(response.data.BTC.INR-prevNotifiedAMount)>deviationPrice && deviationPrice){
                if(response.data.BTC.INR - prevNotifiedAMount>0){
                    const not = desktopNotification.notify('BTC Alert @'+costTime.toString().substring(16,21),{
                        message:" BTC <span style='color:green'>INCREASED</span> by <span style='font-weight:800'>"+convertToINR(Number(((response.data.BTC.INR - prevNotifiedAMount)).toFixed(1)))+"</span>\n<span style='display:block;'>&nbsp;Old Price "+convertToINR(prevNotifiedAMount)+"</span>\nNew Price "+convertToINR(response.data.BTC.INR),
                         duration: 0
                        })
                }else{
                    const not2 = desktopNotification.notify('BTC Alert @'+costTime.toString().substring(16,21),{
                        message:" BTC <span style='color:red;'>DECREASED</span> by <span style='font-weight:800'>"+convertToINR(Number(((response.data.BTC.INR - prevNotifiedAMount)).toFixed(1)))+"</span>\n<span style='display:block;'>&nbsp;Old Price "+convertToINR(prevNotifiedAMount)+"\n</span>New Price "+convertToINR(response.data.BTC.INR),
                         duration: 0
                        })
                }
                prevNotifiedAMount=response.data.BTC.INR;                
            }
        });
}
getBitCoinPrice();
setInterval(getBitCoinPrice, 3000);
function convertToINR(amount) {
    var x = amount;
    x = x.toString();
    var afterPoint = '';
    if (x.indexOf('.') > 0)
        afterPoint = x.substring(x.indexOf('.'), x.length);
    x = Math.floor(x);
    x = x.toString();
    var lastThree = x.substring(x.length - 3);
    var otherNumbers = x.substring(0, x.length - 3);
    if (otherNumbers != '')
        lastThree = ',' + lastThree;
    return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + afterPoint;
}

function showDeviationPage(event) {
    const modalPath = path.join('file://', __dirname, 'component/price-alert/price.html')
    let win = new BrowserWindow({
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        width: 400,
        height: 140
    })
    win.on('close', function () {
        win = null
    })
    //win.webContents.openDevTools();
    win.loadURL(modalPath)
    win.show()
}
function captureDeviationIPC(event, arg){
    deviationPrice = Number(arg)
    $("#showDeviation").text("+/-"+arg);
}
$("#setAlertBtn").on("click", showDeviationPage);
$("#priceTime").text("@" + (new Date()).toString().substring(3, 21));

ipc.on('deviationPrice', captureDeviationIPC)