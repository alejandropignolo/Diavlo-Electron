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


    const filterGriefing = document.querySelector(".filter-griefing");
    const filterCuentas = document.querySelector(".filter-cuentas");
    const searchFilter = document.getElementById("searchFilter");


    const gridTools = document.querySelector(".toolsGrid");

    const filtrarTools = () => {

        
        let filterGriefingValue = filterGriefing.checked;
        let filterCuentasValue = filterCuentas.checked;
        let searchFilterValue = searchFilter.value.toLowerCase();
        
        let tools = gridTools.querySelectorAll(".tool");

        tools.forEach(tool => {
            let toolName = tool.querySelector("h3").innerHTML.toLowerCase();
            let toolType = tool.getAttribute("data-tool-type").toLowerCase();
        
            if(toolName.includes(searchFilterValue) && (toolType === "griefing" && filterGriefingValue || toolType === "cuentas" && filterCuentasValue)) {
                tool.parentNode.classList.remove("hidden");
            } else {
                tool.parentNode.classList.add("hidden");
            }
        });a

    }

    filterGriefing.addEventListener('change', filtrarTools);
    filterCuentas.addEventListener('change', filtrarTools);
    searchFilter.addEventListener('input', filtrarTools);



    const nickfinder = document.getElementById("nick_finder");

    nickfinder.addEventListener("click", () => {
        ipcRenderer.invoke("goNickfinder");
    });
    
    const domain_lookup = document.getElementById("domain_lookup");

    domain_lookup.addEventListener('click', () => {
        ipcRenderer.invoke("goDomainLookup");
    })
    
    const server_finder = document.getElementById("server_finder");

    server_finder.addEventListener('click', () => {
        ipcRenderer.invoke("goServerFinder");
    })

    const buycraft = document.getElementById("buycraft");

    buycraft.addEventListener('click', () => {
        ipcRenderer.invoke("goBuycraftManager");
    })

    const ipscanner = document.getElementById("scanip");
    ipscanner.addEventListener('click', () => {
        ipcRenderer.invoke("goIPScanner");
    })

    const nickscrapper = document.getElementById("nickscrapper");

    nickscrapper.addEventListener('click', () => {
        ipcRenderer.invoke("goNickScrapper");
    })

    const masscan = document.getElementById('masscan');
    masscan.addEventListener('click', () => {
        ipcRenderer.invoke("goMasscan");
    })

    const portchecker = document.getElementById("portchecker");

    portchecker.addEventListener('click', () => {
        ipcRenderer.invoke("goPortChecker");
    });
});