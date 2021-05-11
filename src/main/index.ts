import { BrowserWindow, app, ipcMain } from 'electron';
import path from "path";
import installExtension, { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS, REACT_PERF } from 'electron-devtools-installer';


function loadHtml(window: BrowserWindow, name: string) {
    if (process.env.NODE_ENV === 'production') {
        window.loadFile(path.resolve(__dirname, `../renderer/${name}/index.html`)).catch(console.error);
        return;
    }
    // 开发模式
    window.loadURL(`http://localhost:8080/dist/${name}.html`).catch(console.error);
}

let mainWindow: BrowserWindow | null = null;





function createMainWindow() {
    if (mainWindow) return;
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        frame: true,
        backgroundColor: 'white',
        minWidth: 450,
        minHeight: 350,
        height: 350,
        width: 450
    });

    loadHtml(mainWindow, 'index');
    mainWindow.on('close', () => mainWindow = null);
    mainWindow.webContents.on('crashed', () => console.error('crash'));
    // require('devtron').install();
}



app.on('ready', () => {
    createMainWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    createMainWindow();
});

app.whenReady().then(() => {
    installExtension([REACT_PERF, REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS]).then(() => {});
});
