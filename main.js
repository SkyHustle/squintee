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
let base64Icon = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAACmlBMVEUAAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAACXAAD////FiRb6AAAA3HRSTlMAAAAAAQEBAAAAAgQCAAICAAADAgACCwsCAgMAAAICADV/uu3//+26fjUAAgADAVHW6fe9d3e99+nWUQEAAQQpzvlre+o0AgI06ntr+c4pAQNxmwYW7UKH5odC7RYGnHADpfk/gcSI/IjDgUD5pMjODQixh+D7++CGsQgNzsjIzw0IsYfg+/vgh7EOz8ek+kCAxIj8iMSBQPqkA3CcBhbtQofmh0LtFgadcAMBKM75a3rqNTXqe2z5zigEAVHW6fe9eHi99+nWUQI1f7rt///tun81AAICCwsCAgIC1a8JoQAAAAFiS0dE3XBnsyEAAAAJcEhZcwAAKigAACooAQLQmrEAAAAHdElNRQfhBwoMADd99gKYAAABk0lEQVQoz2NgoDZgZGJkZmFlZWMHMpBEORg5ubh5GHl5Gfm4+QWAXIiwIKOAkDCjCKOomLgEkJKUkgYKMTAwyTDKyskzKigqKauoqqlraDJqafMzyjAxMOro6jHqGxga3TE2MTW7Y25hacVorWvDyGBrx2jv4Ojk7OLK6ObO6OHp5e3j68do588QwBh4Jyg4JDSMMTwiIpIxKjomNu5OPGMCA2NiUjIjY0oqY9qd9PQ7GYyZWYyM2Tm5jAx5+QWMhYxFxYwld0rL7pQzVlQyVjFW19Qy1NU3MDYyNjUzttxpbbvTztjRCZTo6u5hYOzt62dknDCRcdKdyZPvTGGcOo2RcfqMmYwMsxhn35kzd978BYwLFy1azLhk6bLlK+6sZFzFsNqOcc3ades3bNwEcu7mLVu3bd+xk3HXbgZGG11/xj179+2/c+DgocN3jhw9dhziQWCQnNDWYjx56vSZs+fOX7h4ifGy9hVQkIACUVpKEhh6V69dvwGkbkIDERLsArLct0DBfhsp2GERxc6GEVFUAgBI/nQCOfnIcAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxNy0wNy0xMFQxMjowMDo1NS0wNDowMGyIIDMAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTctMDctMTBUMTI6MDA6NTUtMDQ6MDAd1ZiPAAAAAElFTkSuQmCC`
