const electron = require('electron');
const url = require('url');
const path = require('path');

const constants = require('../infra/constants');
const EventController = require('../infra/services/EventController');

const {app, BrowserWindow, Menu, ipcMain} = electron;
const eventEmitter = EventController.getEmitter();

let mainWindow;

let Config = function(){
    // process.env.NODE_ENV = 'production';

    app.on('ready', function(){
        buildMainWindow();
    })
}

function buildMainWindow(){
    mainWindow = new BrowserWindow({
        width: 800,
        height: 700,
        title: "My Wiki"
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, constants.views.views + 'main.html'),
        protocol: 'file:',
        slashes:true
    }));

    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

}

const mainMenuTemplate = [
    // {
    //     label:'Parametros',
    //     accelerator: 'p',
    //     click(){
    //         createParameterWindow();
    //     }
    // },
    // {
    //     label:'Iniciar',
    //     accelerator: 'i',
    //     click(){
    //         Start(parameters);
    //     }
    // }
]

if(process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu:[
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin'? 'Command+I' : 'f12',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    })
}

module.exports = {Config};