window.addEventListener('load', () => {
    const {ipcRenderer} = window.electron;
    const ipc = ipcRenderer;
    let closebtn = document.querySelector('.cerrar');
    let minimizebtn = document.querySelector('.minimizar');
    let ampliar = document.querySelector('.ampliar');
    // CLOSE APP
    closebtn.addEventListener('click', (e) => {
        e.preventDefault();
        ipc.send('closeApp');
    })

    minimizebtn.addEventListener('click', (e) => {
        e.preventDefault();
        ipc.send('minimizeApp');
    })

    ampliar.addEventListener('click', (e) => {
        e.preventDefault();
        ipc.send('ampliarApp');
    })
})
