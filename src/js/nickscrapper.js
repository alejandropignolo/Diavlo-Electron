window.addEventListener('load', () => {
    const { ipcRenderer } = require("electron");

    const backButton = document.querySelector(".HeaderHome");

    // Evento para el boton de volver atrás
    backButton.addEventListener("click", () => {
        ipcRenderer.invoke("goIndex");              
    });
    /*
    const goBackTools = document.querySelector(".gobacktools");
    goBackTools.addEventListener("click", () => {
        ipcRenderer.invoke("openTools");
    });

    const goBackTools2 = document.querySelector(".gobacktools2");
    goBackTools2.addEventListener("click", () => {
        ipcRenderer.invoke("openTools");
    });
    */

    const back_servers = document.getElementById('tool_return');
    back_servers.addEventListener('click', () => {
        ipcRenderer.invoke("openTools");
    });
    

    ipcRenderer.invoke("ServersScrappers",{'token': localStorage.getItem("token")}).then(d => {
        var ulElement = document.querySelector('.nickscrapper__servers');
        info_parsed = JSON.parse(d);
        for (let server of info_parsed.servers) {
            // Crear un nuevo elemento <li>
            var liElement = document.createElement('li');
            liElement.classList.add('servers__server');

            // Crear un elemento <img> y establecer sus atributos
            var imgElement = document.createElement('img');
            imgElement.classList.add('servers__icon');
            imgElement.src = `http://status.mclive.eu/Diavlo/${server}/banner.png`;

            // Crear un elemento <p> y establecer su contenido HTML
            var pElement = document.createElement('p');
            pElement.classList.add('servers__content');
            pElement.innerHTML = `Clic para consultar las ventas de <strong>${server}</strong>`;

            liElement.setAttribute('data-server', server);

            // Adjuntar los elementos al <li>
            liElement.appendChild(imgElement);
            liElement.appendChild(pElement);

            // Adjuntar el <li> al <ul>
            ulElement.appendChild(liElement)
        }

        var servidores = document.getElementsByClassName('servers__server');
        for (let server of servidores) {
            server.addEventListener('click', () => {
                let sv = server.getAttribute('data-server');
                ipcRenderer.invoke("nickScrapperSearch", {"datos": sv, "token": localStorage.getItem("token")}).then(d => {
                    localStorage.setItem("current_server", sv);
                    localStorage.setItem("servers", d);
                    ipcRenderer.invoke("nickScrapperShow");
                });
            });
        }

        let all_servers = Array.from(document.querySelectorAll('.nickscrapper__servers .servers__server'));
        
        let search = document.querySelector('.nickscrapper__search');
        search.addEventListener('input', () => {
            let serversContainer = document.querySelector('.nickscrapper__servers');
        
            if (search.value === '') {
                // Si el input está vacío, mostramos todos los servidores
                serversContainer.innerHTML = all_servers.map(server => server.outerHTML).join('');

                var servidores = document.getElementsByClassName('servers__server');
                for (let server of servidores) {
                    server.addEventListener('click', () => {
                        let sv = server.getAttribute('data-server');
                        ipcRenderer.invoke("nickScrapperSearch", {"datos": sv, "token": localStorage.getItem("token")}).then(d => {
                            localStorage.setItem("current_server", sv);
                            localStorage.setItem("servers", d);
                            ipcRenderer.invoke("nickScrapperShow");
                        });
                    });
                }
            } else {
                // Filtramos los servidores que coincidan con el valor de búsqueda
                let filteredServers = all_servers.filter(server => {
                    return server.getAttribute('data-server').includes(search.value.toLowerCase());
                });
        
                // Actualizamos el contenido del <ul> con los servidores filtrados
                serversContainer.innerHTML = filteredServers.map(server => server.outerHTML).join('');

                // Volvemos a agregar los event listeners a los elementos filtrados
                var servidores = document.getElementsByClassName('servers__server');
                for (let server of servidores) {
                    server.addEventListener('click', () => {
                        let sv = server.getAttribute('data-server');
                        ipcRenderer.invoke("nickScrapperSearch", {"datos": sv, "token": localStorage.getItem("token")}).then(d => {
                            localStorage.setItem("current_server", sv);
                            localStorage.setItem("servers", d);
                            ipcRenderer.invoke("nickScrapperShow");
                        });
                    });
                }
            }
        });
    });
});

