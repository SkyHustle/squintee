// const {app, BrowserWindow} = require('electron');

// let mainWindow;

// app.on('ready', function() {
//   mainWindow = new BrowserWindow({width: 1200, height: 800});
//   mainWindow.loadURL('file://' + __dirname + '/window.html');
// });





const {app, BrowserWindow, ipcMain, Tray, nativeImage} = require('electron')
const path = require('path')

const assetsDir = path.join(__dirname, 'assets')

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
    width: 600,
    height: 650,
    show: false,
    frame: false,
    resizable: true,
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
let base64Icon = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAAAAAA6mKC9AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfhBwgOAiUV9A23AAAAyElEQVQY012Puw3CQBBErwRMCD0AiSUkQ0IZOEBY8uFOoAB+bRhogABIaQAowxh773F3JmKT0Y40u28UIIIfr8qq4TSNRvEJI84QXr223u0WQf9lFyU8W4lgDHUSPBFlCDWlqSpTkoYYRd4tWN7guqLoHuyNWQrZBtYZpDNrjDe8H0jNo2Q7boyq4agaw0bq+/lyOd/rJnLoFGTDyWSY2aO5Iw1TPLug3VsLGsw/DuyTtByYQ++39X6vg4FH9+WOcRTFx1+5v/pf1vbIWPe3y5UAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTctMDctMDhUMTQ6MDI6MzctMDQ6MDBt3WNxAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE3LTA3LTA4VDE0OjAyOjM3LTA0OjAwHIDbzQAAAABJRU5ErkJggg==`
