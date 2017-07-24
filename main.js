// const {app, BrowserWindow} = require('electron');

// let mainWindow;

// app.on('ready', function() {
//   mainWindow = new BrowserWindow({width: 1200, height: 800});
//   mainWindow.loadURL('file://' + __dirname + '/window.html');
// });


//handle setupevents as quickly as possible
 const setupEvents = require('./installers/setupEvents')
 if (setupEvents.handleSquirrelEvent()) {
    // squirrel event handled and app will exit in 1000ms, so don't do anything else
    return;
 }

const {app, BrowserWindow, ipcMain, Tray, nativeImage} = require('electron')
const path = require('path')

// const assetsDir = path.join(__dirname, 'assets')

let tray = undefined
let window = undefined

// This method is called once Electron is ready to run our code
// It is effectively the main method of our Electron app
app.on('ready', () => {
  // Setup the menubar with an icon
  let icon = nativeImage.createFromDataURL(base64Icon)
  tray = new Tray(icon)

  // Add a click handler so that when the user clicks on the menubar icon, it shows
  // our popup window
  tray.on('click', function(event) {
    toggleWindow()

    // Show devtools when command clicked
    if (window.isVisible() && process.defaultApp && event.metaKey) {
      window.openDevTools({mode: 'detach'})
    }
  })

  // Make the popup window for the menubar
  window = new BrowserWindow({
    width: 300,
    height: 200,
    show: false,
    frame: false,
    resizable: true,
    icon: path.join(__dirname, 'assets/icons/png/64x64.png')
  })

  // Tell the popup window to load our index.html file
  window.loadURL(`file://${path.join(__dirname, 'index.html')}`)

  // Only close the window on blur if dev tools isn't opened
  window.on('blur', () => {
    if(!window.webContents.isDevToolsOpened()) {
      window.hide()
    }
  })
})

const toggleWindow = () => {
  if (window.isVisible()) {
    window.hide()
  } else {
    showWindow()
  }
}

const showWindow = () => {
  const trayPos = tray.getBounds()
  const windowPos = window.getBounds()
  let x, y = 0
  if (process.platform == 'darwin') {
    x = Math.round(trayPos.x + (trayPos.width / 2) - (windowPos.width / 2))
    y = Math.round(trayPos.y + trayPos.height)
  } else {
    x = Math.round(trayPos.x + (trayPos.width / 2) - (windowPos.width / 2))
    y = Math.round(trayPos.y + trayPos.height * 10)
  }


  window.setPosition(x, y, false)
  window.show()
  window.focus()
}

ipcMain.on('show-window', () => {
  showWindow()
})

app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Tray Icon as Base64 so tutorial has less overhead
let base64Icon = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAQAAABKfvVzAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfhBxENCA5s8LoxAAABrklEQVQ4y7XTv0uVYRQH8M/7vLcItEVIJAqnfgzdEAwE8RfoLduVaGjpL0jIzWiQoCFwaW02yDHIugb+CBcTxJs4hhDU5FJG2n3fp+Ha9So0JHie6Tnn++V7Dud7OOlIjiY6jvzX/kWoA4PQUM/lh4nJIXAq1gBrB9kgkR2QknrhL/iCXte14Zt1S740ktYkHTWdIMOQMSWnGlqqemfKHFK5SEAilSmaU3ZLjui3qqqqHcPK5hRlUglpW03uoZcu+eS5r174qSgRpD576qIu9/3yQZCkbdEZ0x7IPXFPyTNlr3S6Ihe12jaooMdt17y2F7SYNWJLyWM3ddvSjHVEqdxd/R4p2TLijZZgXp9lnZZwVb8uP5x3R22+HDewpNOyPvOFQ2vM8VbFZa3ioQXWIxiwqNuqXnxEsx7nxH0PhP1sr1XdFg0E24bNaFc2acG01F7dMplg2oJJZe1mDNsOgl2jxkUTNqzYdHpfPUptWrFhQjRu1K6QdNQWV1U0ZVDuu6aGlnecFbw3pqIgEwOiTKpiSMmsJoWG12RWyZCKVCYex3zHsPcxDuh/TvTk4w/QeJQ5JigWTwAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxNy0wNy0xN1QxMzowODoxNC0wNDowMH0NRHkAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTctMDctMTdUMTM6MDg6MTQtMDQ6MDAMUPzFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAABJRU5ErkJggg==`
