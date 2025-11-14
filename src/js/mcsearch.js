window.addEventListener('load', () => {
    const { ipcRenderer } = require("electron");
    const userExtended = localStorage.getItem("extended");
    let decryptable = false;
    const setHeaderData = () => {
        const userRank = localStorage.getItem("rank");
        const userRankExpiration = localStorage.getItem("rank_expiration");
        const userToken = localStorage.getItem("token");
        const username = localStorage.getItem("username");
    
        const gen_premium = localStorage.getItem("gen");
        const UserHeaderData = document.querySelector(".user-info");
    
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
        } else {
            var info_generador = document.querySelector('.data__gen');
            info_generador.style.display = "none";
        }
        if (userRank == "null") {
            let rango_programa = document.querySelector('.data__diavlo');
            rango_programa.style.display = "none";
        }

        if(userExtended === "0"){
            document.querySelector(".mc-result-type-orders").style.cursor = "not-allowed";
        }
    }

    setHeaderData();

    var searching = false;
    var decrypting = false;
    var multipleSearch = false;

    var valorBusqueda = null;
    var resultHashArray = [];

    var actualResults = [];

    var actualMultipleSearchResults = {};
    var ActualNickname = null;

    var logs = document.querySelector("#logs");
    var history = document.querySelector("#history");
    var close_mc = document.querySelector("#close_mc");
    close_mc.addEventListener('click', () => {
        history.style.display = "none";
    });

    logs.addEventListener('click', () => {
        if (history.style.display == "none" || history.style.display == "") {
            ipcRenderer.invoke("MCLogs",{'username':localStorage.getItem("username"),'token': localStorage.getItem("token")}).then(d => {
                // Agregamos los resultados
                var not_found = document.querySelector('#not_found');
                var ol_mc = document.querySelector("#resultados-mc");
                if (d == "no hay logs") {
                    ol_mc.style.display = "none";
                } else {
                    // quitamos el mensajito de alerta
                    ol_mc.style.display = "block";
                    not_found.style.display = "none"
                    while (ol_mc.firstChild) {
                        ol_mc.removeChild(ol_mc.firstChild);
                    }
                    for (let i = 0; i < d.length; i++) {
                        var item = document.createElement("li");
                        item.innerHTML = `<span class="neon-effect">${d[i][0]}</span> (${d[i][1]})`
                        ol_mc.appendChild(item);
                    }
                }
                history.style.display = "flex";
            }).catch(err => {
                loader.style.display = "none";
                searching = false;
                Notification.requestPermission().then(() => {
                    new Notification('Error', {
                        body: 'Ha ocurrido un problema al ver los logs.',
                        icon: '../images/logotipo.png',
                        });
                    });
                });
        } else {
            history.style.display = "none";
        }
    });

    const userToken = window.localStorage.getItem('token');

    const searchButton = document.getElementById("searchButton");
    const searchBar = document.querySelector(".searchBar input");
    const busqueda = document.querySelector("#busqueda");
    const resultsContainer = document.querySelector(".resultsContainer");
    const historyText = document.getElementById("historyText");
    const userStatuDiv = document.querySelector(".userStatus");
    const nickHistory = document.querySelector(".nicknameHistoryContainer");
    const skinContainer = document.querySelector(".skinContainer");
    const skinImg = document.querySelector(".skinContainer img");
    const skinLabel = document.querySelector(".skinContainer label");
    const userStatus = document.querySelector(".userStatus label");

    const nicknameList = document.querySelector(".nicknameList");

    const resultList = document.querySelector(".resultsWrapper");
    const resultOrdersList = document.querySelector(".resultsOrdersWrapper");

    const cuadroGuia = document.querySelector(".default");
    const container_info = document.querySelector(".container_info");
    const infoUser = document.querySelector(".ListNicknames");
    const leftPanel = document.querySelector(".leftPanel");

    const loader = document.querySelector(".loader");

    const decryptButton = document.querySelector(".dehash_button");
    const decryptLoader = document.querySelector(".lds-ellipsis");

    decryptButton.style.display = "none";
    decryptLoader.style.display = "none";


    const resultTypeButtons = document.querySelector(".mc-result-type-selector");

    const resultTypeButtonData = document.querySelector(".mc-result-type-data");

    resultTypeButtonData.addEventListener("click", () => {
        if (!searching && !decrypting) {
            switchTypeResult("data");
        }
    });

    const switchTypeResult = (type) => {
        switch (type) {
            case "data":
                resultTypeButtonData.classList.add("active");
                resultTypeButtonOrders.classList.remove("active");
                resultList.style.display = "grid";
                resultOrdersList.style.display = "none";
                decryptButton.style.display = decryptable ? "block" : "none";
                break;
            case "orders":
                resultTypeButtonData.classList.remove("active");
                resultTypeButtonOrders.classList.add("active");
                resultList.style.display = "none";
                resultOrdersList.style.display = "flex";
                decryptButton.style.display = "none";
                break;
        }
    }

    const resultTypeButtonOrders = document.querySelector(".mc-result-type-orders");
    resultTypeButtonOrders.addEventListener("click", () => {
        if (!searching && !decrypting) {
            if (userExtended === "0"){
                Notification.requestPermission().then(() => {
                    new Notification('Diavlo v3.6', {
                        body: 'Para poder ver las compras debes tener Extended.',
                        icon: '../images/logotipo.png',
                    });
                });
            }else{
                switchTypeResult("orders");
            }
        }
    });

    const listNicknames_results = document.querySelector(".listNicknames_results");

    const clearResults = () => {
        resultHashArray = [];
        valorBusqueda = null;
        decryptButton.style.display = "none";
        decryptLoader.style.display = "none";
        decryptable = false;

        switchTypeResult("data");

        while (resultList.firstChild) {
            resultList.removeChild(resultList.firstChild);
        }
        
        while (nicknameList.firstChild) {
            nicknameList.removeChild(nicknameList.firstChild);
        }

        while (resultOrdersList.firstChild) {
            resultOrdersList.removeChild(resultOrdersList.firstChild);
        }

    }

    const clearNicknamesResults = () => {
        listNicknames_results.innerHTML = "";
    }

    const addSimilarNick = (n) => {
        var nick = document.createElement("li");
        var div = document.createElement("div");
        div.classList.add("usernameHistoryDiv");
        var username = document.createElement("span");
        username.classList.add("extended_mc");
        username.innerHTML = n;
        div.appendChild(username);

        nick.appendChild(div);
        nicknameList.append(nick);
    }

    const updateResults = (results) => {
        results.forEach(result => {
            divRes = resultList.querySelector(`[data-hash="${result.hash}"][data-server="${result.server}"]`);
            divRes.querySelector('.hash-title').innerText = `Contraseña: `;
            divRes.querySelector('.hash').classList.add("found-password");
            divRes.querySelector('.hash').innerText = `${result.decrypted}`;
            divRes.querySelector('.hash').style.fontWeight = "bold";
        });
    };

    const addResultToScreen = (result) => {
        const generalDiv = document.createElement('div')
        generalDiv.setAttribute('data-hash', `${result.hash}`);
        generalDiv.setAttribute('data-server', `${result.server}`);

        generalDiv.className = 'result'

        const bannerImg = document.createElement('img')
        bannerImg.src = `http://status.mclive.eu/Diavlo/${result.serverIP}/banner.png`
        generalDiv.appendChild(bannerImg)

        const username = document.createElement('span')
        username.innerHTML = `Username: <strong>${result.username}</strong>`
        generalDiv.appendChild(username)
        if (result.passwordDecrypted !== null) {
            const divpass  = document.createElement('div')
            divpass.style.display = "flex";
            divpass.style.alignItems = "center";
            divpass.style.gap = "5px";

            const passDecryptedTitle = document.createElement('span')
            passDecryptedTitle.innerText = `Contraseña: `
            const passDecrypted = document.createElement('span')
            passDecrypted.classList.add("found-password")
            passDecrypted.style.fontWeight = "bold";
            passDecrypted.innerText = `${result.passwordDecrypted}`

            divpass.appendChild(passDecryptedTitle)
            divpass.appendChild(passDecrypted)

            generalDiv.appendChild(divpass)

        } else {
            resultHashArray.push({hash: result.hash, server: result.server});
            decryptButton.style.display = "block";
            decryptable = true;

            const divhash  = document.createElement('div')
            divhash.style.display = "flex";
            divhash.style.alignItems = "center";
            divhash.style.gap = "5px";


            const passHashTitle = document.createElement('span')
            passHashTitle.innerText = `Hash: `
            passHashTitle.classList.add("hash-title")
            const hash = document.createElement('span')
            hash.classList.add("hash")
            hash.innerHTML = `<strong>${result.hash}</strong>`
            divhash.appendChild(passHashTitle)
            divhash.appendChild(hash)

            generalDiv.appendChild(divhash)
        }

        if (result.userIP !== null) {
            const userIP = document.createElement('span')
            userIP.innerHTML = `IP: <strong>${result.userIP}</strong>`
            generalDiv.appendChild(userIP)

        }

        if (result.email !== null) {
            const email = document.createElement('span')
            email.innerHTML = `Email: <strong>${result.email}</strong>`
            generalDiv.appendChild(email)
        }

        
        resultList.appendChild(generalDiv)
    }


    const addOrderToScreen = (order) => {
        const orderItem = document.createElement("div");
        orderItem.classList.add("user-order-item");

        const imgDiv = document.createElement("div");
        imgDiv.classList.add("user-order-skin-div");
        const innerSkin = document.createElement("img");
        innerSkin.classList.add("user-order-skin");

        let nick = order['nickname'];
        let item = order['item'];
        let server = order['server'];

        const orderData = document.createElement("div");
        orderData.classList.add("user-order-data");
        const orderNickname = document.createElement("h3");
        orderNickname.innerHTML = nick;
        orderData.appendChild(orderNickname);

        const orderServer = document.createElement("span");
        orderServer.innerHTML = server;


        const orderNickServer = document.createElement("div");
        orderNickServer.classList.add("user-order-nick-server");

        orderNickServer.appendChild(orderNickname);
        orderNickServer.appendChild(orderServer);

        orderData.appendChild(orderNickServer);

        const orderItemDiv = document.createElement("div");
        orderItemDiv.classList.add("user-order-item-div");
        const orderItemTitle = document.createElement("h3");
        orderItemTitle.innerHTML = item;
        orderItemDiv.appendChild(orderItemTitle);

        orderData.appendChild(orderItemDiv);
        orderItem.appendChild(orderData);

        resultOrdersList.appendChild(orderItem);
    }

    infoUser.style.display = "none";

    const validNick = (nick) => {
        let regExpUser = /^[a-zA-Z0-9_*\.]+$/;
        return regExpUser.test(nick) && !(nick.length < 3 || nick.length > 16);
    }

    console.log("Bruteforce DB: " + localStorage.getItem('bruteforce_db'));

    if (localStorage.getItem('bruteforce_db') == undefined) {
        localStorage.setItem('bruteforce_db', 0);
    }

    if (userExtended == 1) {
        let diavloDB = document.querySelector('#tiempo');
        diavloDB.style.display = "block"
        
        document.getElementById("tiempo").value = localStorage.getItem('bruteforce_db');
        diavloDB.addEventListener('input', () => {
            localStorage.setItem('bruteforce_db', diavloDB.value);
            ipcRenderer.invoke('setBruteForceFile', {'token': localStorage.getItem('token'), 'db': diavloDB.value});
        })
    }

    const mostrarPanelSkin = (nickname) => {
        fetch(`https://api.minecraftservices.com/minecraft/profile/lookup/name/${nickname}`, {
                        method: "GET",
                        mode: 'cors',
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        }
                    }).then(r => {
                        if (r.ok) {
                            r.json().then(d => {
                                nickHistory.style.display = "block";
                                skinContainer.style.display = "flex";
                                //skinImg.src = `https://crafatar.com/renders/body/${d.id}?&amp;overlay`
                                skinImg.src = `https://api.mineatar.io/body/full/${d.id}?scale=12`

                                skinLabel.innerHTML = d.name;
                                userStatus.innerHTML = "Cuenta Premium ✅";
        
                                fetch(`https://laby.net/api/v2/user/${d.id}/get-profile`, {
                                    method: "GET",
                                    mode: 'cors',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Access-Control-Allow-Origin': '*'
                                    }
                                })
                                    .then(r => r.json())
                                    .then(d => {
                                        // Agregamos los nuevos li
                                        d.username_history.forEach(p => {
                                            const nick = document.createElement("li");
                                            const div = document.createElement("div");
                                            div.classList.add("usernameHistoryDiv");
        
                                            const username = document.createElement("span");
                                            const date = document.createElement("span");
        
                                            username.innerHTML = p.username;
                                            date.innerHTML = new Date(p.changed_at).toLocaleDateString();
        
                                            div.appendChild(username);
                                            div.appendChild(date);
        
                                            nick.appendChild(div);
                                            nicknameList.prepend(nick);
                                        })
                                    }
                                    )
        
                                userStatuDiv.classList.remove("hidden");
                                historyText.classList.remove("hidden");
        
                            })
                        } else {
                            // Borramos todos los li que estan dentro del ul


                            nickHistory.style.display = "block";
                            skinContainer.style.display = "flex";
                            skinImg.src = "../images/steve.png"
                            skinLabel.innerHTML = nickname;
                            userStatus.innerHTML = "Cuenta Cracked ❌";
        
                            userStatuDiv.classList.remove("hidden");
                            historyText.classList.add("hidden");
                        }
                    }); 
    }

    const switchResults = (nickname) => {

        if (ActualNickname !== nickname){

            if (!userExtended === "1"){
                Notification.requestPermission().then(() => {
                    new Notification('Diavlo v3.6', {
                        body: 'Para poder cambiar el resultado debes ser EXTENDED.',
                        icon: '../images/logotipo.png',
                    });
                });
                return;
            }
    

            ActualNickname = nickname;
            clearResults();
            mostrarPanelSkin(nickname);
            if (!userExtended === "1"){
                Notification.requestPermission().then(() => {
                    new Notification('Diavlo v3.6', {
                        body: 'Para poder cambiar el resultado debes ser.',
                        icon: '../images/logotipo.png',
                    });
                });
                return;
            }

            ipcRenderer.invoke("getUserFromMCCache", nickname).then(d => {

                if(userExtended === "1"){
                    d.orders.forEach(order => addOrderToScreen(order));
                }
                d.results.forEach(server => server.forEach(r => addResultToScreen(r)));
                try{
                    d?.similar_nicks?.forEach(nick => {
                        addSimilarNick(nick)}); 
                }catch(err){
                    console.log(err);
                }

            });
        
        }else{
            return;
        }
    }

    const addNicknamesToResultSelector = (nicknames) => {
        nicknames.forEach(nick => {
            const litem = document.createElement("li");
            litem.classList.add("listNicknames_results_item");
            const head = document.createElement("img");
            head.src = `https://mc-heads.net/head/${nick}`;
            head.height = "32";
            head.width = "32";
            litem.appendChild(head);

            const span = document.createElement("span");
            span.innerHTML = nick;
            litem.appendChild(span);

            litem.addEventListener("click", () => {
                switchResults(nick);
                listNicknames_results.childNodes.forEach(li => {
                    li.classList.remove("activeResultOfList");
                });
                litem.classList.add("activeResultOfList");
            })

            listNicknames_results.appendChild(litem);
        });

        listNicknames_results.firstChild.classList.add("activeResultOfList");
    }

    searchButton.addEventListener("click", (event) => {
        // Evitamos que se nos abra una ventana random en el navegador por el form
        event.preventDefault();
        if(!searching && !decrypting){
            if (multipleSearch){
                let nicknames = [];

                document.querySelectorAll(".multipleSearchTableNickname").forEach(input => {
                    let nick = input.value;
                    if(validNick(nick)){
                        nicknames.push(input.value);
                    }else{
                        Notification.requestPermission().then(() => {
                            new Notification('Error', {
                                body: `Nickname ${nick} inválido.`,
                                icon: '../images/logotipo.png',
                            });
                        });
                    }
                });
                if(nicknames.length > 0){
                    clearResults(); 
                    clearNicknamesResults();
                    leftPanel.style.display = "none";
                    infoUser.style.display = "none";


                    searching = true;
                    valorBusqueda = nicknames[0];

                    cuadroGuia.style.display = "none";
                    container_info.style.display = "none";
    
                    
                    loader.style.display = "block";
                    resultTypeButtons.style.display = "none";

                    ipcRenderer.invoke("MCSearchMultiple",{'nicknames': nicknames.map(n => n.toLowerCase()),'token': userToken}).then(d => {

                        let nicknamesFound = Object.keys(d);

                        addNicknamesToResultSelector(nicknamesFound);
                        infoUser.style.display = "block";

                        leftPanel.style.display = "flex";
                        mostrarPanelSkin(nicknamesFound[0]);
                        ActualNickname = nicknamesFound[0];

                        searching = false;
                        loader.style.display = "none";
                        resultTypeButtons.style.display = "flex";


                        if(userExtended === "1"){
                            d[nicknamesFound[0]].orders.forEach(order => addOrderToScreen(order));
                        }
                        d[nicknamesFound[0]].results.forEach(server => server.forEach(r => addResultToScreen(r)));
                        
                        if(historyText.classList.contains("hidden")){
                            historyText.classList.remove("hidden");
                        }

                        try{
                            d[nicknamesFound[0]]?.similar_nicks?.forEach(nick => {
                                addSimilarNick(nick)});
                        }catch(err){
                            console.log(err);
                        }


                        actualResults = d[nicknamesFound[0]].results;
                        actualMultipleSearchResults = d;

                    })
                }

            } else{
                // Verificamos si el chaval introdujo un nick correcto
                if (!(busqueda.value.length < 3 || busqueda.value.length > 16)) {
                    clearResults(); 
                    clearNicknamesResults();
                    leftPanel.style.display = "none";
                    infoUser.style.display = "none";

                    searching = true;
                    valorBusqueda = searchBar.value;

                    cuadroGuia.style.display = "none";
                    container_info.style.display = "none";

                    
                    loader.style.display = "block";
                    resultTypeButtons.style.display = "none";


                    const regexExp = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi;
                    if(regexExp.test(busqueda.value)){
                        if (userExtended == 0) {
                            Notification.requestPermission().then(() => {
                                new Notification('Diavlo v3.6', {
                                    body: '¡Necesitas el plus EXTENDED para poder realizar una búsqueda por IP!',
                                    icon: '../images/logotipo.png',
                                });
                            });
                            loader.style.display = "none";
                            resultTypeButtons.style.display = "flex";
                            searching = false;
                            return;
                        }
                        ipcRenderer.invoke("MCSearchIP",{'IP':busqueda.value,'token': userToken}).then(d => {
                            // Agregamos los resultados
                            d.results.forEach(server => server.forEach(r => addResultToScreen(r)));
                            // Se lo notificamos al usuario
                            actualResults = d.results;

                            if (d.results.length > 0) {
                                Notification.requestPermission().then(() => {
                                    new Notification('Diavlo v3.6', {
                                        body: 'Se ha completado la búsqueda de Diavlo MC.',
                                        icon: '../images/logotipo.png',
                                    });
                                });
                            } else {
                                Notification.requestPermission().then(() => {
                                    new Notification('Diavlo v3.6', {
                                        body: 'No se ha podido encontrar esta IP.',
                                        icon: '../images/logotipo.png',
                                    });
                                });
                            }

                            loader.style.display = "none";
                            resultTypeButtons.style.display = "flex";
                            searching = false;
                        }).catch(err => {
                            loader.style.display = "none";
                            resultTypeButtons.style.display = "flex";

                            searching = false;
                            Notification.requestPermission().then(() => {
                                new Notification('Error', {
                                    body: 'Ha ocurrido un problema al realizar la búsqueda.',
                                    icon: '../images/logotipo.png',
                                    });
                                });
                            });
                    }else{
                        let regExpUser = /^[a-zA-Z0-9_*\.]+$/;
                        if (!regExpUser.test(busqueda.value)){
                            loader.style.display = "none";
                            resultTypeButtons.style.display = "flex";

                            searching = false;
                            Notification.requestPermission().then(() => {
                                new Notification('Error', {
                                    body: 'Nickname inválido.',
                                    icon: '../images/logotipo.png',
                                    });
                            });
                            return;
                        
                        }

                        ipcRenderer.invoke("MCSearch",{'username':busqueda.value,'token': userToken}).then(d => {
                            addNicknamesToResultSelector([busqueda.value]);
                            infoUser.style.display = "block";

                            leftPanel.style.display = "flex";
                            mostrarPanelSkin(busqueda.value);

                            ActualNickname = busqueda.value;


                            if(userExtended === "1"){
                                d.orders.forEach(order => addOrderToScreen(order));
                            }
                            d.results.forEach(server => server.forEach(r => addResultToScreen(r)));
                            
                            if(historyText.classList.contains("hidden")){
                                historyText.classList.remove("hidden");
                            }

                            try{
                                d?.similar_nicks?.forEach(nick => {
                                    addSimilarNick(nick)});
                            }catch(err){
                                console.log(err);
                            }


                            actualResults = d.results;

                            if (d.results.length > 0) {
                                Notification.requestPermission().then(() => {
                                    new Notification('Diavlo v3.6', {
                                        body: 'Se ha completado la búsqueda de Diavlo MC.',
                                        icon: '../images/logotipo.png',
                                    });
                                });
                            } else {
                                Notification.requestPermission().then(() => {
                                    new Notification('Diavlo v3.6', {
                                        body: 'No se ha podido encontrar este usuario.',
                                        icon: '../images/logotipo.png',
                                    });
                                });
                            }
                            loader.style.display = "none";
                            resultTypeButtons.style.display = "flex";

                            searching = false;
                        }).catch(err => {
                            loader.style.display = "none";
                            resultTypeButtons.style.display = "flex";

                            searching = false;
                            });
                    }
                } else {
                    event.preventDefault();
                    Notification.requestPermission().then(() => {
                        new Notification('Diavlo v3.6', {
                            body: '¡Usuario inválido! Debe tener al menos 3 caracteres y como máximo 16 caracteres.',
                            icon: '../images/logotipo.png',
                        });
                    });
                }
            } 


            
        }
    });

    decryptButton.addEventListener("click", (event) => {
        event.preventDefault();
        decryptButton.style.display = "none";
        decryptLoader.style.display = "block";
        if(!decrypting && resultHashArray.length > 0){
            decrypting = true;
            ipcRenderer.invoke('decryptListMC', {'hashList': resultHashArray,'inputValue': ActualNickname, 'token': userToken}).then(d => {
                updateResults(d);
                decryptLoader.style.display = "none";
                decrypting = false;
            }).catch(err => {
                decryptLoader.style.display = "none";
                decrypting = false;

            })
        }
    })

    const multipleSearchDiv = document.querySelector(".multipleSearchDiv");

    const multipleSearchInputDiv = document.querySelector(".MultipleSearchInputDiv");
    const normalSearch = document.getElementById("busqueda");

    const clearInputs = () => {
        normalSearch.value = "";
        document.getElementById("first_row").querySelector("input").value = "";
        while (MultipleSearchTableBody.childNodes.length > 2) {
            MultipleSearchTableBody.removeChild(MultipleSearchTableBody.lastChild);
        }
    }


    const toggleMultipleSearch = () => {
        multipleSearch = !multipleSearch;

        multipleSearchDiv.classList.toggle("activeMultipleSearch");
        multipleSearchInputDiv.classList.toggle("hidden");
        normalSearch.classList.toggle("hidden");
        document.querySelector(".searchBar button").classList.toggle("activeMultipleSearchSearchButton");

        clearInputs();

    }

    multipleSearchDiv.addEventListener("click", () => {
        if (!searching && !decrypting) {
            if (userExtended === "0"){
                Notification.requestPermission().then(() => {
                    new Notification('Diavlo v3.6', {
                        body: 'Para poder activar la búsqueda multiple necesitas EXTENDED.',
                        icon: '../images/logotipo.png',
                    });
                });
            }else{
                toggleMultipleSearch();
            }
        }
    });

    const createMultipleSearchRow = () => {

        if (MultipleSearchTableBody.childNodes.length > 10){
            Notification.requestPermission().then(() => {
                new Notification('Diavlo v3.6', {
                    body: 'No puedes agregar más de 10 nicknames.',
                    icon: '../images/logotipo.png',
                });
            });
            return;
        }

        const row = document.createElement("tr");
        const td = document.createElement("td");
        const div = document.createElement("div");
        div.classList.add("nicknameTableRow");
        const input = document.createElement("input");
        input.classList.add("multipleSearchTableNickname");
        input.type = "text";
        input.placeholder = "Nickname de MC";
        input.minLength = "3";
        input.maxLength = "16";
        const span = document.createElement("span");
        span.classList.add("MultipleSearchReduceSpan");
        span.innerHTML = "-";
        span.addEventListener("click", () => {
            if (!searching && !decrypting) {
                row.remove();
            }
        });
        div.appendChild(input);
        div.appendChild(span);
        td.appendChild(div);
        row.appendChild(td);
        return row;
    }

    const MultipleSearchTableBody = document.querySelector(".MultipleSearchTableBody");

    const MultipleSearchAddSpan = document.querySelector(".MultipleSearchAddSpan");
    MultipleSearchAddSpan.addEventListener("click", (e) => {
        e.preventDefault();
        if (!searching && !decrypting) {
            if (userExtended === "0"){
                return;
            }else{
                MultipleSearchTableBody.appendChild(createMultipleSearchRow());
            }
        }
    });



    const backButton = document.querySelector(".HeaderHome");

    // Evento para el boton de volver atrás
    backButton.addEventListener("click", () => {
        if (!searching && !decrypting) {
            ipcRenderer.invoke("goIndex");
        }
        
    });

    const exportButton = document.querySelector(".exportBtnMC");
    exportButton.addEventListener("click", () => {
        if (!searching && (actualResults.length > 0) || (Object.keys(actualMultipleSearchResults).length > 0)){
            let datos = ""

            if (multipleSearch){
                Object.keys(actualMultipleSearchResults).forEach(nick => {
                    let nickRes = actualMultipleSearchResults[nick].results
                    nickRes.forEach(server => {
                        datos += `Server: ${server[0].serverIP}\nNick: ${server[0].username}\n${server[0].passwordDecrypted != null ? "Password: " + server[0].passwordDecrypted : `Hash: ${server[0].hash}${server[0].salt != null ? "\nSalt: " + server[0].salt+"\n" : ""}`}\nIP: ${server[0].userIP}${server[0].email != null ? "\nEmail: " + server[0].email : ""}\n==================\n`;
                    })
                });
                ipcRenderer.invoke("exportarArchivo", {datos: datos, nombre: ActualNickname + "+Otros"});

            }else{
                actualResults.forEach(r => datos += `Server: ${r[0].serverIP}\nNick: ${r[0].username}\n${r[0].passwordDecrypted != null ? "Password: " + r[0].passwordDecrypted : `Hash: ${r[0].hash}${r[0].salt != null ? "\nSalt: " + r[0].salt+"\n" : ""}`}\nIP: ${r[0].userIP}${r[0].email != null ? "\nEmail: " + r[0].email : ""}\n==================\n`)
                ipcRenderer.invoke("exportarArchivo", {datos: datos, nombre: ActualNickname});

            }

        }
    });

    let fileInput = document.querySelector('#fileInput');

    function validateLine(line) {
        const regex = /^[A-Za-z0-9_]{3,16}$/;
        return regex.test(line);
    }

    fileInput.addEventListener('change', function(event) {
        if (userExtended == "1") {
            // Importamos el archivo
            //toggleMultipleSearch();
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const lines = e.target.result.split('\n').map(line => line.trim());
                    let validLines = [];
                    const invalidLines = [];

                    for (let line of lines) {
                        if (validateLine(line)) {
                            if (validLines.includes(line)) continue;
                            validLines.push(line);
                        } else {
                            invalidLines.push(line);
                        }
                        if (validLines.length >= 10) break;
                    }

                    if (validLines.length === 0) {
                        ipcRenderer.invoke('importMCError');
                    } else {
                        multipleSearch = !multipleSearch;

                        multipleSearchDiv.classList.toggle("activeMultipleSearch", true);
                        multipleSearchInputDiv.classList.toggle("hidden", false);
                        normalSearch.classList.toggle("hidden", true);
                        document.querySelector(".searchBar button").classList.toggle("activeMultipleSearchSearchButton", false);
                
                        clearInputs();
                        const MultipleSearchTableBody = document.querySelector(".MultipleSearchTableBody");
                        validLines = Array.from(validLines);
                        for (let i = 0; i < validLines.length-1; i++) {
                            MultipleSearchTableBody.appendChild(createMultipleSearchRow());
                        }
                        const rows = document.querySelectorAll('.MultipleSearchTableBody tr');
                        // Iterar sobre cada fila y establecer el valor del input a "masonrapa"
                        counter = 0;
                        rows.forEach(row => {
                            const input = row.querySelector('input[type="text"]');
                            if (input) {
                                input.value = validLines[counter];
                            }
                            counter++;
                        });

                        }
                    multipleSearch = true;
                    // Reseteamos el fichero para que pueda volver a ser elegido
                    fileInput.value = '';
                };
                reader.readAsText(file);
            }
        }  else {
            ipcRenderer.invoke('importMC');
        }
    });

});
