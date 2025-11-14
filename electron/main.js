 // Modules
 var _a = require('electron'), app = _a.app, BrowserWindow = _a.BrowserWindow, Menu = _a.Menu, shell = _a.shell, ipcMain = _a.ipcMain;
 var path = require('path');
 var Notification = require('electron').Notification;
 var ipc = ipcMain;
 process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
 // Discord presence
 const discordRPC = require('discord-rich-presence');
 const clientId = '1170333128850669659';
 const rpc = new discordRPC(clientId);
 var time = Date.now();
 
 const { autoUpdater } = require('electron-updater');
 const { dialog } = require('electron');
 const { writeFile, readFileSync } = require('fs');

 const { session } = require('electron');
const { Console } = require('console');
const machineId = require('node-machine-id');

 let widevineVersion = '1.4.8.866';
 let baseWidevinePath ='./widevine/'+widevineVersion+'/_platform_specific/';
 var widevine_adapter_path ='';



 switch(process.platform)
 {
       case "win32":
         widevine_adapter_path = baseWidevinePath+process.platform + "/" + process.arch +'/widevinecdmadapter.dll';
       break;
       default:
         widevine_adapter_path = baseWidevinePath+'mac_x64/widevinecdmadapter.plugin';
       break
 }
 
 app.commandLine.appendSwitch('widevine-cdm-path', path.join(__dirname, widevine_adapter_path));
 app.commandLine.appendSwitch('widevine-cdm-version', widevineVersion);
 
 const VERSION = '3.6.1';
 
 autoUpdater.autoDownload = true;
 autoUpdater.autoInstallOnAppQuit = true;
  
 autoUpdater.on('update-available', () => {
     var notification = new Notification({
         title: `Diavlo v${VERSION}`,
         body: 'Se ha encontrado una nueva actualización, se descargará en segundo plano.',
         icon: path.join(__dirname, '../src/images/logotipo.png'),
         silent: false,
     });
     notification.show();
 });
 
 
 autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName) {
     var notification = new Notification({
             title: `Diavlo v${VERSION}`,
         body: `Se ha descargado una nueva actualización, reinicia la aplicación para aplicar los cambios.`,
         icon: path.join(__dirname, '../src/images/logotipo.png'),
         silent: false,
     });
     notification.show();
 });
 
 let searchMCCache = {}
 
 function updateCache(data,searchInput) {
     data.forEach(dk => {
         searchInput = searchInput.toLowerCase()
         searchMCCache[searchInput]['results'].forEach(result => {
             if (dk['hash'] == result[0]['hash']) {
                 result[0]['passwordDecrypted'] = dk['decrypted']
             }
         })
     });
 }
 
 let nickFinderCache = []
 
 let DomainLookupCache = {}
 
 let ServerFinderCache = {}
 
 const isSecondInstance = !app.requestSingleInstanceLock();
 if (isSecondInstance) {
     app.quit();
 } else {
     // Deshabilitar el menú de desarrollador y el acceso a la consola
     
    app.on('web-contents-created', (event, contents) => {
        contents.on('context-menu', (event, params) => {
        event.preventDefault();
        })
        contents.on('before-input-event', (event, input) => {
        if (input.control && input.shift && input.key.toLowerCase() === 'i') {
            event.preventDefault();
        }
        });
    });
     
     // Configura la presencia
     time = Date.now()
 
     rpc.updatePresence({
     state: '😈 Diavlo Login',
     details: '💻 The Best Minecraft Finder',
     startTimestamp: time,
     largeImageKey: 'diavlo',
     largeImageText: `Diavlo v${VERSION} ✨`,
     smallImageKey: 'diavlo_chiquito',
     smallImageText: '(.gg/programadores) ✨',
     instance: true
     });
     // Keep a global reference of the window object, if you don't, the window will
     // be closed automatically when the JavaScript object is garbage collected.
     var mainWindow;
 
     const { windows } = require('electron-is');
     app.on('ready', () => {
         if (windows()) {
             app.setAppUserModelId('Diavlo v'+VERSION);
         }
     })
     var tokenData = null;
 
     const url = 'https://raw.githubusercontent.com/diavlotop/diavlo/main/domains.txt';
 
     const obtenerDominio = async () => {
         const response = await fetch(url);
         const data = await response.text();
         return data.trim();
     }
 
     // Create a new BrowserWindow when `app` is ready
     function createWindow() {
         autoUpdater.checkForUpdates();
         
        const template = [
            {
            label: 'Diavlo v3.6',
            submenu: [
                { role: 'quit' }
            ]
            }
        ];

         
 
        const menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);
         
         mainWindow = new BrowserWindow({
             title: `Diavlo v${VERSION}`,
             width: 1000,
             height: 800,
             minHeight: 700,
             minWidth: 880,
             resizable: true,
             backgroundColor: '#2e2c29',
             webPreferences: {
                 nodeIntegration: true,
                 contextIsolation: false,
                 enableRemoteModule: false,
                 preload: [
                    path.join(__dirname, '../src/js/buycraft.js'),
                    path.join(__dirname, '../src/js/domainlookup.js'),
                    path.join(__dirname, '../src/js/events.js'),
                    path.join(__dirname, '../src/js/finder.js'),
                    path.join(__dirname, '../src/js/generador.js'),
                    path.join(__dirname, '../src/js/index_animation.js'),
                    path.join(__dirname, '../src/js/index.js'),
                    path.join(__dirname, '../src/js/ipscanner.js'),
                    path.join(__dirname, '../src/js/login.js'),
                    path.join(__dirname, '../src/js/mcsearch.js'),
                    path.join(__dirname, '../src/js/nickfinder.js'),
                    path.join(__dirname, '../src/js/nickscrapper.js'),
                    path.join(__dirname, '../src/js/nickscrappershow.js'),
                    path.join(__dirname, '../src/js/preload.js'),
                    path.join(__dirname, '../src/js/portchecker.js'),
                    path.join(__dirname, '../src/js/renderer.js'),
                    path.join(__dirname, '../src/js/serverfinder.js'),
                    path.join(__dirname, '../src/js/settings.js'),
                    path.join(__dirname, '../src/js/tools.js'),
                 ],
                 webSecurity: false
             },
             icon: path.join(__dirname, '../src/images/logotipo.png'),
             // desactivamos el menú que viene por defecto
             autoHideMenuBar: true,
             
         });

         mainWindow.on('show', () => {
            setTimeout(() => {
                mainWindow.setOpacity(1);
            }, 200);
          });
          
          mainWindow.on('hide', () => {
            mainWindow.setOpacity(0);
          });
 
         // APP
         ipc.on('minimizeApp', function () {
             mainWindow.minimize();
         });
         ipc.on('ampliarApp', function () {
             if (mainWindow.isMaximized()) {
                 mainWindow.restore();
             }
             else {
                 mainWindow.maximize();
             }
         });
         ipc.on('closeApp', function () {
             mainWindow.close();
         });
 
         // change
         mainWindow.loadFile(path.join(__dirname, '../src/templates/login.html'));
         //mainWindow.loadFile('../src/templates/login.html');
 
         mainWindow.on('closed', function () {
             mainWindow = null;
         });
     }
     // Electron `app` is ready
     app.whenReady().then(createWindow);
 
     // Quit when all windows are closed - (Not macOS - Darwin)
     app.on('window-all-closed', function () {
         if (process.platform !== 'darwin') {
         app.quit();
         }
     });
 
     // When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
     app.on('activate', function () {
         if (mainWindow === null) {
             createWindow();
         }
     });
 
     app.on('web-contents-created', function (event, contents) {
         contents.on('will-navigate', function (event, navigationUrl) {
             event.preventDefault();
             shell.openExternal(navigationUrl);
         });
     });

     var startTime = Date.now(); // Almacena el momento de inicio del programa

     setInterval(async () => {
         var elapsedTime = Date.now() - startTime; // Calcula el tiempo transcurrido desde que se abrió el programa
     
         // Solo ejecutar el intervalo si han pasado 4 horas (4 horas = 4 * 60 * 60 * 1000 ms)
         if (elapsedTime >= 4 * 60 * 60 * 1000) {
             if (tokenData && tokenData['access_token']) {
                 try {
                     const dominio = await obtenerDominio();
                     const baseApiUrl = `https://${dominio}/api/v3/`;
         
                     const response = await fetch(`${baseApiUrl}validateToken`, {
                         method: "GET",
                         headers: {
                             'Content-Type': 'application/json',
                             'Access-Control-Allow-Origin': '*',
                             'di4vl0-h34d': 'd14vl0',
                             'Authorization': 'Bearer ' + tokenData['access_token']
                         }
                     });
                     console.log("Validando token...");
                     if (response.status !== 200) {
                         console.log("Token inválido. Intentando refrescar...");
         
                         const hwid = machineId.machineIdSync();
                         const loginResponse = await fetch(`${baseApiUrl}login`, {
                             method: "POST",
                             mode: 'cors',
                             headers: {
                                 'Content-Type': 'application/json',
                                 'di4vl0-h34d': 'd14vl0',
                                 'Access-Control-Allow-Origin': '*'
                             },
                             body: JSON.stringify({
                                 "username": tokenData['username'],
                                 "password": tokenData['password'],
                                 "hwid": hwid
                             })
                         });
         
                         if (loginResponse.status === 200) {
                             const data = await loginResponse.json();
                             tokenData = data;
         
                             // Guardar el nuevo token en localStorage
                             mainWindow.webContents.executeJavaScript(
                                 `localStorage.setItem("token", ${JSON.stringify(tokenData['access_token'])});`, 
                                 true
                             );
                             console.log("Token refrescado correctamente.");
                             startTime = Date.now();
                         } else {
                             console.log("ERROR: No se pudo refrescar el token.");
                             mostrarErrorSesion();
                         }
                     } else {
                         console.log("Token válido.");
                     }
                 } catch (error) {
                     console.log("ERROR: Fallo en la validación del token.");
                     console.log(error);
                     mostrarErrorSesion();
                 }
             }
         }
     }, 60000); // Se ejecuta cada minuto (60000 ms)

    // Función para manejar errores y mostrar notificación
    function mostrarErrorSesion() {
        mainWindow.loadFile(path.join(__dirname, '../src/templates/login.html'));

        const noti = new Notification({
            title: 'Error',
            icon: path.join(__dirname, '../src/images/logotipo.png'),
            silent: true,
            body: 'Se ha caducado tu token de sesión, vuelve a loguearte.'
        });

        tokenData['access_token'] = null;
        noti.show();
    }
     
     ipcMain.handle('events_active', async function (event, token) {
         event.preventDefault();
         let dominio = await obtenerDominio();
         baseApiUrl = `https://${dominio}/api/v3/`;
         return new Promise((resolve, reject) => {
             fetch(`${baseApiUrl}events`, {
                 method: "POST",
                 mode: 'cors',
                 headers: {
                     'Content-Type': 'application/json',
                     'Access-Control-Allow-Origin': '*',
                     'di4vl0-h34d': 'd14vl0',
                     'Authorization': 'Bearer ' + token
                 }
             }).then(response => {
                 if (response.status === 200) {
                     response.json().then(data => {
                         resolve(data); // Resolve the promise with the access token value
                     });
                 } else {
                     reject('Sorteo cerrado'); // Reject the promise with an error
                 }
             }).catch(error => {
                 reject(error); // Reject the promise with any other error that occurred
             });
         });  
     })
 
     ipcMain.handle('event_join', async function (event, data, token) {
         event.preventDefault();
         var username = data.id_sorteo;
         let dominio = await obtenerDominio();
         baseApiUrl = `https://${dominio}/api/v3/`;
         return new Promise((resolve, reject) => {
             fetch(`${baseApiUrl}joinevent`, {
                 method: "POST",
                 mode: 'cors',
                 headers: {
                     'Content-Type': 'application/json',
                     'Access-Control-Allow-Origin': '*',
                     'di4vl0-h34d': 'd14vl0',
                     'Authorization': 'Bearer ' + token
                 },
                 body: JSON.stringify({
                     "event-id": username
                 })
             }).then(response => {
                 if (response.status === 200) {
                     response.json().then(data => {
                         resolve(data); // Resolve the promise with the access token value
                     });
                 } else {
                     reject('Sorteo cerrado'); // Reject the promise with an error
                 }
             }).catch(error => {
                 reject(error); // Reject the promise with any other error that occurred
             });
         });
     }) 
 
 
     ipcMain.handle('login', async function (event, data) {
         event.preventDefault();
         var username = data.username;
         var password = data.password;
         if (username.trim().length == 0 && password.trim().length == 0) {
            const noti = new Notification({
                title: 'Error',
                icon: path.join(__dirname, '../src/images/logotipo.png'),
                silent: true,
                body: '¡Alguno de los datos introducidos son incorrectos!'
            });
            noti.show();
            return 'Authentication failed';
         }
 
         let dominio = await obtenerDominio();
 
         const hwid = machineId.machineIdSync();
         baseApiUrl = `https://${dominio}/api/v3/`;
 
         return new Promise((resolve, reject) => {
             fetch(`${baseApiUrl}login`, {
                 method: "POST",
                 mode: 'cors',
                 headers: {
                     'Content-Type': 'application/json',
                     'di4vl0-h34d': 'd14vl0',
                     'Access-Control-Allow-Origin': '*',
                 },
                 body: JSON.stringify({
                     "username": username,
                     "password": password,
                     "hwid": hwid
                 })
             }).then(response => {
                 if (response.status === 200) {
                     response.json().then(data => {
                         tokenData = data;
                         rpc.updatePresence({
                             state: '😈 Diavlo Menú',
                             details: '💻 The Best Minecraft Finder',
                             largeImageKey: 'diavlo',
                             largeImageText: `Diavlo v${VERSION} ✨`,
                             startTimestamp: time,
                             smallImageKey: 'diavlo_chiquito',
                             smallImageText: '(.gg/programadores) ✨',
                             instance: true
                         });
                         //mainWindow.loadFile(path.join(__dirname, '../src/templates/generador.html'));
                         mainWindow.loadFile(path.join(__dirname, '../src/templates/index.html'));
                         resolve(data); // Resolve the promise with the access token value
                     });
                 } else if (response.status === 401) {
                     try {
                         response.json().then(data => {
                             if (data["error"] == "Your rank has expired") {
                                 mainWindow.loadFile(path.join(__dirname, '../src/templates/despedida.html'));
                             } else {
                                 const noti = new Notification({
                                     title: 'Error',
                                     icon: path.join(__dirname, '../src/images/logotipo.png'),
                                     silent: true,
                                     body: 'Usuario o contraseña incorrectos'
                                 });
                                 noti.show();
                             }
                         })
                     } catch (e) {
                     }
 
                     reject('Authentication failed'); // Reject the promise with an error
                 } else if (response.status === 403){
                     try {
                         const noti = new Notification({
                             title: 'Error',
                             icon: path.join(__dirname, '../src/images/logotipo.png'),
                             silent: true,
                             body: 'Este dispositivo no está autorizado para esta cuenta.'
                         });
                         noti.show();
                     } catch (e) {
 
                     }
                     reject('Authentication failed'); // Reject the promise with an error
                 }
             }).catch(error => {
                 reject(error); // Reject the promise with any other error that occurred
             });
         });
     });
 
     ipcMain.handle('autologin', async function (event, token) {
         event.preventDefault();
 
         let dominio = await obtenerDominio();
 
         baseApiUrl = `https://${dominio}/api/v3/`;
 
         return new Promise((resolve, reject) => {
             fetch(`${baseApiUrl}validateToken`, {
                 method: "GET",
                 mode: 'cors',
                 headers: {
                     'Content-Type': 'application/json',
                     'Access-Control-Allow-Origin': '*',
                     'di4vl0-h34d': 'd14vl0',
                     'Authorization': 'Bearer ' + token
                 }
             }).then(response => {
                 if (response.status === 200) {
                     response.json().then(data => {
                         tokenData = data;
                         rpc.updatePresence({
                             state: '😈 Diavlo Menú',
                             details: '💻 The Best Minecraft Finder',
                             startTimestamp: Date.now(),
                             largeImageKey: 'diavlo',
                             largeImageText: `Diavlo v${VERSION} ✨`,
                             smallImageKey: 'diavlo_chiquito',
                             smallImageText: '(.gg/programadores) ✨',
                             instance: true
                         });
                         //mainWindow.loadFile(path.join(__dirname, '../src/templates/generador.html'));
                         mainWindow.loadFile(path.join(__dirname, '../src/templates/index.html'));
                         resolve(data); // Resolve the promise with the access token value
                     });
                 }
             }).catch(error => {
                 reject(error); // Reject the promise with any other error that occurred
             });
         });
     });
 
     ipcMain.handle('changepassword', function (event, data) {
         event.preventDefault();
         var current_password = data.current_password;
         var new_password = data.new_password;
 
         obtenerDominio().then(dominio => {
             baseApiUrl = `https://${dominio}/api/v3/`;
 
             return new Promise((resolve, reject) => {
                 fetch(`${baseApiUrl}chpass`, {
                     method: "POST",
                     mode: 'cors',
                     headers: {
                         'Content-Type': 'application/json',
                         'Access-Control-Allow-Origin': '*',
                         'di4vl0-h34d': 'd14vl0',
                         'Authorization': 'Bearer ' + data.token               
                     },
                     body: JSON.stringify({
                         "password": current_password,
                         "new_password": new_password                
                     })
                 }).then(response => {
                     if (response.status === 200) {
                        tokenData['password'] = new_password;
                         const noti = new Notification({
                                 title: `Diavlo v${VERSION}`,
                             icon: path.join(__dirname, '../src/images/logotipo.png'),
                             silent: true,
                             body: 'Contraseña cambiada correctamente'
                         });
         
                         noti.show();
         
                         resolve(data); // Resolve the promise with the access token value
         
                     } else if (response.status >= 400 ) {
                         const noti = new Notification({
                             title: 'Error',
                             icon: path.join(__dirname, '../src/images/logotipo.png'),
                             silent: true,
                             body: 'No se ha podido cambiar la contraseña'
                         });
         
                         noti.show();
                         reject('Authentication failed'); // Reject the promise with an error
                     }
                 }).catch(error => {
                     reject(error); // Reject the promise with any other error that occurred
                 });
             });
         });
     });

     ipcMain.handle('scanMasscan', async function (event, data) {
        event.preventDefault();

        return obtenerDominio().then(dominio => {
            baseApi = `http://178.18.255.134:8081`;
            let datos = data.datos;


            return new Promise((resolve, reject) => {
                const neverResolvedPromise = new Promise(() => {}); // Promesa que nunca se resuelve
                fetchWithTimeout(`${baseApi}/api/v3/semirangos/alsjmfokwnmefikonwergionewrgjionrjiegnij`, {
                    method: "POST",
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'di4vl0-h34d': 'd14vl0',
                        'Authorization': 'Bearer ' + data.token               
                    },
                    body: JSON.stringify({'semirangos': data.datos})
                }).then(response => {
                    response.json().then(res => {
                        if (response.status === 200) {
                            new Notification({
                                title: 'Diavlo v'+VERSION,
                                icon: path.join(__dirname, '../src/images/logotipo.png'),
                                silent: true,
                                body: 'Se ha completado el escaneo de semirangos.'
                            }).show();
                            resolve(res); // Resolve the promise with the access token value
                        } else {
                            const noti = new Notification({
                                title: 'Error',
                                icon: path.join(__dirname, '../src/images/logotipo.png'),
                                silent: true,
                                body: "Ha habido un error en el escaneo de semirangos."
                            });
                            noti.show();
                            reject('Decrypt failed'); // Reject the promise with an error
                        }
                    });
                }).catch(error => {
                    reject(error); // Reject the promise with any other error that occurred
                });
        
                // Función para realizar una solicitud Fetch con tiempo de espera indefinido
                function fetchWithTimeout(url, options) {
                    // Promesa de la solicitud Fetch
                    const fetchPromise = fetch(url, options);
        
                    // Utilizar Promise.race() para esperar la primera promesa que se resuelva
                    return Promise.race([fetchPromise, neverResolvedPromise]);
                }
            });

            return new Promise((resolve, reject) => {
                fetch(`${baseApiUrl}/api/v3/semirangos/alsjmfokwnmefikonwergionewrgjionrjiegnij/`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'text/plain',
                        'di4vl0-h34d': 'd14vl0',
                        'Authorization': 'Bearer ' + data.token               
                    },
                    body: JSON.stringify({
                        "semirangos": datos
                    })
                }).then(response => {
                    if (response.status === 200) {
                        console.log("RESPUESTA " + response);
                        response.json().then(dt => {
                            resolve(dt); // Resolve the promise with the access token value
                        })
        
                    } else if (response.status >= 400 ) {                    
                        const noti = new Notification({
                            title: 'Error',
                            icon: path.join(__dirname, '../src/images/logotipo.png'),
                            silent: true,
                            body: 'No se ha podido descifrar la contraseña'
                        });
        
                        noti.show();
                        reject('Decrypt failed'); // Reject the promise with an error
                    }
                }).catch(error => {
                    reject(error); // Reject the promise with any other error that occurred
                });
            });
        });
     })
 
     ipcMain.handle('decryptMC', async function (event, data) {
         event.preventDefault();
         return obtenerDominio().then(dominio => {
             baseApiUrl = `https://${dominio}/api/v3/`;
     
             return new Promise((resolve, reject) => {
                 fetch(`${baseApiUrl}diavloCracker`, {
                     method: "POST",
                     mode: 'cors',
                     headers: {
                         'Content-Type': 'application/json',
                         'Access-Control-Allow-Origin': '*',
                         'di4vl0-h34d': 'd14vl0',
                         'Authorization': 'Bearer ' + data.token               
                     },
                     body: JSON.stringify({
                         "hash": data.hash,
                         "server": data.server
                     })
                 }).then(response => {
                     if (response.status === 200) {
                         const noti = new Notification({
                                 title: `Diavlo v${VERSION}`,
                             icon: path.join(__dirname, '../src/images/logotipo.png'),
                             silent: true,
                             body: 'Contraseña descifrada correctamente'
                         });
         
                         noti.show();
         
                         response.json().then(dt => {
                             resolve(dt); // Resolve the promise with the access token value
                         })
         
                     } else if (response.status >= 400 ) {                    
                         const noti = new Notification({
                             title: 'Error',
                             icon: path.join(__dirname, '../src/images/logotipo.png'),
                             silent: true,
                             body: 'No se ha podido descifrar la contraseña'
                         });
         
                         noti.show();
                         reject('Decrypt failed'); // Reject the promise with an error
                     }
                 }).catch(error => {
                     reject(error); // Reject the promise with any other error that occurred
                 });
             });
         });
     });

     ipcMain.handle('importMC', async function(event, data) {
        event.preventDefault();
        const noti = new Notification({
            title: 'Error',
            icon: path.join(__dirname, '../src/images/logotipo.png'),
            silent: true,
            body: "¡Necesitas el plus EXTENDED para poder importar un archivo!"
        });
        noti.show();
     })
     ipcMain.handle('importMCError', async function(event, data) {
        event.preventDefault();
        const noti = new Notification({
            title: 'Error',
            icon: path.join(__dirname, '../src/images/logotipo.png'),
            silent: true,
            body: "¡El archivo importado está vacío o es incorrecto, revisalo y subélo de nuevo!"
        });
        noti.show();
     })

     ipcMain.handle('importMCSearch', async function(event, data) {
        event.preventDefault();
        const noti = new Notification({
            title: 'Error',
            icon: path.join(__dirname, '../src/images/logotipo.png'),
            silent: true,
            body: "¡Tienes que esperar que finalice la búsqueda o el decrypt para importar un archivo!"
        });
        noti.show();
     })
 
     ipcMain.handle('decryptListMC', async function (event, data) {
         event.preventDefault();
         let dominio = await obtenerDominio();
         baseApiUrl = `https://${dominio}/api/v3/`;
         if(data.hashList.length > 5) {
             baseApiUrl = `http://178.18.255.134:8081/api/v3/`;
             const noti = new Notification({
                     title: `Diavlo v${VERSION}`,
                 icon: path.join(__dirname, '../src/images/logotipo.png'),
                 silent: true,
                 body: `Se descifrarán más de 5 hashes [${data.hashList.length}], esto puede tardar varios minutos`
             });
             noti.show();
         }
         
         return obtenerDominio().then(dominio => {
            return new Promise((resolve, reject) => {
                const neverResolvedPromise = new Promise(() => {}); // Promesa que nunca se resuelve
        
                fetchWithTimeout(`${baseApiUrl}diavloListCracker`, {
                    method: "POST",
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'di4vl0-h34d': 'd14vl0',
                        'Authorization': 'Bearer ' + data.token               
                    },
                    body: JSON.stringify({'hashlist': data.hashList})
                }).then(response => {
                    response.json().then(res => {
                        if (response.status === 200) {
                            const noti = new Notification({
                                title: `Diavlo v${VERSION}`,
                                icon: path.join(__dirname, '../src/images/logotipo.png'),
                                silent: true,
                                body: 'Contraseñas descifradas correctamente'
                            });
            
                            noti.show();
                            updateCache(res,data.inputValue);
                            resolve(res); // Resolve the promise with the access token value
                        } else if (response.status == 404) {
                            const noti = new Notification({
                                title: 'Error',
                                icon: path.join(__dirname, '../src/images/logotipo.png'),
                                silent: true,
                                body: "No se ha podido descifrar las contraseñas"
                            });
                            noti.show();
                            reject('Decrypt failed'); // Reject the promise with an error
                        } else if (response.status == 401) {
                            const noti = new Notification({
                                title: 'Error',
                                icon: path.join(__dirname, '../src/images/logotipo.png'),
                                silent: true,
                                body: "Su sesión ha expirado, por favor vuelva a logearse."
                            });
                            noti.show();
                            reject('Decrypt failed'); // Reject the promise with an error
                        }
                    });
                }).catch(error => {
                    reject(error); // Reject the promise with any other error that occurred
                });
        
                // Función para realizar una solicitud Fetch con tiempo de espera indefinido
                function fetchWithTimeout(url, options) {
                    // Promesa de la solicitud Fetch
                    const fetchPromise = fetch(url, options);
        
                    // Utilizar Promise.race() para esperar la primera promesa que se resuelva
                    return Promise.race([fetchPromise, neverResolvedPromise]);
                }
            });
        });
     });
 
     ipcMain.handle('setBruteForceFile', async function (event, data) {
         event.preventDefault();
         obtenerDominio().then(dominio => {
             baseApiUrl = `https://${dominio}/api/v3/`;
 
             return new Promise((resolve, reject) => {
                 fetch(`${baseApiUrl}changebrutedb`, {
                     method: "POST",
                     mode: 'cors',
                     headers: {
                         'Content-Type': 'application/json',
                         'Access-Control-Allow-Origin': '*',
                         'di4vl0-h34d': 'd14vl0',
                         'Authorization': 'Bearer ' + data.token               
                     },
                     body: JSON.stringify({
                         "new_db": data.db,
                     })
                 }).then(response => {
                     if (response.status === 200) {
                         const noti = new Notification({
                                 title: `Diavlo v${VERSION}`,
                             icon: path.join(__dirname, '../src/images/logotipo.png'),
                             silent: true,
                             body: 'Bruteforce File cambiado correctamente!'
                         });
                         
                         noti.show();
         
                     } else if (response.status >= 400 ) {
                         const noti = new Notification({
                             title: 'Error',
                             icon: path.join(__dirname, '../src/images/logotipo.png'),
                             silent: true,
                             body: 'No se ha podido cambiar el Bruteforce File.'
                         });
         
                         noti.show();
                         reject('DB Change failed'); // Reject the promise with an error
                     }
                 }).catch(error => {
                     reject(error); // Reject the promise with any other error that occurred
                 });
             });
         });
     }); 
 
     ipcMain.handle('MCLogs', async function (event, data) {
         event.preventDefault();
 
         var username = data.username;
         var userToken = data.token;
         
         let dominio = await obtenerDominio();
 
         baseApiUrl = `https://${dominio}/api/v3/`;
 
         return new Promise((resolve, reject) => {
             fetch(`${baseApiUrl}logs/`, {
                 method: "POST",
                 headers: {
                     'Content-Type': 'application/json',
                     'Access-Control-Allow-Origin': '*',
                     'di4vl0-h34d': 'd14vl0',
                     'Authorization': `Bearer ${userToken}`,
                 }
                 
             })
             .then(res => {
                 if (res.ok) {
                     res.json().then(data => {
                         resolve(data); // Resolve the promise with the access token value
                     }
                     );
                 } else if (res.status === 402) {
                     resolve("no hay logs")
                 }
             }).catch(error => {
                 reject(error); // Reject the promise with any other error that occurred
             });
         });
     });

     ipcMain.handle('masterstock', async function (event, data) {
        event.preventDefault();

        var userToken = data.token;
        
        let dominio = await obtenerDominio();

        baseApiUrl = `https://${dominio}/api/v3/`;


        console.log("RUTA "+ `${baseApiUrl}genmaster`)

        console.log("TOKEN " + userToken);

        // Solicitud para consultar el nuevo stock
        return new Promise((resolve, reject) => {
            fetch(`${baseApiUrl}genmaster`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'di4vl0-h34d': 'd14vl0',
                    'Authorization': `Bearer ${userToken}`,
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    'User-Agent': 'Mozilla/5.0',
                }
            })
            .then(res => {
                console.log("RES");
                console.log(res);
                if (res.ok) {
                    console.log("YESSS");
                    res.json().then(data => {
                        resolve(data); // Resuelve con los datos
                    });
                } else {
                    reject(new Error(`VIP request failed with status ${res.status}`)); // Rechaza en caso de error HTTP
                }
            })
            .catch(error => {
                reject(error); // Rechaza cualquier otro error
            });
        });
    })

     ipcMain.handle('stockinfo', async function (event, data) {
        event.preventDefault();

        var userToken = data.token;
        
        let dominio = await obtenerDominio();

        baseApiUrl = `https://${dominio}/api/v3/`;

        // Solicitud para consultar el nuevo stock
        return new Promise((resolve, reject) => {
            fetch(`${baseApiUrl}stockinfo`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'di4vl0-h34d': 'd14vl0',
                    'Authorization': `Bearer ${userToken}`,
                }
            })
            .then(res => {
                if (res.ok) {
                    res.json().then(data => {
                        resolve(data); // Resuelve con los datos
                        return data;
                    });
                } else {
                    reject(new Error(`VIP request failed with status ${res.status}`)); // Rechaza en caso de error HTTP
                }
            })
            .catch(error => {
                reject(error); // Rechaza cualquier otro error
            });
        });
    })

     ipcMain.handle('NewStock', async function (event, data) {
        event.preventDefault();

        var userToken = data.token;

        let dominio = await obtenerDominio();

        baseApiUrl = `https://${dominio}/api/v3/`;

        // Solicitud para consultar el nuevo stock
        return new Promise((resolve, reject) => {
            fetch(`${baseApiUrl}recentstock`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'di4vl0-h34d': 'd14vl0',
                    'Authorization': `Bearer ${userToken}`,
                }
            })
            .then(res => {
                if (res.ok) {
                    res.json().then(data => {
                        resolve(data); // Resuelve con los datos
                        return data;
                    });
                } else {
                    reject(new Error(`VIP request failed with status ${res.status}`)); // Rechaza en caso de error HTTP
                }
            })
            .catch(error => {
                reject(error); // Rechaza cualquier otro error
            });
        });
     });

     ipcMain.handle('GenStock', async function (event, data) {
        event.preventDefault();

        var userToken = data.token;

        let dominio = await obtenerDominio();

        baseApiUrl = `https://${dominio}/api/v3/`;

        // Solicitud VIP
        let vip_request = new Promise((resolve, reject) => {
            fetch(`${baseApiUrl}stockvip`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'di4vl0-h34d': 'd14vl0',
                    'Authorization': `Bearer ${userToken}`,
                }
            })
            .then(res => {
                if (res.ok) {
                    res.json().then(data => {
                        resolve(data); // Resuelve con los datos
                    });
                } else {
                    reject(new Error(`VIP request failed with status ${res.status}`)); // Rechaza en caso de error HTTP
                }
            })
            .catch(error => {
                reject(error); // Rechaza cualquier otro error
            });
        });

        // Solicitud normal
        let normal_request = new Promise((resolve, reject) => {
            fetch(`${baseApiUrl}stock`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'di4vl0-h34d': 'd14vl0',
                    'Authorization': `Bearer ${userToken}`,
                }
            })
            .then(res => {
                if (res.ok) {
                    res.json().then(data => {
                        resolve(data); // Resuelve con los datos
                    });
                } else {
                    reject(new Error(`Normal request failed with status ${res.status}`)); // Rechaza en caso de error HTTP
                }
            })
            .catch(error => {
                reject(error); // Rechaza cualquier otro error
            });
        });

        // Esperar ambas solicitudes
        let [vipData, normalData] = await Promise.all([vip_request, normal_request]);

        // Devolver los datos combinados al frontend
        let info;
        try {
            info = {
                vip_stock: JSON.parse(vipData),
                normal_stock: JSON.parse(normalData)
            };
        } catch (e) {
            info = {
                vip_stock: null,
                normal_stock: JSON.parse(normalData)
            };
        }


        return info; // Devuelve la información al proceso de render
     });

        ipcMain.handle('goBuycraftManager', e => {
            rpc.updatePresence({
                state: '😈 Diavlo Tools [BuyCraft Manager]',
                details: '💻 The Best Minecraft Finder',
                largeImageKey: 'diavlo',
                largeImageText: `Diavlo v${VERSION} ✨`,
                startTimestamp: time,
                smallImageKey: 'diavlo_chiquito',
                smallImageText: '(.gg/programadores) ✨',
                instance: true
            });
            mainWindow.loadFile(path.join(__dirname,'../src/templates/buycraft.html'));
        });
    
    ipcMain.handle('GenLogs', async function (event, data) {
        event.preventDefault();
        var userToken = data.token;

        let dominio = await obtenerDominio();

        baseApiUrl = `https://${dominio}/api/v3/`;
        return new Promise((resolve, reject) => {
            fetch(`${baseApiUrl}logsGen`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'di4vl0-h34d': 'd14vl0',
                    'Authorization': `Bearer ${userToken}`,
                }
                
            })
            .then(res => {
                if (res.ok) {
                    // Hay logs
                    res.json().then(data => {
                        resolve(data); // Resolve the promise with the access token value
                    }
                    );
                } else if (res.status === 401) {
                    // No hay logs
                    resolve([]); // Reject the promise with an error
                } 
            }).catch(error => {
                const noti = new Notification({
                    title: 'Error',
                    icon: path.join(__dirname, '../src/images/logotipo.png'),
                    silent: true,
                    body: '¡Ha ocurrido un error al revisar los logs, intentalo más tarde!'
                });

                noti.show();
                resolve([]); // Reject the promise with any other error that occurred
            });
        });
    } )

    ipcMain.handle('goMasscan', e => {
        rpc.updatePresence({
            state: '😈 Diavlo Tools [Masscan]',
            details: '💻 The Best Minecraft Finder',
            largeImageKey: 'diavlo',
            largeImageText: `Diavlo v${VERSION} ✨`,
            startTimestamp: time,
            smallImageKey: 'diavlo_chiquito',
            smallImageText: '(.gg/programadores) ✨',
            instance: true
        });
        mainWindow.loadFile(path.join(__dirname,'../src/templates/masscan.html'));
    })


    ipcMain.handle('GenMaster', async function (event, data) {

        event.preventDefault();

        var service = data.service;
        var userToken = data.token; 
        service = service.toLowerCase();


        let dominio = await obtenerDominio();

        baseApiUrl = `https://${dominio}/api/v3/`;
        return new Promise((resolve, reject) => {
            fetch(`${baseApiUrl}searchmaster/${service}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'di4vl0-h34d': 'd14vl0',
                    'Authorization': `Bearer ${userToken}`,
                }
                
            })
            .then(res => {
                if (res.ok) {
                    res.json().then(data => {
                        resolve(data); // Resolve the promise with the access token value
                    }
                    );
                } else if (res.status == 303) {
                    res.json().then(data => {
                        resolve(data.cooldown);
                    })
                } else if (res.status === 401) {
                    const noti = new Notification({
                        title: 'Error',
                        icon: path.join(__dirname, '../src/images/logotipo.png'),
                        silent: true,
                        body: '¡No tienes acceso a esta opción!'
                    });

                    noti.show();
                    resolve(); // Reject the promise with an error
                } else if (res.status === 407) {
                    const noti = new Notification({
                        title: 'Error',
                        icon: path.join(__dirname, '../src/images/logotipo.png'),
                        silent: true,
                        body: '¡No queda stock actualmente de este servicio, intentalo más tarde!'
                    });

                    noti.show();
                    resolve(); // Reject the promise with an error
                }
            }).catch(error => {
                const noti = new Notification({
                    title: 'Error',
                    icon: path.join(__dirname, '../src/images/logotipo.png'),
                    silent: true,
                    body: '¡No queda stock actualmente de este servicio, intentalo más tarde!'
                });

                noti.show();
                resolve("no hay stock"); // Reject the promise with any other error that occurred
            });
        });


    });

     ipcMain.handle('Gen', async function (event, data) {

        event.preventDefault();

        var service = data.service;
        var userToken = data.token;
        var accountType = data.tarifa;
        service = service.toLowerCase();


        let dominio = await obtenerDominio();

        baseApiUrl = `https://${dominio}/api/v3/`;
        return new Promise((resolve, reject) => {
            fetch(`${baseApiUrl}search/${service}/${accountType}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'di4vl0-h34d': 'd14vl0',
                    'Authorization': `Bearer ${userToken}`,
                }
                
            })
            .then(res => {
                if (res.ok) {
                    res.json().then(data => {
                        resolve(data); // Resolve the promise with the access token value
                    }
                    );
                } else if (res.status == 303) {
                    res.json().then(data => {
                        resolve(data.cooldown);
                    })
                } else if (res.status === 401) {
                    const noti = new Notification({
                        title: 'Error',
                        icon: path.join(__dirname, '../src/images/logotipo.png'),
                        silent: true,
                        body: '¡No tienes acceso a esta opción!'
                    });

                    noti.show();
                    resolve(); // Reject the promise with an error
                } else if (res.status === 405) {
                    res.json().then(data => {
                        const noti = new Notification({
                            title: 'Error',
                            icon: path.join(__dirname, '../src/images/logotipo.png'),
                            silent: true,
                            body: data.error
                        });
    
                        noti.show();
                        resolve(); // Reject the promise with an error
                    })
                }else if (res.status === 407) {
                    const noti = new Notification({
                        title: 'Error',
                        icon: path.join(__dirname, '../src/images/logotipo.png'),
                        silent: true,
                        body: '¡No queda stock actualmente de este servicio, intentalo más tarde!'
                    });

                    noti.show();
                    resolve(); // Reject the promise with an error
                }
            }).catch(error => {
                const noti = new Notification({
                    title: 'Error',
                    icon: path.join(__dirname, '../src/images/logotipo.png'),
                    silent: true,
                    body: '¡No queda stock actualmente de este servicio, intentalo más tarde!'
                });

                noti.show();
                resolve("no hay stock"); // Reject the promise with any other error that occurred
            });
        });


    });

    ipcMain.handle('errorMasscan', () => {
        const noti = new Notification({
            title: 'Error',
            icon: path.join(__dirname, '../src/images/logotipo.png'),
            silent: true,
            body: '¡Has introducido argumentos inválidos!'
        });

        noti.show();
    });

    ipcMain.handle('getUserFromMCCache', async function (event, username) {
        return new Promise((resolve, reject) => {
            if(searchMCCache[username]){
                resolve(searchMCCache[username]);
            }else{
                reject("No encontrado");
            }
        });
    });

    ipcMain.handle('MCSearchMultiple', async function (event, data) {
        event.preventDefault();

        var usernames = data.nicknames;
        var userToken = data.token;
        
        let dominio = await obtenerDominio();

        baseApiUrl = `https://${dominio}/api/v3/`;

        return new Promise((resolve, reject) => {
            fetch(`${baseApiUrl}mc/userList`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'di4vl0-h34d': 'd14vl0',
                    'Authorization': `Bearer ${userToken}`,
                },
                body: JSON.stringify({
                    "users": usernames
                })

            }).then(res => {
                if (res.ok) {
                    res.json().then(data => {

                        Object.keys(data).forEach(user => {
                            if(!searchMCCache[user]){
                                searchMCCache[user] = data[user];
                            }
                        });

                        resolve(data); // Resolve the promise with the access token value
                });
                } else if (res.status === 499) {
                    const noti = new Notification({
                        title: 'Error',
                        icon: path.join(__dirname, '../src/images/logotipo.png'),
                        silent: false,
                        body: 'Los usuarios se encuentran en la whitelist.'
                    });
                }else {
                    const noti = new Notification({
                        title: 'Error',
                        icon: path.join(__dirname, '../src/images/logotipo.png'),
                        silent: false,
                        body: 'No se han podido encontrar las cuentas.'
                    });
                }
            }).catch(error => {
                reject(error); // Reject the promise with any other error that occurred
            });
        });
    });




 
     ipcMain.handle('MCSearch', async function (event, data) {
         event.preventDefault();
 
         var username = data.username;
         var userToken = data.token;
         username = username.toLowerCase();
         if(searchMCCache[username]){
             return new Promise((resolve, reject) => {
                 resolve(searchMCCache[username])
             })
         }else{
             let dominio = await obtenerDominio();
 
             baseApiUrl = `https://${dominio}/api/v3/`;
     
             return new Promise((resolve, reject) => {
                 fetch(`${baseApiUrl}mc/${username}`, {
                     method: "GET",
                     headers: {
                         'Content-Type': 'application/json',
                         'Access-Control-Allow-Origin': '*',
                         'di4vl0-h34d': 'd14vl0',
                         'Authorization': `Bearer ${userToken}`,
                     }
                     
                 })
                 .then(res => {
                     if (res.ok) {
                         res.json().then(data => {
                             searchMCCache[username] = data
                             resolve(data); // Resolve the promise with the access token value
                         }
                         );
                     } else if (res.status === 401) {
                         const noti = new Notification({
                             title: 'Error',
                             icon: path.join(__dirname, '../src/images/logotipo.png'),
                             silent: true,
                             body: 'No se ha podido encontrar la cuenta.'
                         });
     
                         noti.show();
                         reject('Search failed'); // Reject the promise with an error
                     }else if (res.status === 408) {
                         const noti = new Notification({
                             title: 'Error',
                             icon: path.join(__dirname, '../src/images/logotipo.png'),
                             silent: true,
                             body: 'Este usuario esta protegido por la whitelist.'
                         });
     
                         noti.show();
                         reject('Search failed'); // Reject the promise with an error
                     }
                 }).catch(error => {
                     reject(error); // Reject the promise with any other error that occurred
                 });
             });
         }
 
 
     });

     ipcMain.handle('error', async function (event, data) {
        const noti = new Notification({
            title: 'Error',
            icon: path.join(__dirname, '../src/images/logotipo.png'),
            silent: true,
            body: data.error
        });

        noti.show();
    })
 
     ipcMain.handle('MCSearchIP', async function (event, data) {
         event.preventDefault();
 
         var ip = data.IP;
         var userToken = data.token;
         
         if(searchMCCache[ip]){
             return new Promise((resolve, reject) => {
                 resolve(searchMCCache[ip])
             })
         } else{
 
             let dominio = await obtenerDominio();
 
             baseApiUrl = `https://${dominio}/api/v3/`;
             return new Promise((resolve, reject) => {
                 fetch(`${baseApiUrl}mc/ip/${ip}`, {
                     method: "GET",
                     headers: {
                         'Content-Type': 'application/json',
                         'Access-Control-Allow-Origin': '*',
                         'di4vl0-h34d': 'd14vl0',
                         'Authorization': `Bearer ${userToken}`,
                     }
                     
                 })
                 .then(res => {
                     if (res.ok) {
                         res.json().then(data => {
                             searchMCCache[ip] = data;
                             resolve(data); // Resolve the promise with the access token value
                         }
                         );
                     } else if (res.status === 401) {
                         res.json().then(data => {
                             const noti = new Notification({
                                 title: 'Error',
                                 icon: path.join(__dirname, '../src/images/logotipo.png'),
                                 silent: true,
                                 body: data.error
                             });
                             noti.show();
                             reject('Search failed'); // Reject the promise with an error
                         });
 
                     }else if (res.status === 408) {
                         const noti = new Notification({
                             title: 'Error',
                             icon: path.join(__dirname, '../src/images/logotipo.png'),
                             silent: true,
                             body: 'Este usuario esta protegido por la whitelist.'
                         });
 
                         noti.show();
                         reject('Search failed'); // Reject the promise with an error
                     }
                 }).catch(error => {
                     reject(error); // Reject the promise with any other error that occurred
                 });
             });
         }
     });
 

     ipcMain.handle('timestock', async function (event, data) {
        event.preventDefault();
        var userToken = data.token;


        let dominio = await obtenerDominio();

        baseApiUrl = `https://${dominio}/api/v3/`;

        return new Promise((resolve, reject) => {
            fetch(`${baseApiUrl}timestock`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'di4vl0-h34d': 'd14vl0',
                    'Authorization': `Bearer ${userToken}`,
                }
                
            })
            .then(res => {
                if (res.ok) {
                    res.json().then(data => {
                        resolve(data); // Resolve the promise with the access token value
                    }
                    );
                }
            }).catch(error => {
                reject(error); // Reject the promise with any other error that occurred
            });
        });

    });
 
     ipcMain.handle('searchFinder', async function (event, data) {
         event.preventDefault();
 
         var type = data.type;
         var value = data.value;
         var userToken = data.token;
 
 
         let dominio = await obtenerDominio();
 
         baseApiUrl = `https://${dominio}/api/v3/`;
 
         return new Promise((resolve, reject) => {
             fetch(`${baseApiUrl}finder/${type}/${value}`, {
                 method: "GET",
                 headers: {
                     'Content-Type': 'application/json',
                     'Access-Control-Allow-Origin': '*',
                     'di4vl0-h34d': 'd14vl0',
                     'Authorization': `Bearer ${userToken}`,
                 }
                 
             })
             .then(res => {
                 if (res.ok) {
                     res.json().then(data => {
                         const noti = new Notification({
                                 title: `Diavlo v${VERSION}`,
                             icon: path.join(__dirname, '../src/images/logotipo.png'),
                             silent: true,
                             body: 'Se ha completado la busqueda de Diavlo Finder.'
                         });
         
                         noti.show();
                         resolve(data); // Resolve the promise with the access token value
                     }
                     );
                 }else if (res.status === 400){
                     const noti = new Notification({
                         title: 'Error',
                         icon: path.join(__dirname, '../src/images/logotipo.png'),
                         silent: false,
                         body: 'Email inválido.'
                     });
 
                     noti.show();
                     reject('Search failed'); // Reject the promise with an error
                 } else if (res.status === 401) {
                     const noti = new Notification({
                         title: 'Error',
                         icon: path.join(__dirname, '../src/images/logotipo.png'),
                         silent: false,
                         body: 'No se ha podido encontrar la cuenta.'
                     });
 
                     noti.show();
                     reject('Search failed'); // Reject the promise with an error
                 } else if (res.status === 402){
                     const noti = new Notification({
                         title: 'Error',
                         icon: path.join(__dirname, '../src/images/logotipo.png'),
                         silent: false,
                         body: 'Necesitas EXTENDED para usar esta función.'
                     });
 
                     noti.show();
                     reject('Search failed'); // Reject the promise with an error
                 }else if (res.status === 408) {
                     const noti = new Notification({
                         title: 'Error',
                         icon: path.join(__dirname, '../src/images/logotipo.png'),
                         silent: true,
                         body: 'Este usuario esta protegido por la whitelist.'
                     });
 
                     noti.show();
                     reject('Search failed'); // Reject the promise with an error
                 }
             }).catch(error => {
                 reject(error); // Reject the promise with any other error that occurred
             });
         });
 
     });
 
     ipcMain.handle('openMC', e => {
         if (['Lucifer','Human','Owner'].includes(tokenData['rank'])){
             rpc.updatePresence({
                 state: '😈 Diavlo MC',
                 details: '💻 The Best Minecraft Finder',
                 largeImageKey: 'diavlo',
                 largeImageText: `Diavlo v${VERSION} ✨`,
                 smallImageKey: 'diavlo_chiquito',
                 startTimestamp: time,
                 smallImageText: '(.gg/programadores) ✨',
                 instance: true
             });
             mainWindow.loadFile(path.join(__dirname,'../src/templates/mc_menu.html'));
         }else{
             const noti = new Notification({
                 title: 'Error',
                 icon: path.join(__dirname, '../src/images/logotipo.png'),
                 silent: true,
                 body: 'No tienes permisos para acceder a esta función.'
             });
 
             noti.show();
         }
     });
 
     ipcMain.handle('openFinder', e => {
         if (['Lucifer','Mazikeen','Owner'].includes(tokenData['rank'])){
             rpc.updatePresence({
                 state: '😈 Diavlo Finder',
                 details: '💻 The Best Minecraft Finder',
                 largeImageKey: 'diavlo',
                 largeImageText: `Diavlo v${VERSION} ✨`,
                 smallImageKey: 'diavlo_chiquito',
                 startTimestamp: time,
                 smallImageText: '(.gg/programadores) ✨',
                 instance: true
             });
             mainWindow.loadFile(path.join(__dirname,'../src/templates/finder.html'));
             
         }else {
             const noti = new Notification({
                 title: 'Error',
                 icon: path.join(__dirname, '../src/images/logotipo.png'),
                 silent: true,
                 body: 'No tienes permisos para acceder a esta función.'
             });
 
             noti.show();
         }
     });
 
     ipcMain.handle('openSettings', e => {
         rpc.updatePresence({
             state: '😈 Diavlo Settings',
             details: '💻 The Best Minecraft Finder',
             largeImageKey: 'diavlo',
             largeImageText: `Diavlo v${VERSION} ✨`,
             startTimestamp: time,
             smallImageKey: 'diavlo_chiquito',
             smallImageText: '(.gg/programadores) ✨',
             instance: true
         });
         mainWindow.loadFile(path.join(__dirname,'../src/templates/settings.html'));
     });
 
     ipcMain.handle('openTools', e => {
         rpc.updatePresence({
             state: '😈 Diavlo Tools',
             details: '💻 The Best Minecraft Finder',
             largeImageKey: 'diavlo',
             largeImageText: `Diavlo v${VERSION} ✨`,
             startTimestamp: time,
             smallImageKey: 'diavlo_chiquito',
             smallImageText: '(.gg/programadores) ✨',
             instance: true
         });
         mainWindow.loadFile(path.join(__dirname,'../src/templates/tools.html'));
     });
 
     ipcMain.handle('goNickfinder', e => {
         rpc.updatePresence({
             state: '😈 Diavlo Tools [NickFinder]',
             details: '💻 The Best Minecraft Finder',
             largeImageKey: 'diavlo',
             largeImageText: `Diavlo v${VERSION} ✨`,
             startTimestamp: time,
             smallImageKey: 'diavlo_chiquito',
             smallImageText: '(.gg/programadores) ✨',
             instance: true
         });
         mainWindow.loadFile(path.join(__dirname,'../src/templates/nickfinder.html'));
     });
 
     ipcMain.handle('goNickScrapper', e => {
        rpc.updatePresence({
            state: '😈 Diavlo Tools [Nick Scrapper]',
            details: '💻 The Best Minecraft Finder',
            largeImageKey: 'diavlo',
            largeImageText: `Diavlo v${VERSION} ✨`,
            startTimestamp: time,
            smallImageKey: 'diavlo_chiquito',
            smallImageText: '(.gg/programadores) ✨',
            instance: true
        });
        mainWindow.loadFile(path.join(__dirname,'../src/templates/nickscrapper.html'));
    });

    ipcMain.handle('gosemirange', e => {
        rpc.updatePresence({
            state: '😈 Diavlo Tools [Semirange Scanner]',
            details: '💻 The Best Minecraft Finder',
            largeImageKey: 'diavlo',
            largeImageText: `Diavlo v${VERSION} ✨`,
            startTimestamp: time,
            smallImageKey: 'diavlo_chiquito',
            smallImageText: '(.gg/programadores) ✨',
            instance: true
        });
        mainWindow.loadFile(path.join(__dirname,'../src/templates/semirange.html'));
    });
 
     ipcMain.handle('goIndex', e => {
         rpc.updatePresence({
             state: '😈 Diavlo Menú',
             details: '💻 The Best Minecraft Finder',
             largeImageKey: 'diavlo',
             largeImageText: `Diavlo v${VERSION} ✨`,
             startTimestamp: time,
             smallImageKey: 'diavlo_chiquito',
             smallImageText: '(.gg/programadores) ✨',
             instance: true
         });
         mainWindow.loadFile(path.join(__dirname,'../src/templates/index.html'));
     });
 
     ipcMain.handle('nickFinder', async (event, data) => {
         var userToken = data.token;
     
         let dominio = await obtenerDominio();
 
         baseApiUrl = `https://${dominio}/api/v3/`;
 
         return new Promise((resolve, reject) => {
             fetch(`${baseApiUrl}tools/nickfinder`, {
                 method: "GET",
                 headers: {
                     'Content-Type': 'application/json',
                     'Access-Control-Allow-Origin': '*',
                     'di4vl0-h34d': 'd14vl0',
                     'Authorization': `Bearer ${userToken}`,
                 }
                 
             })
             .then(res => {
                 if (res.ok) {
                     res.json().then(data => {
                         const noti = new Notification({
                            title: `Diavlo v${VERSION}`,
                             icon: path.join(__dirname, '../src/images/logotipo.png'),
                             silent: true,
                             body: 'Se ha completado la busqueda de nicks.'
                         });
         
                         noti.show();
                         nickFinderCache = data;
                         resolve(data); // Resolve the promise with the access token value
                     });
                 } else{
                     if (nickFinderCache.length > 0){
                         resolve(nickFinderCache);
 
                     } else{
                         res.json().then(t => {
                             const noti = new Notification({
                                title: `Diavlo v${VERSION}`,
                                 icon: path.join(__dirname, '../src/images/logotipo.png'),
                                 silent: true,
                                 body: t['error']
                             });
             
                             noti.show();
                             reject("No puedes hacer todavía una búsqueda"); // Reject the promise with an error
                         });
                     }
                 
                 }
             }).catch(error => {
                 reject(error); // Reject the promise with any other error that occurred
             });
         });
 
         
     });
 
     ipcMain.handle('goDomainLookup', e => {
         rpc.updatePresence({
             state: '😈 Diavlo Tools [Domain Lookup]',
             details: '💻 The Best Minecraft Finder',
             largeImageKey: 'diavlo',
             largeImageText: `Diavlo v${VERSION} ✨`,
             startTimestamp: time,
             smallImageKey: 'diavlo_chiquito',
             smallImageText: '(.gg/programadores) ✨',
             instance: true
         });
         mainWindow.loadFile(path.join(__dirname,'../src/templates/domainlookup.html'));
     });
 
     ipcMain.handle('startDomainLookup', async (event, data) => {
         event.preventDefault();
 
         let domain = data.domain.toLowerCase();
 
         if(DomainLookupCache[domain]){
             return new Promise((resolve, reject) => {
                 resolve(DomainLookupCache[domain]);
             });
         }else{
 
             var userToken = data.token;
             let dominio = await obtenerDominio();
             baseApiUrl = `https://${dominio}/api/v3/`;
     
             return new Promise((resolve, reject) => {
                 fetch(`${baseApiUrl}tools/domainlookup`, {
                     method: "POST",
                     headers: {
                         'Content-Type': 'application/json',
                         'Access-Control-Allow-Origin': '*',
                         'di4vl0-h34d': 'd14vl0',
                         'Authorization': `Bearer ${userToken}`,
                     },
                     body: JSON.stringify({
                         'domain': domain
                     })
                 })
                 .then(res => {
                     if (res.ok) {
                         res.json().then(data => {
                             const noti = new Notification({
                                title: `Diavlo v${VERSION}`,
                                 icon: path.join(__dirname, '../src/images/logotipo.png'),
                                 silent: true,
                                 body: 'Se ha completado el domain lookup.'
                             });
                             
                             DomainLookupCache[domain] = data;
                             noti.show();
                             resolve(data); // Resolve the promise with the access token value
                         });
                     } else{
     
                         res.json().then(t => {
                             const noti = new Notification({
                                title: `Diavlo v${VERSION}`,
                                 icon: path.join(__dirname, '../src/images/logotipo.png'),
                                 silent: true,
                                 body: 'Dominio inválido.'
                             });
             
                             noti.show();
                             reject("Ha ocurrido un error en la busqueda"); // Reject the promise with an error
                         });
                         
                     
                     }
                 }).catch(error => {
                     reject(error); // Reject the promise with any other error that occurred
                 });
             });
         }
     });
 
     ipcMain.handle('goLookup', e => {
        rpc.updatePresence({
            state: '😈 Diavlo Tools [Lookup]',
            details: '💻 The Best Minecraft Finder',
            largeImageKey: 'diavlo',
            largeImageText: `Diavlo v${VERSION} ✨`,
            startTimestamp: time,
            smallImageKey: 'diavlo_chiquito',
            smallImageText: '(.gg/programadores) ✨',
            instance: true
        });
        mainWindow.loadFile(path.join(__dirname,'../src/templates/lookup.html'));
    });

     ipcMain.handle('goServerFinder', e => {
         rpc.updatePresence({
             state: '😈 Diavlo Tools [Server Finder]',
             details: '💻 The Best Minecraft Finder',
             largeImageKey: 'diavlo',
             largeImageText: `Diavlo v${VERSION} ✨`,
             startTimestamp: time,
             smallImageKey: 'diavlo_chiquito',
             smallImageText: '(.gg/programadores) ✨',
             instance: true
         });
         mainWindow.loadFile(path.join(__dirname,'../src/templates/serverfinder.html'));
     });


     ipcMain.handle('goGeneratorMaster', e => {

        rpc.updatePresence({
            state: '😈 Diavlo Generator',
            details: '💻 The Best Minecraft Finder',
            largeImageKey: 'diavlo',
            largeImageText: `Diavlo v${VERSION} ✨`,
            startTimestamp: time,
            smallImageKey: 'diavlo_chiquito',
            smallImageText: '(.gg/programadores) ✨',
            instance: true
        });
        mainWindow.loadFile(path.join(__dirname,'../src/templates/generador_master.html'));
    });

     ipcMain.handle('goGenerator', e => {

        rpc.updatePresence({
            state: '😈 Diavlo Generator',
            details: '💻 The Best Minecraft Finder',
            largeImageKey: 'diavlo',
            largeImageText: `Diavlo v${VERSION} ✨`,
            startTimestamp: time,
            smallImageKey: 'diavlo_chiquito',
            smallImageText: '(.gg/programadores) ✨',
            instance: true
        });
        mainWindow.loadFile(path.join(__dirname,'../src/templates/generador.html'));
    });

    ipcMain.handle('goIPScanner', e => {
        rpc.updatePresence({
            state: '😈 Diavlo Tools [IP Scanner]',
            details: '💻 The Best Minecraft Finder',
            largeImageKey: 'diavlo',
            largeImageText: `Diavlo v${VERSION} ✨`,
            startTimestamp: time,
            smallImageKey: 'diavlo_chiquito',
            smallImageText: '(.gg/programadores) ✨',
            instance: true
        });
        mainWindow.loadFile(path.join(__dirname,'../src/templates/ipscanner.html'));
    });

    ipcMain.handle('connectBuyCraft', async (event, req) => {

        let dominio = await obtenerDominio();
        baseApiUrl = `https://${dominio}/api/v3/`;

        return new Promise((resolve, reject) => {

            fetch(`${baseApiUrl}tools/buycraft/info`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'di4vl0-h34d': 'd14vl0',
                    'Authorization': `Bearer ${req.token}`,
                },
                body: JSON.stringify({
                    'secret_key': req.secret_key
                })
            })
            .then(res => {
                if (res.ok) {
                    res.json().then(data => {
                        resolve(data); // Resolve the promise with the access token value
                    });
                } else{
                    res.json().then(t => {
                        const noti = new Notification({
                            title: `Diavlo v${VERSION}`,
                            icon: path.join(__dirname, '../src/images/logotipo.png'),
                            silent: true,
                            body: 'La Secret Key introducida no es correcta.'
                        });
        
                        noti.show();
                        reject("Ha ocurrido un error en la conexión"); // Reject the promise with an error
                    });
                }
            }).catch(error => {
                reject(error); // Reject the promise with any other error that occurred
            });


        });
    });
 

    ipcMain.handle('createCoupon', async (event, data) => {
        event.preventDefault();
        let dominio = await obtenerDominio();
        baseApiUrl = `https://${dominio}/api/v3/`;

        return new Promise((resolve, reject) => {
            fetch(`${baseApiUrl}tools/buycraft/createCoupon`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'di4vl0-h34d': 'd14vl0',
                    'Authorization': `Bearer ${data.token}`,
                },
                body: JSON.stringify({
                    'secret_key': data.secret_key,
                    'coupon_code': data.coupon,
                })
            })
            .then(res => {
                if (res.ok) {
                    res.json().then(data => {
                        const noti = new Notification({
                            title: `Diavlo v${VERSION}`,

                            icon: path.join(__dirname, '../src/images/logotipo.png'),
                            silent: true,
                            body: 'Se ha creado el cupón correctamente.'
                        });
        
                        noti.show();
                        resolve(data); // Resolve the promise with the access token value
                    });
                }if (res.status === 411) {
                    const noti = new Notification({
                        title: 'Diavlo v'+VERSION,
                        icon: path.join(__dirname, '../src/images/logotipo.png'),
                        silent: true,
                        body: 'Este cupón ya existe.'
                    });
    
                    noti.show();
                    reject("Este cupón ya existe."); // Reject the promise with an error
                
                } else{
                    res.json().then(t => {
                        const noti = new Notification({
                            title: `Diavlo v${VERSION}`,

                            icon: path.join(__dirname, '../src/images/logotipo.png'),
                            silent: true,
                            body: 'Ha ocurrido un error al crear el cupón.'
                        });
        
                        noti.show();
                        reject("Ha ocurrido un error al crear el cupón"); // Reject the promise with an error
                    });
                }
            }).catch(error => {
                reject(error); // Reject the promise with any other error that occurred
            });
        
        });
    });

    ipcMain.handle('deleteCoupon', async (event, data) => {
        event.preventDefault();
        let dominio = await obtenerDominio();
        baseApiUrl = `https://${dominio}/api/v3/`;

        return new Promise((resolve, reject) => {
            fetch(`${baseApiUrl}tools/buycraft/deleteCoupon`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'di4vl0-h34d': 'd14vl0',
                    'Authorization': `Bearer ${data.token}`,
                },
                body: JSON.stringify({
                    'secret_key': data.secret_key,
                    'coupon_id': data.coupon,
                })
            })
            .then(res => {
                if (res.ok) {
                    res.json().then(data => {
                        const noti = new Notification({
                            title: `Diavlo v${VERSION}`,

                            icon: path.join(__dirname, '../src/images/logotipo.png'),
                            silent: true,
                            body: 'Se ha borrado el cupón correctamente.'
                        });
        
                        noti.show();
                        resolve(data); // Resolve the promise with the access token value
                    });
                } else{
                    res.json().then(t => {
                        const noti = new Notification({
                            title: `Diavlo v${VERSION}`,

                            icon: path.join(__dirname, '../src/images/logotipo.png'),
                            silent: true,
                            body: 'Ha ocurrido un error al borrar el cupón.'
                        });
        
                        noti.show();
                        reject("Ha ocurrido un error al borrar el cupón"); // Reject the promise with an error
                    });
                }
            }).catch(error => {
                reject(error); // Reject the promise with any other error that occurred
            });
        
        });
    });

    ipcMain.handle('errorIPScan', async (event, data) => {
    
        const noti = new Notification({
            title: `Diavlo v${VERSION}`,
            icon: path.join(__dirname, '../src/images/logotipo.png'),
            silent: true,
            body: '¡La dirección IP a escanear no es válida!'
        });

        noti.show();

    })

    ipcMain.handle('editTebexPackage', async (event, data) => {

        let dominio = await obtenerDominio();
        baseApiUrl = `https://${dominio}/api/v3/`;

        return new Promise((resolve, reject) => {
            fetch(`${baseApiUrl}tools/buycraft/editTebexPackage`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'di4vl0-h34d': 'd14vl0',
                    'Authorization': `Bearer ${data.token}`,
                },
                body: JSON.stringify({
                    'secret_key': data.secret_key,
                    'package_id': data.package_id,
                    'new_name': data.package_name,
                    'new_price': data.package_price,
                })
            }).then(res => {
                if (res.ok) {
                    res.json().then(data => {
                        const noti = new Notification({
                            title: `Diavlo v${VERSION}`,

                            icon: path.join(__dirname, '../src/images/logotipo.png'),
                            silent: true,
                            body: 'Se ha editado el paquete correctamente.'
                        });
        
                        noti.show();
                        resolve(data); // Resolve the promise with the access token value
                    });
                } else{
                    res.json().then(t => {
                        const noti = new Notification({
                            title: `Diavlo v${VERSION}`,

                            icon: path.join(__dirname, '../src/images/logotipo.png'),
                            silent: true,
                            body: 'Ha ocurrido un error al editar el paquete.'
                        });
        
                        noti.show();
                        reject("Ha ocurrido un error al editar el paquete"); // Reject the promise with an error
                    });
                }
            });
        });

    });
 
     ipcMain.handle('startServerFinder', async (event, data) => {
         event.preventDefault();
 
         let query = data.query.toLowerCase();
 
         if(ServerFinderCache[query]){
 
             var noti;
             if(ServerFinderCache[query].length == 0){
                 noti = new Notification({
                         title: `Diavlo v${VERSION}`,
                     icon: path.join(__dirname, '../src/images/logotipo.png'),
                     silent: true,
                     body: 'No se han encontrado servidores de estas características.'
                 });
             }else {
                 noti = new Notification({
                     title: `Diavlo v${VERSION}`,
                 icon: path.join(__dirname, '../src/images/logotipo.png'),
                 silent: true,
                 body: 'Se ha completado la búsqueda.'
                 });
             }                            
             
             noti.show();
 
             return new Promise((resolve, reject) => {
                 resolve(ServerFinderCache[query]);
             });
         }else{
 
             var userToken = data.token;
             let dominio = await obtenerDominio();
             baseApiUrl = `https://${dominio}/api/v3/`;
     
             return new Promise((resolve, reject) => {
                 fetch(`${baseApiUrl}tools/serverfinder`, {
                     method: "POST",
                     headers: {
                         'Content-Type': 'application/json',
                         'Access-Control-Allow-Origin': '*',
                         'di4vl0-h34d': 'd14vl0',
                         'Authorization': `Bearer ${userToken}`,
                     },
                     body: JSON.stringify({
                         'query': query
                     })
                 })
                 .then(res => {
                     if (res.ok) {
                         res.json().then(data => {
                             var noti;
                             if(data.length == 0){
                                 noti = new Notification({
                                         title: `Diavlo v${VERSION}`,
                                     icon: path.join(__dirname, '../src/images/logotipo.png'),
                                     silent: true,
                                     body: 'No se han encontrado servidores de estas características.'
                                 });
                             }else {
                                 noti = new Notification({
                                     title: `Diavlo v${VERSION}`,
                                 icon: path.join(__dirname, '../src/images/logotipo.png'),
                                 silent: true,
                                 body: 'Se ha completado la búsqueda.'
                                 });
                             }
 
                             
                             ServerFinderCache[query] = data;
                             noti.show();
                             resolve(data); // Resolve the promise with the access token value
                         });
                     } else{
     
                         res.json().then(t => {
                             const noti = new Notification({
                                     title: `Diavlo v${VERSION}`,
                                 icon: path.join(__dirname, '../src/images/logotipo.png'),
                                 silent: true,
                                 body: 'Ha ocurrido un error en la búsqueda.'
                             });
             
                             noti.show();
                             reject("Ha ocurrido un error en la busqueda"); // Reject the promise with an error
                         });
                         
                     
                     }
                 }).catch(error => {
                     reject(error); // Reject the promise with any other error that occurred
                 });
             });
         }
     });

     let cacheFullScanIP = {};
     ipcMain.handle('scanFullIp', async (event, data) => {
        event.preventDefault();

        let ip = data.ip;
        var userToken = data.token;

        if(cacheFullScanIP[ip]){
            return new Promise((resolve, reject) => {
                resolve(cacheFullScanIP[ip]);
            });
        }

        let dominio = await obtenerDominio();
        baseApiUrl = `https://${dominio}/api/v3/`;

        return new Promise((resolve, reject) => {
            fetch(`${baseApiUrl}tools/scanner`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'di4vl0-h34d': 'd14vl0',
                    'Authorization': `Bearer ${userToken}`,
                },
                body: JSON.stringify({
                    'ip': ip
                })
            }).then(res => {
                if (res.ok) {
                    res.json().then(data => {
                        cacheFullScanIP[ip] = JSON.parse(data);
                        if(data.ip?.length === 0){
                            const noti = new Notification({
                                title: `Diavlo v${VERSION}`,
                                icon: path.join(__dirname, '../src/images/logotipo.png'),
                                silent: true,
                                body: 'No se han encontrado puertos abiertos.'
                            });
                            noti.show();
                        }

                        resolve(JSON.parse(data)); // Resolve the promise with the access token value
                    });
                if (res.status === 414){
                    const noti = new Notification({
                        title: `Diavlo v${VERSION}`,
                        icon: path.join(__dirname, '../src/images/logotipo.png'),
                        silent: true,
                        body: 'La IP introducida es inválida.'
                    });

                    noti.show();
                    reject("La IP introducida es inválida."); // Reject the promise with an error
                } else {
                    res.json().then(t => {
                        const noti = new Notification({
                            title: `Diavlo v${VERSION}`,
                            icon: path.join(__dirname, '../src/images/logotipo.png'),
                            silent: true,
                            body: 'Ha ocurrido un error en el escaneo.'
                        });
        
                        noti.show();
                        reject("Ha ocurrido un error en la busqueda"); // Reject the promise with an error
                    });
                }
            }
        }).catch(error => {
            const noti = new Notification({
                title: `Diavlo v${VERSION}`,
                icon: path.join(__dirname, '../src/images/logotipo.png'),
                silent: true,
                body: 'Ha ocurrido un error en el escaneo.'
            });

            noti.show();
            reject(error); // Reject the promise with any other error that occurred
            
            });
        });
    });

     ipcMain.handle('scanMCIP', async (event,data) => {
         event.preventDefault();
         let ip = data.ip;
         var userToken = data.token;
         let dominio = await obtenerDominio();
         baseApiUrl = `https://${dominio}/api/v3/`;
 
         return new Promise((resolve, reject) => {
             fetch(`${baseApiUrl}tools/scanMCIP`, {
                 method: "POST",
                 headers: {
                     'Content-Type': 'application/json',
                     'Access-Control-Allow-Origin': '*',
                     'di4vl0-h34d': 'd14vl0',
                     'Authorization': `Bearer ${userToken}`,
                 },
                 body: JSON.stringify({
                     'server_ip': ip
                 })
             })
             .then(res => {
                 if (res.ok) {
                     try {
                         res.json().then(data => {
                             resolve(JSON.parse(data)); // Resolve the promise with the access token value
                         })
                     } catch (error) {
                         const noti = new Notification({
                                 title: `Diavlo v${VERSION}`,
                             icon: path.join(__dirname, '../src/images/logotipo.png'),
                             silent: true,
                             body: 'Ha ocurrido un error en el escaneo.'
                         });
         
                         noti.show();
                         reject(error); // Reject the promise with any other error that occurred
                     }
                 } else{
 
                     res.json().then(t => {
                         const noti = new Notification({
                                 title: `Diavlo v${VERSION}`,
                             icon: path.join(__dirname, '../src/images/logotipo.png'),
                             silent: true,
                             body: 'Ha ocurrido un error en el escaneo.'
                         });
         
                         noti.show();
                         reject("Ha ocurrido un error en la busqueda"); // Reject the promise with an error
                     });
                 }
             }).catch(error => {
                 reject(error); // Reject the promise with any other error that occurred
             });
         });
 
     });

     ipcMain.handle('goPortChecker', e => {
        rpc.updatePresence({
            state: '😈 Diavlo Tools [Port Checker]',
            details: '💻 The Best Minecraft Finder',
            largeImageKey: 'diavlo',
            largeImageText: `Diavlo v${VERSION} ✨`,
            startTimestamp: time,
            smallImageKey: 'diavlo_chiquito',
            smallImageText: '(.gg/programadores) ✨',
            instance: true
        });
        mainWindow.loadFile(path.join(__dirname,'../src/templates/portchecker.html'));
    });


    const parseFile = (file,scan_type) => {
        try {
            let data = readFileSync(file, 'utf8');
            let lines = data.split('\n');

            let parsedData = new Set();

            switch (scan_type) {
                case 'IP:PORT':
                    parsedData = new Set(lines.map(line => line.trim()));
                    break;
                case 'NMAP':
                    let last_ip = '';
                    lines.forEach(line => {
                        if (line.includes('Nmap scan report for')) {
                            last_ip = line.split(' ')[4].trim();
                        }else if (line.includes('open') && line.includes('/tcp')) {
                            let port = line.split('/tcp')[0].trim();
                            parsedData.add(`${last_ip}:${port}`);
                        }
                    });
                    break;
                case 'MASSCAN':
                    lines.forEach(line => {
                        if (line.includes('open')) {
                            let ip = line.split(' ')[3].trim();
                            let port = line.split(' ')[2].trim();
                            parsedData.add(`${ip}:${port}`);
                        }
                    });
                    break;
            }

            return parsedData;

        } catch (error) {
            throw error;
        }

    }

    let cachePortChecker = {};

    ipcMain.handle('checkPorts', async (event, data) => {
        let file = data.file;
        let scan_type = data.scan_type;
        let token = data.token;

        let servers ;

        return new Promise(async (resolve, reject) => {

            if (cachePortChecker[file]){

                new Notification({
                    title: 'Diavlo v'+VERSION,
                    icon: path.join(__dirname, '../src/images/logotipo.png'),
                    silent: true,
                    body: 'Se ha completado el checkeo de puertos.'
                }).show();

                resolve(cachePortChecker[file]);
                return;
            }

            try {
                servers = Array.from(parseFile(file,scan_type));
                if(servers.length === 0){
                    const noti = new Notification({
                        title: 'Error',
                        icon: path.join(__dirname, '../src/images/logotipo.png'),
                        silent: true,
                        body: 'No se han encontrado servidores en el archivo.'
                    });

                    noti.show();
                    reject('No servers found');
                }else{
                    const MOST_COMMON_PORTS = [21, 22, 23, 25,2525, 53, 80, 81, 110, 111, 135, 139, 143, 443, 445, 587, 465, 993, 995, 1723, 2086, 2087, 2095, 3306, 3389, 5900, 6379, 6881, 6969, 8080, 8081, 8086, 8443, 8880 ,27017, 33060];
                    let filteredServers = servers.filter(server => !MOST_COMMON_PORTS.includes(parseInt(server.split(':')[1])) && server.length > 0 && server.length != null && server.length != undefined);
                    filteredServers = filteredServers.slice(0, 500);

                    if(filteredServers.length > 200){
                        const noti = new Notification({
                            title: 'Diavlo v'+VERSION,
                            icon: path.join(__dirname, '../src/images/logotipo.png'),
                            silent: true,
                            body: 'Se han encontrado más de 100 puertos, este proceso tardará unos minutos.'
                        });
                        noti.show();
                    }

                    baseApiUrl = `http://178.18.255.134:8081/api/v3/`;
                    fetch(`${baseApiUrl}checkScan`, {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*',
                            'di4vl0-h34d': 'd14vl0',
                            'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            'servers': filteredServers
                        })
                        
                    }).then(res => {
                        if(res.status === 402){
                            const noti = new Notification({
                                title: 'Error',
                                icon: path.join(__dirname, '../src/images/logotipo.png'),
                                silent: true,
                                body: 'El formato del archivo es incorrecto.'
                            });
        
                            noti.show();
                            reject('Search failed'); // Reject the promise with an error
                            return;
                        }else if(res.status === 403){
                            const noti = new Notification({
                                title: 'Error',
                                icon: path.join(__dirname, '../src/images/logotipo.png'),
                                silent: true,
                                body: 'No hay ningun servidor operativo.'
                            });
        
                            noti.show();
                            reject('Search failed'); // Reject the promise with an error
                            return;
                        }


                        res.json().then(d => {
                            new Notification({
                                title: 'Diavlo v'+VERSION,
                                icon: path.join(__dirname, '../src/images/logotipo.png'),
                                silent: true,
                                body: 'Se ha completado el checkeo de puertos.'
                            }).show();
                            cachePortChecker[file] = d;
                            resolve(d);
                        }
                        )}).catch(error => {
                            reject(error);
                        }
                    );                    
                }
                
            } catch (error) {
                new Notification({
                    title: 'Error',
                    icon: path.join(__dirname, '../src/images/logotipo.png'),
                    silent: true,
                    body: 'Ha ocurrido un error al leer el archivo.'
                }).show();


                reject(error);
            }
            
        });




    });



     ipcMain.handle('ServersScrappers', async (event, data) => {
        var userToken = data.token;

        let dominio = await obtenerDominio();

        baseApiUrl = `https://${dominio}/api/v3/`;
        return new Promise((resolve, reject) => {
            fetch(`${baseApiUrl}tools/nickscrapper`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'di4vl0-h34d': 'd14vl0',
                    'Authorization': `Bearer ${userToken}`,
                }
                
            })
            .then(res => {
                if (res.ok) {
                    res.json().then(data => {
                        resolve(data); // Resolve the promise with the access token value
                    }
                    );
                } else {
                    const noti = new Notification({
                        title: 'Error',
                        icon: path.join(__dirname, '../src/images/logotipo.png'),
                        silent: true,
                        body: '¡No se pudo obtener la lista de servidores!.'
                    });

                    noti.show();
                    reject('Search failed'); // Reject the promise with an error
                }
            }).catch(error => {
                reject(error); // Reject the promise with any other error that occurred
            });
        });
    });

    ipcMain.handle('nickScrapperShow', e => {
        mainWindow.loadFile(path.join(__dirname,'../src/templates/serverinfo.html'));
    });

    ipcMain.handle('nickScrapperSearchDate', async function (event, data) {
        event.preventDefault();
        var userToken = data.token;
        var type = data.type;
        var servidor = data.server;
        return new Promise((resolve, reject) => {
            fetch(`${baseApiUrl}tools/nickscrappersearch/${servidor}/${type}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'di4vl0-h34d': 'd14vl0',
                    'Authorization': `Bearer ${userToken}`,
                }
                
            })
            .then(res => {
                if (res.ok) {
                    res.json().then(data => {
                        resolve(data); // Resolve the promise with the access token value
                    }
                    );
                } else {
                    const noti = new Notification({
                        title: 'Error',
                        icon: path.join(__dirname, '../src/images/logotipo.png'),
                        silent: true,
                        body: '¡No se pudo obtener la lista de servidores!.'
                    });

                    noti.show();
                    reject('Search failed'); // Reject the promise with an error
                }
            }).catch(error => {
                reject(error); // Reject the promise with any other error that occurred
            });
        });
    });

    ipcMain.handle('nickScrapperSearch', async function (event, data) {
        event.preventDefault();
        var userToken = data.token;
        var servidor = data.datos;
        let dominio = await obtenerDominio();
        baseApiUrl = `https://${dominio}/api/v3/`;
        return new Promise((resolve, reject) => {
            fetch(`${baseApiUrl}tools/nickscrappersearch/${servidor}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'di4vl0-h34d': 'd14vl0',
                    'Authorization': `Bearer ${userToken}`,
                }
                
            })
            .then(res => {
                if (res.ok) {
                    res.json().then(data => {
                        resolve(data); // Resolve the promise with the access token value
                    }
                    );
                } else {
                    const noti = new Notification({
                        title: 'Error',
                        icon: path.join(__dirname, '../src/images/logotipo.png'),
                        silent: true,
                        body: '¡No se pudo obtener la lista de servidores!.'
                    });

                    noti.show();
                    reject('Search failed'); // Reject the promise with an error
                }
            }).catch(error => {
                reject(error); // Reject the promise with any other error that occurred
            });
        });
    });

    ipcMain.handle('changeDiscord', async (event,data) => {
        event.preventDefault();
    
        let dominio = await obtenerDominio();
        baseApiUrl = `https://${dominio}/api/v3/`;
        let userToken = data.token;
        return new Promise((resolve, reject) => {
            fetch(`${baseApiUrl}setDiscord/`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'di4vl0-h34d': 'd14vl0',
                    'Authorization': `Bearer ${userToken}`,
                }
                
            })
            .then(res => {
                if (res.ok) {
                    res.json().then(data => {
                        resolve(data); // Resolve the promise with the access token value
                    }
                    );
                } else if (res.status == 403) {
                    // Ya tiene un discord establecido
                    res.json().then(data => {
                        resolve(data);
                    })
                } else {
                    const noti = new Notification({
                        title: 'Error',
                        icon: path.join(__dirname, '../src/images/logotipo.png'),
                        silent: true,
                        body: '¡No se pudo obtener la lista de servidores!.'
                    });

                    noti.show();
                    reject('Search failed'); // Reject the promise with an error
                }
            }).catch(error => {
                reject(error); // Reject the promise with any other error that occurred
            });
        });
    })
 
    ipcMain.handle('exportarArchivo', (event,data) => {
         event.preventDefault();
 
         let datos = data.datos;
        
         datos = "=================\n   Diavlo v3.6   \n=================\n" + datos
 
         let nombre = data.nombre;
 
         const os = require('os');
         const path = require('path');
 
         let folderPath = '';
         
         dialog.showOpenDialog({
             title: 'Selecciona el directorio donde se guardará el archivo',
             defaultPath: path.join(os.homedir(), 'Desktop'),
             buttonLabel: 'Seleccionar',
             properties: ['openDirectory']
         }).then((folder) => {
             if (!folder.canceled) {
                 folderPath = folder.filePaths[0];
                 writeFile(`${folderPath}/${nombre}.txt`, datos, (err) => {
                     const noti = new Notification({
                             title: `Diavlo v${VERSION}`,
                         icon: path.join(__dirname, '../src/images/logotipo.png'),
                         silent: true,
                         body: 'Se ha exportado el archivo al directorio seleccionado.'
                     });
     
                     noti.show();
                 });
             }
         }).catch((err) => {
             console.log(err)
         });
     });

    
 
 }