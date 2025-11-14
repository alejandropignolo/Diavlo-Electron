window.addEventListener("load", () => {
    const { ipcRenderer } = require("electron");
    var searching = false;

    const setHeaderData = () => {
        const userRank = localStorage.getItem("rank");
        const userRankExpiration = localStorage.getItem("rank_expiration");
        const userExtended = localStorage.getItem("extended");
        const userToken = localStorage.getItem("token");
        const username = localStorage.getItem("username");
        const UserHeaderData = document.querySelector(".user-info");
        const gen_premium = localStorage.getItem("gen");
        const gen_vip = localStorage.getItem("gen_vip");
        const gen_master = localStorage.getItem("gen_master");
    
        if (userToken === null) {
            window.close();
        }

        UserHeaderData.querySelector('.usernameHeader').innerHTML = username;
        UserHeaderData.querySelector('.rank-data h3').innerHTML = userRank + `${userExtended === "1" ? " +" : ""}`;
        var timeDiff = new Date(userRankExpiration).getTime() - new Date().getTime();
        var daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        UserHeaderData.querySelector('.rank-data span').innerHTML = `${daysRemaining} Dias`;

        if (gen_premium == 1) {
            const gen_premium_time = localStorage.getItem("gen_time");
            UserHeaderData.querySelector(".data__gen h3").textContent = "Gen";
            var timeDiff2 = new Date(gen_premium_time).getTime() - new Date().getTime();
            var daysRemaining2 = Math.ceil(timeDiff2 / (1000 * 60 * 60 * 24));
            UserHeaderData.querySelector(".data__gen span").textContent = daysRemaining2 + " Dias";
        } else if (gen_vip == 1) {
            const gen_premium_time = localStorage.getItem("gen_time");
            UserHeaderData.querySelector(".data__gen h3").textContent = "Gen +";
            var timeDiff2 = new Date(gen_premium_time).getTime() - new Date().getTime();
            var daysRemaining2 = Math.ceil(timeDiff2 / (1000 * 60 * 60 * 24));
            UserHeaderData.querySelector(".data__gen span").textContent = daysRemaining2 + " Dias";
        } else if (gen_master == 1) {
            const gen_premium_time = localStorage.getItem("gen_time");
            UserHeaderData.querySelector(".data__gen h3").textContent = "Gen Master";
            var timeDiff2 = new Date(gen_premium_time).getTime() - new Date().getTime();
            var daysRemaining2 = Math.ceil(timeDiff2 / (1000 * 60 * 60 * 24));
            UserHeaderData.querySelector(".data__gen span").textContent = daysRemaining2 + " Dias";
        } else {
            var info_generador = document.querySelector('.data__gen');
            info_generador.style.display = "none";
        }
        if (userRank == "null") {
            let rango_programa = document.querySelector('.data__diavlo');
            rango_programa.style.display = "none";
        }
    }

    setHeaderData();

    const usrTypeBtn = document.getElementById('usernameTypeBtn');
    const emailTypeBtn = document.getElementById('emailTypeBtn');
    const passwordTypeBtn = document.getElementById('passwordTypeBtn');
    const domainTypeBtn = document.getElementById('domainTypeBtn');
    const realNameTypeBtn = document.getElementById('realNameTypeBtn');
    const ipTypeBtn = document.getElementById('ipTypeBtn');
    const phoneTypeBtn = document.getElementById('phoneTypeBtn');

    const searchBar = document.querySelector('.searchBar input');

    ipTypeBtn.addEventListener('click', (e) => {
        if(!ipTypeBtn.querySelector('input').checked){
            ipTypeBtn.querySelector('input').checked = true;
            ipTypeBtn.querySelector('label').classList = ['searchTypeChecked']
            searchBar.placeholder = 'Introduce una dirección IP';

            usrTypeBtn.querySelector('label').classList = []

            emailTypeBtn.querySelector('label').classList = []

            passwordTypeBtn.querySelector('label').classList = []

            domainTypeBtn.querySelector('label').classList = []

            realNameTypeBtn.querySelector('label').classList = []

            phoneTypeBtn.querySelector('label').classList = []
        }
    });

    phoneTypeBtn.addEventListener('click', (e) => {
        if(!phoneTypeBtn.querySelector('input').checked){
            phoneTypeBtn.querySelector('input').checked = true;
            phoneTypeBtn.querySelector('label').classList = ['searchTypeChecked']
            searchBar.placeholder = 'Introduce un número de teléfono';

            usrTypeBtn.querySelector('label').classList = []

            emailTypeBtn.querySelector('label').classList = []

            passwordTypeBtn.querySelector('label').classList = []

            domainTypeBtn.querySelector('label').classList = []

            realNameTypeBtn.querySelector('label').classList = []

            ipTypeBtn.querySelector('label').classList = []
        }
    });

    realNameTypeBtn.addEventListener('click', (e) => {
        if(!realNameTypeBtn.querySelector('input').checked){
            realNameTypeBtn.querySelector('input').checked = true;
            realNameTypeBtn.querySelector('label').classList = ['searchTypeChecked']
            searchBar.placeholder = 'Introduce el nombre y apellidos de alguien';

            usrTypeBtn.querySelector('label').classList = []

            emailTypeBtn.querySelector('label').classList = []

            passwordTypeBtn.querySelector('label').classList = []

            domainTypeBtn.querySelector('label').classList = []

            phoneTypeBtn.querySelector('label').classList = []

            ipTypeBtn.querySelector('label').classList = []
        }
    });

    usrTypeBtn.addEventListener('click', (e) => {
        if(!usrTypeBtn.querySelector('input').checked){
            usrTypeBtn.querySelector('input').checked = true;
            usrTypeBtn.querySelector('label').classList = ['searchTypeChecked']
            searchBar.placeholder = 'Introduce un nombre de usuario';

            emailTypeBtn.querySelector('label').classList = []

            passwordTypeBtn.querySelector('label').classList = []

            domainTypeBtn.querySelector('label').classList = []

            realNameTypeBtn.querySelector('label').classList = []

            phoneTypeBtn.querySelector('label').classList = []

            ipTypeBtn.querySelector('label').classList = []
        }
    });

    emailTypeBtn.addEventListener('click', (e) => {

        if(!emailTypeBtn.querySelector('input').checked){
            emailTypeBtn.querySelector('input').checked = true;
            emailTypeBtn.querySelector('label').classList = ['searchTypeChecked']
            searchBar.placeholder = 'Introduce una dirección Email';

            usrTypeBtn.querySelector('label').classList = []

            passwordTypeBtn.querySelector('label').classList = []

            domainTypeBtn.querySelector('label').classList = []

            realNameTypeBtn.querySelector('label').classList = []

            phoneTypeBtn.querySelector('label').classList = []

            ipTypeBtn.querySelector('label').classList = []
        }

    });

    passwordTypeBtn.addEventListener('click', (e) => {

        if(!passwordTypeBtn.querySelector('input').checked){
            passwordTypeBtn.querySelector('input').checked = true;
            passwordTypeBtn.querySelector('label').classList = ['searchTypeChecked']
            searchBar.placeholder = 'Introduce una contraseña';

            usrTypeBtn.querySelector('label').classList = []

            emailTypeBtn.querySelector('label').classList = []

            domainTypeBtn.querySelector('label').classList = []

            realNameTypeBtn.querySelector('label').classList = []

            phoneTypeBtn.querySelector('label').classList = []

            ipTypeBtn.querySelector('label').classList = []
        }

    });

    domainTypeBtn.addEventListener('click', (e) => {

        if(!domainTypeBtn.querySelector('input').checked){
            domainTypeBtn.querySelector('input').checked = true;
            domainTypeBtn.querySelector('label').classList = ['searchTypeChecked']
            searchBar.placeholder = 'Introduce un dominio [example.com]';

            usrTypeBtn.querySelector('label').classList = []

            emailTypeBtn.querySelector('label').classList = []

            passwordTypeBtn.querySelector('label').classList = []

            realNameTypeBtn.querySelector('label').classList = []

            phoneTypeBtn.querySelector('label').classList = []

            ipTypeBtn.querySelector('label').classList = []
        }

    })


    const emailFilter = document.querySelector('.bi-envelope-at-fill');
    const usernameFilter = document.querySelector('.bi-person-vcard-fill');

    usernameFilter.addEventListener('click', () => {

        let emails = document.querySelector('.listaResultados .emails');
        let users = document.querySelector('.listaResultados .users');


        emails.style.display = 'none';
        users.style.display = 'flex';
    
        
    });

    emailFilter.addEventListener('click', () => {

        let emails = document.querySelector('.listaResultados .emails');
        let users = document.querySelector('.listaResultados .users');


        users.style.display = 'none';
        emails.style.display = 'flex';
        
        
    });

    /* Inicio exportar resultados */
    const exportIMG = document.querySelector(".export-img");
    exportIMG.addEventListener('click', () => {
        let lista_resultados = document.querySelector('.listaResultados');
        let datos = lista_resultados.querySelectorAll('li');
        if (datos.length > 0) {
            let datos_content = '';
            let nombre = document.querySelector('#resultText').textContent.trim().replace("Resultados para ", "").replace(/:\s*$/, "");
            datos.forEach(li => {
                // Obtiene el contenido del div accordion-content
                let contentDiv = li.querySelector('.accordion-content.resData');
                let datas = Array.from(contentDiv.querySelectorAll('h4')).map(h4 => h4.textContent.trim());
                for (let dato of datas) {
                    datos_content += dato + "\n";
                }
                datos_content += "\n";
            });
            ipcRenderer.invoke("exportarArchivo", {datos: datos_content, nombre: nombre});
        }
    })

    /* Fin exportar resultados */

    const searchButton = document.getElementById("searchButton");
    var listaResultados = document.querySelector('.listaResultados');
    var resultText = document.getElementById('resultText');
    const loader = document.querySelector('.loader');
    loader.style.margin = 'unset';

    searchButton.addEventListener("click", () => {
        if(!searching){

            const searchType = document.querySelector('input[name="searchType"]:checked').value;
            const searchValue = document.querySelector('.searchBar input').value;
            if(searchValue.length > 3 && searchValue.length < 46){
                resultText.innerHTML = ``;

                searching = true;
                loader.style.display = 'block';

                for (var i = listaResultados.childNodes.length - 1; i >= 0; i--) {
                    listaResultados.removeChild(listaResultados.childNodes[i]);
                }
                ipcRenderer.invoke("searchFinder", {'type': searchType, 'value': searchValue,'token': localStorage.getItem("token")}).then((result) => {
                    resultText.innerHTML = `Resultados para ${searchValue}:`;
                    listaResultados.style.display = "flex";
                    searching = false;
                    
                    loader.style.display = 'none';

                    if(searchType === 'password'){
                        let pswFilter = document.getElementById('pswFilter');
                        pswFilter.classList = ['passwordFilter passFilterResponsive'];

                        listaResultados.classList = ['listaResultados passwordList'];
                        var emailList = document.createElement('ul');
                        emailList.classList = ['listaResultados emails'];
                        emailList.style.display = 'flex';

                        var userList = document.createElement('ul');
                        userList.classList = ['listaResultados users'];
                        userList.style.display = 'flex';


                        for(let res in result['emails']){
                            
                            var li = document.createElement('li');
                            li.classList = ['resultadoFinder'];

                            var div = document.createElement('div');
                            div.classList = ['accordion-item'];

                            var header = document.createElement('div');
                            header.classList = ['resHeader accordion-header'];
                            header.style.minWidth = 'fit-content';

                            var img = document.createElement('img');
                            img.src = '../images/subir_bajar.webp';
                            img.classList = ['title_finder'];

                            var h2 = document.createElement('h2');
                            h2.innerHTML = result['emails'][res].email;
                            

                            header.appendChild(img);
                            header.appendChild(h2);

                            div.appendChild(header);

                            var content = document.createElement('div');
                            content.classList = ['accordion-content resData'];

                            for(let data in result['emails'][res]){
                                if (result['emails'][res][data] !== '' && data !== 'sourcecount'){
                                    let dato = result['emails'][res][data]
                                    if(data === 'sources'){
                                        dato = result['emails'][res][data].join(', ');
                                    }
                                    var p = document.createElement('h4');
                                    p.innerHTML = `<strong>${data.toUpperCase()}</strong>` + ": " + dato;
                                    content.appendChild(p);
                                }
                            }



                            div.appendChild(content);

                            li.appendChild(div);

                            emailList.appendChild(li);
                        }

                        for(let res in result['usernames']){
                            
                            var li = document.createElement('li');
                            li.classList = ['resultadoFinder'];

                            var div = document.createElement('div');
                            div.classList = ['accordion-item'];

                            var header = document.createElement('div');
                            header.classList = ['resHeader accordion-header'];
                            header.style.minWidth = 'fit-content';

                            var img = document.createElement('img');
                            img.src = '../images/subir_bajar.webp';
                            img.classList = ['title_finder'];

                            var h2 = document.createElement('h2');
                            h2.innerHTML = result['usernames'][res].username;
                            

                            header.appendChild(img);
                            header.appendChild(h2);

                            div.appendChild(header);

                            var content = document.createElement('div');
                            content.classList = ['accordion-content resData'];

                            for(let data in result['usernames'][res]){
                                if (result['usernames'][res][data] !== '' && data !== 'sourcecount'){
                                    let dato = result['usernames'][res][data]
                                    if(data === 'sources'){
                                        dato = result['usernames'][res][data].join(', ');
                                    }
                                    var p = document.createElement('h4');
                                    p.innerHTML = `<strong>${data.toUpperCase()}</strong>` + ": " + dato;
                                    content.appendChild(p);
                                }
                            }



                            div.appendChild(content);

                            li.appendChild(div);

                            userList.appendChild(li);
                        }

                        listaResultados.appendChild(emailList);

                        listaResultados.appendChild(userList);
                    }else{
                        let pswFilter = document.getElementById('pswFilter');
                        pswFilter.classList = ['passwordFilter'];

                        
                        listaResultados.classList = ['listaResultados'];
                        for(let res in result){
                            var li = document.createElement('li');
                            li.classList = ['resultadoFinder'];

                            var div = document.createElement('div');
                            div.classList = ['accordion-item'];

                            var header = document.createElement('div');
                            header.classList = ['resHeader accordion-header'];

                            var img = document.createElement('img');
                            img.src = '../images/subir_bajar.webp';
                            img.classList = ['title_finder'];

                            var h2 = document.createElement('h2');
                            h2.innerHTML = result[res].source !== undefined ? result[res].source : result[res].email !== '' ? result[res].email : 'Desconocido';

                            header.appendChild(img);
                            header.appendChild(h2);

                            div.appendChild(header);

                            var content = document.createElement('div');
                            content.classList = ['accordion-content resData'];

                            for(let data in result[res]){
                                if (result[res][data] !== '' && data != 'source'){
                                    var p = document.createElement('h4');
                                    p.innerHTML = `<strong>${data.toUpperCase()}</strong>` + ": " + result[res][data];
                                    content.appendChild(p);
                                }
                            }



                            div.appendChild(content);

                            li.appendChild(div);

                            listaResultados.appendChild(li);
                        }
                    }

                    const accordionItems = document.querySelectorAll('.accordion-item');

                    accordionItems.forEach(item => {
                    const header = item.querySelector('.accordion-header');
                
                    header.addEventListener('click', () => {
                        item.classList.toggle('active');
                    });
                    });
                    // Conjunto de imagenes
                    var botones_finder = document.getElementsByClassName("title_finder");
                    // resultados del finder
                    var resultadoFinder = document.getElementsByClassName("resHeader");
                    for (let elemento in resultadoFinder) {
                        // Verificamos que el elemento sea apto para poder agregarle un eventListener
                        if (resultadoFinder.hasOwnProperty(elemento) && typeof resultadoFinder[elemento].addEventListener === 'function') {
                            resultadoFinder[elemento].addEventListener('click', () => {
                                if (botones_finder[elemento].classList.contains("reverse")) {
                                    // Lo dejamos asi para solucionar un bug de que a veces no se gira bien el boton
                                    botones_finder[elemento].classList.remove("reverse");
                                } else {
                                    botones_finder[elemento].classList.add("reverse");
                                }
                            });
                        }
                    }
                }).catch((err) => {
                    searching = false;
                    
                    loader.style.display = 'none';
                });
            }


        }
    });

    const backButton = document.querySelector(".HeaderHome");

    // Evento para el boton de volver atrás
    backButton.addEventListener("click", () => {
        if(!searching){
            ipcRenderer.invoke("goIndex");
        }
    });

    // Evento que al dar enter en el input no nos abra esa pestaña extraña
    const searchFinderForm = document.querySelector('#finder_button');
    searchFinderForm.addEventListener('submit', (event) => {
        event.preventDefault();
    })
})