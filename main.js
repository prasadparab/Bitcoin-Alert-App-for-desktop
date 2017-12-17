const {app, BrowserWindow, Menu} = require('electron');
const path = require('path')
const url = require('url')
const ipc = require('electron').ipcMain
const shell = require('electron').shell
var win;

function createAppWindow () {
    
    win = new BrowserWindow({width: 800, height: 620})  
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'src/index.html'),
      protocol: 'file:',
      slashes: true
    }))
  
    // Open the DevTools.
    //win.webContents.openDevTools();  
    
    win.on('closed', () => {
      win = null
    })
  
    var menu = Menu.buildFromTemplate([
        {
            label: 'Menu',
            submenu: [
                  {
                      label: 'Bitcoin API Source',
                      click() {
                          shell.openExternal('http://coinmarketcap.com')
                      }
                  },
                  {type: 'separator'},
                  {
                      label: 'Exit',
                      click() {
                          app.quit()
                      }
                  }
            ]
        },
        {
            label: 'Info'
        }
    ])
  
    Menu.setApplicationMenu(menu);
  }
  ipc.on('setDeviationValue', function(event, arg) {
    win.webContents.send('deviationPrice', arg)
  })
  app.on('ready', createAppWindow)

  app.on('window-all-closed', () => {
    app.quit()
  })

  app.on('activate', () => {
    if (win === null) {
        createAppWindow()
    }
  })

  