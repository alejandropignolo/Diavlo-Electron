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

    let currentData = {};

    const exportButton = document.querySelector(".exportBtn");

    exportButton.addEventListener("click", () => {
        if (currentData.length > 0) {

            data = currentData.map(nick => `${nick.nickname} - ${nick.premium ? "Premium" : "Cracked"} - ${nick.rank} - ${nick.server}`).join('\n');
            ipcRenderer.invoke("exportarArchivo",{'datos': data,'nombre': "nickfinder"});

        }
    });
    
    const goBackTools = document.querySelector(".gobacktools");
    goBackTools.addEventListener("click", () => {
        ipcRenderer.invoke("openTools");
    });


    const addResultsToTable = (results) => {
        const tResults = document.querySelector(".resultList");

        results.forEach(nick => {
            
            const tr = document.createElement("tr");
            tr.setAttribute("data-cracked", nick.premium);

            const td = document.createElement("td");
            td.classList.add("skinBox");
            const innerSkin = document.createElement("img");
            innerSkin.setAttribute("src", nick.premium ? `https://mc-heads.net/body/${nick.nickname}/right"` : "../images/steve.png");
            innerSkin.setAttribute("alt", nick.nickname);
            innerSkin.height = '120';
            innerSkin.width = '50';

            td.appendChild(innerSkin);

            const td2 = document.createElement("td");
            const td2InnerDiv = document.createElement("div");
            td2InnerDiv.classList.add("resultNickInfo");
            const spanNick = document.createElement("span");
            spanNick.classList.add("resultNick");
            spanNick.innerHTML = nick.nickname;

            const spanPremium = document.createElement("span");
            spanPremium.classList.add(nick.premium ? "resultPremium" : "resultCracked");
            spanPremium.innerHTML = nick.premium ? "Premium" : "Cracked";

            td2InnerDiv.appendChild(spanNick);
            td2InnerDiv.appendChild(spanPremium);
            td2.appendChild(td2InnerDiv);

            const td3 = document.createElement("td");
            const rankSpan = document.createElement("span");
            rankSpan.classList.add("resultrank");
            rankSpan.innerHTML = nick.rank;
            td3.appendChild(rankSpan);

            const td4 = document.createElement("td");
            const serverSpan = document.createElement("span");

            serverSpan.classList.add("resultServer");
            serverSpan.innerHTML = nick.server;
            td4.appendChild(serverSpan);

            tr.appendChild(td);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tr.appendChild(td4);

            tResults.appendChild(tr);

        })

    
    }

    const startFinder = () => {
        document.querySelector(".loader").style.display = "block";
        ipcRenderer.invoke("nickFinder",{'token': userToken}).then((results) => {
            currentData = results;
            if (results.length > 0) {
                    addResultsToTable(results);
                    document.querySelector(".loader").style.display = "none";
            }else{
                document.querySelector(".loader").style.display = "none";
            }
        }).catch((err) => {
            document.querySelector(".loader").style.display = "none";
        });

    }

    startFinder();


    const filterCuentas = document.querySelector(".filter-cracked");

    const listaCuentas = document.querySelectorAll(".resultList");

    const filtrarCuentas = () => {
        
        let filterCuentasValue = filterCuentas.checked;
        
        if (listaCuentas.length > 0){
            listaCuentas.forEach(lista => {
                lista.querySelectorAll("tr").forEach(tr => {
                    if(!filterCuentasValue) {
                        if(tr.getAttribute("data-cracked") === "1") {
                            tr.style.display = "none";
                        }
                    }else{
                        tr.style.display = "flex";
                    }
                })
            })
        }
    }

    filterCuentas.addEventListener('change', filtrarCuentas);
    

});