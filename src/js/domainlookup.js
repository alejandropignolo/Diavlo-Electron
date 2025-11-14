const { isInSubnet } = require('is-in-subnet');

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

    let cloudflare_rangesipv4 = ["173.245.48.0/20",
    "103.21.244.0/22",
    "103.22.200.0/22",
    "103.31.4.0/22",
    "141.101.64.0/18",
    "108.162.192.0/18",
    "190.93.240.0/20",
    "188.114.96.0/20",
    "197.234.240.0/22",
    "198.41.128.0/17",
    "162.158.0.0/15",
    "104.16.0.0/13",
    "104.24.0.0/14",
    "172.64.0.0/13",
    "131.0.72.0/22",
    "104.16.0.0/12"]

    let cloudflare_rangesipv6 = ["2400:cb00::/32",
    "2606:4700::/32",
    "2803:f800::/32",
    "2405:b500::/32",
    "2405:8100::/32",
    "2a06:98c0::/29",
    "2c0f:f248::/32"]

    let searching = false;
    let currentData = {};
    let lastDomain = "";

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

    const startLookup = document.getElementById('searchButton');

    startLookup.addEventListener('click', (e) => {
        e.preventDefault();
        let domain = document.getElementById('busqueda').value

        if(!searching){
            if (domain != undefined && domain != "" && domain != null) {
                clearResults();
                document.querySelector(".loader").style.display = "block";
                searching = true;
                ipcRenderer.invoke("startDomainLookup",{token: userToken, domain: domain}).then((res) => {
                    appendResultsToScreen(res,domain);
                    currentData = res;
                    lastDomain = domain;
                    document.querySelector(".loader").style.display = "none";
                    searching = false;
                }).catch((err) => {
                    document.querySelector(".loader").style.display = "none";
                    searching = false;
                });
            }
        }
    });


    const appendResultsToScreen = (data,domain) => {

        let resultTitle = document.querySelector(".resultTitle");
        resultTitle.textContent = `Resultados para: ${domain} [${data.domain_ip}]`;

        let ResList = document.querySelector(".resultList");
        
        let divRelatedIps = document.createElement("div");
        divRelatedIps.classList.add("relatedIps");

        let titleIPS = document.createElement("div");
        titleIPS.classList.add("titleIPS");

        let textRelatedIps = document.createElement("h3");
        textRelatedIps.innerHTML = "IPs relacionadas";


        let dropdownIMG = document.createElement("img");
        dropdownIMG.classList.add("dropdownIMG");
        dropdownIMG.src = "../images/dropdown.png";
        dropdownIMG.height = "40";
        dropdownIMG.width = "40";


        titleIPS.appendChild(textRelatedIps);
        titleIPS.appendChild(dropdownIMG);

        divRelatedIps.appendChild(titleIPS);

        if(data.related_ips.length > 0){
            let dropdownList = document.createElement("ul");
            dropdownList.classList.add("dropdownIpsList");

            data.related_ips.forEach(ip => {

                let is_cf = false;
                try {
                    is_cf = ip.includes("cloudflare.com") || cloudflare_rangesipv4.map(range => isInSubnet(ip, range)).includes(true) || cloudflare_rangesipv6.map(range => isInSubnet(ip, range)).includes(true);
                } catch (error) {
                }

                let li = document.createElement("li");
                li.classList.add("dropdownIpsItem");
                li.innerHTML = ip;
                if(is_cf){
                    li.classList.add("cf_ip");
                }
                dropdownList.appendChild(li);
            });

            divRelatedIps.appendChild(dropdownList);
        }

        ResList.appendChild(divRelatedIps);

        titleIPS.addEventListener("click", () => {
            let dropdownList = document.querySelector(".dropdownIpsList");
            dropdownList.classList.toggle("dropdownIpsListActive");
            dropdownIMG.classList.toggle("dropdownIMGActive");
        });
        

        let divRelatedDomains = document.createElement("div");
        divRelatedDomains.classList.add("relatedDomains");

        let titleDomains = document.createElement("div");
        titleDomains.classList.add("titleDomains");

        let textRelatedDomains = document.createElement("h3");
        textRelatedDomains.innerHTML = "Dominios relacionados";
        

        let dropdownIMG2 = document.createElement("img");
        dropdownIMG2.classList.add("dropdownIMG2");
        dropdownIMG2.src = "../images/dropdown.png";
        dropdownIMG2.height = "40";
        dropdownIMG2.width = "40";


        titleDomains.appendChild(textRelatedDomains);
        titleDomains.appendChild(dropdownIMG2);

        divRelatedDomains.appendChild(titleDomains);

        let dropdownList2 = document.createElement("ul");
        dropdownList2.classList.add("dropdownDomainsList");

        titleDomains.addEventListener("click", () => {
            dropdownList2.classList.toggle("dropdownDomainListActive");
            dropdownIMG2.classList.toggle("dropdownIMG2Active");
        });

        Object.keys(data.subdomains).forEach(key => {
            let li = document.createElement("li");
            li.classList.add("dropdownDomainsItem");

            let divdata = document.createElement("div");
            divdata.classList.add("dropdownDomainsItemData");

            let textoo = document.createElement("strong");
            textoo.innerHTML = key;

            divdata.appendChild(textoo);

            let ips = document.createElement("ul");
            ips.classList.add("dropdownDomainsIpsList");

            data.subdomains[key].forEach(ip => {
                let is_cf = false;
                try {
                    is_cf = ip.includes("cloudflare.com") || cloudflare_rangesipv4.map(range => isInSubnet(ip, range)).includes(true) || cloudflare_rangesipv6.map(range => isInSubnet(ip, range)).includes(true);
                } catch (error) {
                    console.log(error);
                }
                let li2 = document.createElement("li");
                li2.classList.add("dropdownSubdomainIpItem");
                li2.innerHTML = ip;
                if(is_cf){
                    li2.classList.add("cf_ip");
                }
                ips.appendChild(li2);
            });



            divdata.appendChild(ips);

            li.appendChild(divdata);

            dropdownList2.appendChild(li);
        });

        divRelatedDomains.appendChild(dropdownList2);

        ResList.appendChild(divRelatedDomains);
    
    }

    const exporter = document.querySelector(".exportBtn");
    exporter.addEventListener("click", () => {
            if (currentData != {}) {
                let data = `\nIP: ${currentData['domain_ip']} \nIPS: Relacionadas: ${currentData['related_ips'].join(", ")} \nSubdominios:\n${Object.keys(currentData['subdomains']).map(key => ` - ${key}: ${currentData['subdomains'][key].join(", ")}`).join("\n")}`;
                ipcRenderer.invoke("exportarArchivo", {datos: data, nombre: lastDomain})
            }
    });

    const hideCF = document.querySelector(".filter-cloudflare");

    hideCF.addEventListener("click", (e) => {
        let ips = document.querySelectorAll(".cf_ip");
        if (ips.length == 0){
            e.preventDefault();
            return;
        }
        ips.forEach(ip => {
            ip.classList.toggle("hidden");
        });
    });
});