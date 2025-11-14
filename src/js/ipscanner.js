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
    let results = null;
    let last_ip = null;

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

    const isValidIP = (ip) => {
        // Expresión regular para IPv4
        const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

        return ipv4Regex.test(ip);
    }

    const showResults = (res) => {
        let resultTitle = document.querySelector(".resultTitle");
        resultTitle.textContent = `Resultados del scanner para la IP: ${res.ip}`;

        let ResList = document.querySelector(".resultList");
        res?.open?.forEach(port => {
            let dataPuerto = res.detailed[String(port)];
            let portListItem = document.createElement("li");
            const divItemPort = document.createElement("div");
            divItemPort.classList.add("itemPort")
            divItemPort.classList.add(dataPuerto.status === "No es un servidor de Minecraft" ? "itemNotMinecraftPort" : "itemPort");
            
            
            const portTitle = document.createElement("h3");
            portTitle.textContent = `${res.ip}:${port}`;
            portTitle.addEventListener("click", () => {
                clipboard.writeText(`${res.ip}:${port}`);
            });
            const portStatus = document.createElement("span");
            portStatus.textContent = dataPuerto.status;
            portStatus.classList.add(dataPuerto.status === "No es un servidor de Minecraft" ? "status_not_minecraft" : "status_minecraft");

            divItemPort.appendChild(portTitle);
            divItemPort.appendChild(portStatus);
            portListItem.appendChild(divItemPort);

            if(dataPuerto.status === "Servidor de Minecraft"){
                const divItemMinecraft = document.createElement("div");
                const bannerImg = document.createElement('img')
                divItemMinecraft.classList.add("itemMinecraftBanner");
                bannerImg.src = `http://status.mclive.eu/Diavlo/${res.ip}/${port}/banner.png`
                divItemMinecraft.appendChild(bannerImg)
                portListItem.appendChild(divItemMinecraft);
            }

            ResList.appendChild(portListItem);

        });
    }

    

    let form_mc = document.getElementById('form_mc');
    form_mc.addEventListener('submit', (e) => {
        e.preventDefault();

        if(!searching){
            const ip = document.getElementById("busqueda").value;
            if(ip){
                if (!isValidIP(ip)) {
                    ipcRenderer.invoke("errorIPScan");
                    return;
                }
                searching = true;
                document.querySelector(".loader").style.display = "block";
                clearResults();
                ipcRenderer.invoke("scanFullIp", {ip: ip, token: userToken}).then((res) => {
                    //res = JSON.parse(res);
                    //console.log("RES " + res);
                    searching = false;
                    results = res;
                    last_ip = ip;
                    document.querySelector(".loader").style.display = "none";
                    showResults(res);       

                });
            }
        }
    })

    const scanButton = document.getElementById("searchButton");
    scanButton.addEventListener("click", () => {
        if(!searching){
            const ip = document.getElementById("busqueda").value;
            if (!isValidIP(ip)) {
                ipcRenderer.invoke("errorIPScan");
                return;
            }
            if(ip){
                searching = true;
                document.querySelector(".loader").style.display = "block";
                clearResults();
                ipcRenderer.invoke("scanFullIp", {ip: ip, token: userToken}).then((res) => {
                    //res = JSON.parse(res);
                    //console.log("RES " + res);
                    searching = false;
                    results = res;
                    last_ip = ip;
                    document.querySelector(".loader").style.display = "none";
                    showResults(res);       

                });
            }
        }
    });

    const exportButton = document.querySelector(".exportBtn");
    exportButton.addEventListener("click", () => {
        if(results){
            ipcRenderer.invoke("exportarArchivo", {'datos': JSON.stringify(results),'nombre': `escaneo_${last_ip}.txt`});
        }
    });
});