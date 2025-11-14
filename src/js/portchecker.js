const { check } = require("is-in-subnet");

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

    const backButton = document.querySelector(".HeaderHome");

    // Evento para el boton de volver atrás
    backButton.addEventListener("click", () => {
        ipcRenderer.invoke("goIndex");              
    });

    const goBackTools = document.querySelector(".gobacktools");
    goBackTools.addEventListener("click", () => {
        ipcRenderer.invoke("openTools");
    });

    const getStatus = (type) =>  {
        switch(type){   
            case "PREMIUM":
            case "UNKNOWN DATA IN LOGIN HOSTNAME":
                return "Premium";
            case "DISCONNECTED":
                return "Desconectado";
            default:
                return "Conectado";
        }
    }

    const resultList = document.querySelector(".resultListPortChecker");
    const addResult = (res) => {

        let status = getStatus(String(res.type).toUpperCase());


        const resultItem = document.createElement("div");
        resultItem.classList.add("resultPortCheckerItem");
        resultItem.setAttribute("data-status", status.toLowerCase());

        const titleResDiv = document.createElement("div");
        titleResDiv.classList.add("titleResDiv");

        const ipportdiv = document.createElement("div");
        ipportdiv.classList.add("ipportdiv");

        const ipport = document.createElement("span");
        ipport.textContent = res.ip + ":" + res.port;

        ipportdiv.appendChild(ipport);

        const statusDiv = document.createElement("div");
        statusDiv.classList.add("statusDiv");


        const statusIcon = document.createElement("div");
        statusIcon.classList.add("statusIcon");
        statusIcon.classList.add(status.toLowerCase());

        const statusText = document.createElement("span");
        statusText.textContent = status;

        statusDiv.appendChild(statusIcon);
        statusDiv.appendChild(statusText);

        titleResDiv.appendChild(ipportdiv);
        titleResDiv.appendChild(statusDiv);

        resultItem.appendChild(titleResDiv);

        const innerResultDiv = document.createElement("div");
        innerResultDiv.classList.add("innerResultDiv");

        const moreInfoDiv = document.createElement("div");
        moreInfoDiv.classList.add("moreInfoDiv");

        const infoVersionDiv = document.createElement("div");
        infoVersionDiv.classList.add("infoVersionDiv");

        const moreInfoVersion = document.createElement("span");
        moreInfoVersion.textContent = "Versión: " + res.version;

        infoVersionDiv.appendChild(moreInfoVersion);

        const moreInfoProtocol = document.createElement("span");
        moreInfoProtocol.textContent = "Protocolo: " + res.protocol;

        infoVersionDiv.appendChild(moreInfoProtocol);

        const moreInfoReason = document.createElement("span");
        moreInfoReason.classList.add("moreReasonInfo");
        moreInfoReason.textContent = "Razón: " + res.message;

        moreInfoDiv.appendChild(infoVersionDiv);
        moreInfoDiv.appendChild(moreInfoReason);
        

        const bannerImg = document.createElement("img");
        bannerImg.src = `http://status.mclive.eu/Diavlo/${res.ip}/${res.port}/banner.png`;

        innerResultDiv.appendChild(bannerImg);
        
        innerResultDiv.appendChild(moreInfoDiv);

        resultItem.appendChild(innerResultDiv); 

        resultList.appendChild(resultItem);
    }

    let checking = false;
    let actualResults = [];

    const startLoading = () => {
        const loading = document.querySelector(".loader");
        loading.style.display = "block";

        document.querySelector(".welcome_message").classList.toggle("hidden", true);
        checking = true;
    }

    const stopLoading = () => {
        const loading = document.querySelector(".loader");
        loading.style.display = "none";

        checking = false;
    }

    const clearResults = () => {
        const items = document.querySelectorAll(".resultPortCheckerItem");
        items.forEach(item => {
            item.remove();
        });
        document.querySelector(".welcome_message").classList.toggle("hidden", true);

    }

    const startCheckBtn = document.getElementById("searchButton");
    const fileInput = document.getElementById("busqueda");

    startCheckBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (fileInput.files.length === 0) {
            return;
        }else{
            clearResults();

            let file = fileInput.files[0];
            let scan_type = document.querySelector('input[name="searchType"]:checked').value;
            startLoading();
            ipcRenderer.invoke("checkPorts", {'file': file.path,'token': userToken,'scan_type': scan_type}).then((res) => {
                res.forEach(ipport => {
                    addResult(ipport);
                });
                stopLoading();
                document.querySelector(".filtros_div").classList.toggle("hidden", false);
                actualResults = res;
            }).catch((err) => {
                stopLoading();
            });
        }
    });

    const selectionFilter = document.getElementById("selection_filter");

    selectionFilter.addEventListener("change", (e) => {
        const value = e.target.value;
        const items = document.querySelectorAll(".resultPortCheckerItem");
        items.forEach(item => {
            if (value === "all") {
                item.style.display = "block";
            } else {
                if (item.getAttribute("data-status") === value) {
                    item.style.display = "block";
                } else {
                    item.style.display = "none";
                }
            }
        });
    });

    const exportBtn = document.querySelector(".export");
    exportBtn.addEventListener("click", () => {
        const datosExtraidos = [];
        const items = document.querySelectorAll('.resultListPortChecker .resultPortCheckerItem');
        if (items.length == 0) {
            return;
        }
        // Recorre cada item
        items.forEach(item => {
            // Extrae la IP y el puerto
            const ipPort = item.querySelector('.ipportdiv span').textContent;

            // Extrae el estado
            const estado = item.querySelector('.statusDiv span').textContent;

            // Extrae la versión
            const version = item.querySelector('.infoVersionDiv span').textContent;

            // Extrae la razón
            const razon = item.querySelector('.moreInfoDiv .moreReasonInfo').textContent;
            // Almacena los datos en el array
            datosExtraidos.push({
                ipPort,
                estado,
                version,
                razon
            });
        });

        datos = "";
        datosExtraidos.forEach(dato => {
            datos += "IP:PORT » " + dato.ipPort + "\n";
            datos += "Estado » " + dato.estado+ "\n";
            datos += "Versión » " + dato.version+ "\n";
            let razon = dato.razon.trim().replace("Razón:", "");
            if (razon.length > 0) {
                datos += "Razón » " + razon + "\n";
            }
            datos += "\n";
        })

        // Imprime los datos extraídos
        const randomNumber = Math.random();
        ipcRenderer.invoke("exportarArchivo", {'nombre': randomNumber + '_MasscanChecked','datos':datos});
    });

});