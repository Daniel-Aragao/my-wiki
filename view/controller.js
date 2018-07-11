const electron = require('electron');
const url = require('url');
const path = require('path');

const constants = require('../infra/constants');
const EventController = require('../infra/services/EventController');

const {app, BrowserWindow, Menu, ipcMain} = electron;
const eventEmitter = EventController.getEmitter();

const Matter = require('../core/entities/matter');

let mainWindow;
let database;


let Config = function(dbase){
    // process.env.NODE_ENV = 'production';
    database = dbase;

    app.on('ready', function(){
        buildMainWindow();
        loadData();
    });
}

function buildMainWindow(){
    mainWindow = new BrowserWindow({
        width: 800,
        height: 700,
        title: "My Wiki",
        // frame: false
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, constants.views.views + 'main.html'),
        protocol: 'file:',
        slashes:true
    }));

    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    
    Menu.setApplicationMenu(mainMenu);
}

function loadData(){
    // eventEmitter.send('all-data', database.findAllMatter())
    mainWindow.webContents.once('did-finish-load', function(){
        // mainWindow.webContents.send('all-data', database.findAllMatter());

    })
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
                role: 'reload',
                accelerator: 'f5'
            }
        ]
    })
}

ipcMain.on('close', function(e, item){
    mainWindow = null;
    app.quit();
});

ipcMain.on('add-matter', function(e, matterViewModel){
    let matter = new Matter(
        matterViewModel.key,
        matterViewModel.description,
        matterViewModel.keywords,
        matterViewModel.subject
    );

    eventEmitter.emit("add-matter", matter);
});

ipcMain.on('key-changed', function(e, id){
    eventEmitter.emit('check-id', id);
});
eventEmitter.on('id-checked', function(bool){
    mainWindow.webContents.send('key-repeated', bool);
});

eventEmitter.on('db-error', function(err){
    mainWindow.webContents.send('db-error', err);
});

ipcMain.on('filter', function(e, filter){
    eventEmitter.emit('get-by-key', filter)
})

eventEmitter.on('search-result', function(matters){
    matters = matters.map(mapMatters)
    
    mainWindow.webContents.send('search-result', matters);
});

ipcMain.on('delete-matter', function(e, id){
    eventEmitter.emit('delete-matter', id);
});

ipcMain.on('edit-matter', function(e, matter){
    eventEmitter.emit('edit-matter', matter)
});

ipcMain.on('find-by-id', function(e, id){
    eventEmitter.emit('find-by-id', id);
});

eventEmitter.on('matter-found-by-id', function(matter){
    mainWindow.webContents.send('matter-found-by-id', mapMatters(matter));
});

ipcMain.on('edit-save-matter', function(e, matter){
    eventEmitter.emit('edit-save-matter', matter);
});

function mapMatters(value){
    let matter = new Matter(
        value._id,
        value.description,
        null,
        value.subject
    );
    
    if(value.keywords){
        matter.addKeywords(value.keywords);
    }

    matter.keywords = matter.getKeyWords();

    return matter
}

module.exports = {Config};