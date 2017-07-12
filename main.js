// const {app, BrowserWindow} = require('electron');

// let mainWindow;

// app.on('ready', function() {
//   mainWindow = new BrowserWindow({width: 1200, height: 800});
//   mainWindow.loadURL('file://' + __dirname + '/window.html');
// });


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
    width: 800,
    height: 950,
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
let base64Icon = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAACQ1BMVEUAAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAACbAAD///9VtF+/AAAAv3RSTlMAAAAAAAAAAgQDAwQAAAMCAAAAAgIAH1qGnZ2GWh8AAgABAwACR7P3////+bNHAgEDL7r79P77/Pv77fu6LwECAQB09dF8nW2p/v7SctMBDar3gQeEI7H8/KMBg/eqDRS/3j9KvAmC+//9Pz+/FNHBFQB3Ox7a/f/8dQAVwdHRdPC+5v7/ddE/P/z+/v///T8U94MBo/r+//yjg/fTctL+//7S9XQAArr7/PvtR/mzRwEfWoadnYZaHwIDAgMDAJzyBTYAAAABYktHRMATYd/4AAAAB3RJTUUH4QcMEjUHys0hJAAAAZdJREFUKM9jYCAPMDIyMjExs7AwMzEBmUjCrIxs7BycXFyc3Ow8QA4jVJiJkZePn1EAyAUS/Hy8QAEQW1CIUVhElFFMXEJSSlpGllFOXphRSJCRQYFRUUlZRVVNfb+G5n6t/do6unrKSoqMCgyM+gaMhkb7jU32m5qZW1haWe+3sWU0sGNksHdwdHLe7+Lq5u6x39Nrv7eP735nJwE/ewZG/4D9gUHBIaGMjGH7wyP2R0ZFx+yPjWNkiE/Yn5jEmJzCmMqYtj89I3N/FmN24v6cXIa8/fkFhYxF+4sZS0r3l5VX7K9krKqu2V/LUAeWqN/f0Ni0v3l/S8X+VrBEG9iodsaO/Z37u7r39/T27e9nbE/cnzABbPnESZOn7J86bf/06TP2z4yaNXt/gD/MuXPmzts/f8GChfsXAZ27eMnSZfYQDy7fb21luWLlyhWrVkM8qA8NEr01OtrA8ACitevWqygrbQAFCSgQ5eUYN27avGXrtu074IGIHuw7d0GDHRpRPLu59+zl4uTYjYgoeNQK7EOPWtIAAKMYgYkirVxrAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE3LTA3LTEyVDE4OjUzOjA3LTA0OjAwlGhregAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNy0wNy0xMlQxODo1MzowNy0wNDowMOU108YAAAAASUVORK5CYII=`
