/**
 * ============================================================================
 * TradeOS JavaScript Module
 * Auto-generated header by add-code-blocks.js
 * Part of the TradeOS V1.1 Full Stack Platform
 * ============================================================================
 */

const { app, BrowserWindow } = require('electron');

function createWindow () {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
    }
  });
  win.loadURL('http://localhost:3000'); // Or use local file from Next.js export
}

app.whenReady().then(createWindow);
