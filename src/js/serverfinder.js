const { clipboard } = require('electron/common');

window.addEventListener('load', () => {
    const { ipcRenderer } = require("electron");
    const userRank = localStorage.getItem("rank");
    const userRankExpiration = localStorage.getItem("rank_expiration");
    const userExtended = localStorage.getItem("extended");
    const userToken = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    

    const setHeaderDataAndDisableOptions = () => {
        const UserHeaderData = document.querySelector(".user-info");
    
        UserHeaderData.querySelector('.usernameHeader').innerHTML = username;
        UserHeaderData.querySelector('.rank-data h3').innerHTML = userRank + `${userExtended === "1" ? " +" : ""}`;
        var timeDiff = new Date(userRankExpiration).getTime() - new Date().getTime();
        var daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        UserHeaderData.querySelector('.rank-data span').innerHTML = `${daysRemaining} Dias`;
    
        const gen_premium = localStorage.getItem("gen");
        const gen_vip = localStorage.getItem("gen_vip");
        const gen_master = localStorage.getItem("gen_master");
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
    
        if (userToken === null) {
            window.close();
        }
    }

    setHeaderDataAndDisableOptions();

    let searching = false;
    let currentData = []
    let lastVersion = "";

    const backButton = document.querySelector(".HeaderHome");

    // Evento para el boton de volver atrás
    backButton.addEventListener("click", () => {
        if(!searching){
            ipcRenderer.invoke("goIndex");
        }        
    });
    
    const goBackTools = document.querySelector(".gobacktools");
    goBackTools.addEventListener("click", () => {
        if(!searching){
            ipcRenderer.invoke("openTools");
        }
    });
    
    const clearResults = () => {
        let resultTitle = document.querySelector(".resultTitle");
        resultTitle.textContent = "";

        let ResList = document.querySelector(".resultList");
        ResList.innerHTML = "";
    }

    let form_mc = document.getElementById('form_mc');
    form_mc.addEventListener('submit', (e) => {
        console.log("SIII");
        e.preventDefault();
    })
    form_mc.addEventListener('click', (e) => {
        console.log("NOOO");
        e.preventDefault();
    })

    let searchBar = document.querySelector('.searchBar');
    searchBar.addEventListener('click', (e) => {
        e.preventDefault();
    });


    const appendResultsToScreen = (data,query) => {
        document.querySelector(".resultTitle").textContent = `Resultados de la busqueda: ${query} [ ${data.length} resultados ]`;
        let ResList = document.querySelector(".resultList");

        data.forEach(server => {
            let divGrande = document.createElement("div");
            divGrande.classList.add("serverFound");

            let divLeft = document.createElement("div");
            divLeft.classList.add("motdServer");

            let img = document.createElement("img");
            img.src = `http://status.mclive.eu/Diavlo/${server['ip_str']}/banner.png`;
            img.classList.add("serverBanner");

            img.onclick = () => {
                clipboard.writeText(server['ip_str']);
                new Notification("Diavlo v3.1", {
                    body: `La IP ${server['ip_str']} ha sido copiada al portapapeles.`,
                    icon: '../images/logotipo.png',
                });
            }

            img.onerror = () => {
                img.src = "../images/unknownFavicon.webp";
            }

            divLeft.appendChild(img);

            try{
                let downBannerDiv = document.createElement("div");
                downBannerDiv.classList.add("downBanner");

                let ipinfoDiv = document.createElement("div");
                ipinfoDiv.classList.add("ipinfo");

                let bandera = document.createElement("img");
                bandera.src = `https://flagsapi.com/${server['location']['country_code']}/flat/32.png`;
                bandera.height = "32";
                bandera.width = "32";
                bandera.classList.add("bandera");

                let isp = document.createElement("span");
                isp.classList.add("isp");
                isp.textContent = server['isp'];



                ipinfoDiv.appendChild(bandera);
                ipinfoDiv.appendChild(isp);

                downBannerDiv.appendChild(ipinfoDiv);

                let version = document.createElement("span");
                version.classList.add("version");
                version.textContent = server['minecraft']['version']['name'];

                downBannerDiv.appendChild(version);

                divLeft.appendChild(downBannerDiv);

                let actionDiv = document.createElement("div");
                actionDiv.classList.add("actionDiv");

                let scanButton = document.createElement("button");
                scanButton.classList.add("scanButton");

                scanButton.textContent = "Escanear Puertos";

                scanButton.onclick = () => {
                    scanButton.textContent = "Escaneando...";
                    scanButton.disabled = true;

                    ipcRenderer.invoke("scanMCIP",{'ip': server['ip_str'], 'token': userToken}).then((results) => {
                        console.log(results);
                        results = results.result;
                        if(results.length === 0){
                            new Notification("Diavlo v3.1", {
                                body: `No se han encontrado puertos para la IP ${server['ip_str']}.`,
                                icon: '../images/logotipo.png',
                            });

                        }else{
                            new Notification("Diavlo v3.1", {
                                body: `Se ha terminado de escanear la IP ${server['ip_str']}.`,
                                icon: '../images/logotipo.png',
                            });
                            let scanResults = document.createElement("ul");
                            scanResults.classList.add("scanResults");
                            scanResults.style.display = "none";
    
                            let hr = document.createElement("hr");
    
                            scanResults.appendChild(hr);
    
                            let scanResultsTitle = document.createElement("h4");
                            scanResultsTitle.textContent = "Resultados del escaneo:";
                            scanResults.appendChild(scanResultsTitle);
                            
                            results.forEach(result => {
                                let scanResult = document.createElement("li");
                                scanResult.classList.add("scanResult");
                                scanResult.textContent = "Puerto: " + result['port'] + " [ Jugadores: " + result['players'] + "/" + result['maxPlayers'] + " | Versión: " + result['version'] + " | MOTD: " + result['motd'] + " ]";
                                scanResults.appendChild(scanResult);
                            });
    
                            actionDiv.appendChild(scanResults);
                            scanResults.style.display = "flex";
                        }
                        scanButton.style.display = "none";
                    }).catch((err) => {
                        console.log(err);
                    });
            
                }

                actionDiv.appendChild(scanButton);

                divLeft.appendChild(actionDiv);

            }catch(err){
                console.log(err);
            }			

            divGrande.appendChild(divLeft);



            ResList.appendChild(divGrande);
        });

    }

    const startSearch = document.getElementById('searchButton');

    startSearch.addEventListener('click', (e) => {
        e.preventDefault();
        let query = document.getElementById('busqueda').value

        if(!searching){
            if (query != undefined && query != "" && query != null) {
                clearResults();
                document.querySelector(".loader").style.display = "block";
                searching = true;
                ipcRenderer.invoke("startServerFinder",{token: userToken, query: query}).then((res) => {
                    console.log(res);
                    appendResultsToScreen(res,query);
                    currentData = res;
                    lastVersion = query;
                    document.querySelector(".loader").style.display = "none";
                    searching = false;
                }).catch((err) => {
                    document.querySelector(".loader").style.display = "none";
                    searching = false;
                });
            }
        }
    });
    
    const exportbtn = document.querySelector('.exportBtn');

    exportbtn.addEventListener('click', (e) => {
        e.preventDefault();

        if(currentData != undefined && currentData != null && currentData.length > 0){
            
            let data = currentData.map(server => {
                try{
                        return `--------------------------------\n${server['ip_str']}\n${server['data']}`
    
                }catch(err){
                        return `--------------------------------\n${server['ip_str']}\n${server['data']}`
    
                    }
    
                }
                ).join("\n");

            ipcRenderer.invoke("exportarArchivo",{'datos': data,'nombre': lastVersion});
            
        }
    });
});