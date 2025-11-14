window.addEventListener('load', () => {
    const { ipcRenderer } = require("electron");
    const MCOption = document.querySelector('.mc-container');
    const FinderOption = document.querySelector('.finder-container');
    const SettingsOption = document.querySelector('.settings-container');
    const ToolsOption = document.querySelector('.tools-container');
    const userRank = localStorage.getItem("rank");
    const userRankExpiration = localStorage.getItem("rank_expiration");
    const userExtended = localStorage.getItem("extended");
    const username = localStorage.getItem("username");
    const gen_premium = localStorage.getItem("gen");
    const gen_vip = localStorage.getItem("gen_vip");
    const gen_master = localStorage.getItem("gen_master");
    const setHeaderDataAndDisableOptions = () => {
        try {

            const UserHeaderData = document.querySelector(".user-info");
        
            UserHeaderData.querySelector('.usernameHeader').innerHTML = username;
            UserHeaderData.querySelector('.rank-data .data__diavlo h3').innerHTML = userRank + `${userExtended === "1" ? " +" : ""}`;
            var timeDiff = new Date(userRankExpiration).getTime() - new Date().getTime();
            var daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
            UserHeaderData.querySelector('.rank-data .data__diavlo span').innerHTML = `${daysRemaining} Dias`;
    
            if(userRank !== "Mazikeen" && userRank !== "Lucifer" && userRank !== "Owner") {
                FinderOption.classList.add('disabled');
            }

            if(userRank !== "Human" && userRank !== "Lucifer"&& userRank !== "Owner") {
                MCOption.classList.add('disabled');
            }

            if (userExtended === "0" || userExtended == "null") {
                ToolsOption.classList.add('disabled');
            }

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

        } catch (e) {

        }
    
    }
    

    setHeaderDataAndDisableOptions();

    try {

        MCOption.addEventListener('click', (e) => {
            e.preventDefault();
            if(userRank === "Owner" || userRank === "Lucifer" || userRank === "Human") {
                ipcRenderer.invoke('openMC');
            }
        });
        
        FinderOption.addEventListener('click', (e) => {
            e.preventDefault();
            if(userRank === "Owner" || userRank === "Lucifer" || userRank === "Mazikeen") {
                ipcRenderer.invoke('openFinder');
            }
        });
    
        SettingsOption.addEventListener('click', (e) => {
            e.preventDefault();
            ipcRenderer.invoke('openSettings');
        });
    
        ToolsOption.addEventListener('click', (e) => {
            e.preventDefault();
            if(userExtended === "1") {
                ipcRenderer.invoke('openTools');
            }
        });
    } catch (e) {

    }


    /* REGALOS */
    try {

        var giveaway = document.getElementById("giveaway");
        var exit = document.getElementsByClassName("close");
        var element = exit[0];
        element.addEventListener('click', function() {
            giveaway.style.display = "none";
        })
    
        var regalo = document.getElementById("regalo");
        regalo.addEventListener('click', function() {
            if (giveaway.style.display == "block") {
                giveaway.style.display = "none";
            } else {
                giveaway.style.display = "block";
            }
        })
    } catch (e) {

    }

    try {
        let new_generator = document.querySelector('.options__generator');
        new_generator.addEventListener('click', () => {
            ipcRenderer.invoke('goGenerator');
        })
    } catch (e) {

    }

    try {
        let musica = document.querySelector('.music__image');
        let audio = document.getElementById('backgroundAudio');
        let music_status = localStorage.getItem('music');
        if (music_status == null|| music_status == undefined || music_status == "1") {
            var sourceElement = document.createElement("source");
            sourceElement.src = "../song/fondo.mp3";
            sourceElement.type = "audio/mp3";
            audio.appendChild(sourceElement);
            localStorage.setItem('music', '1');
            musica.src = '../images/On.png';
            musica.addEventListener('dragstart', function(event) {
                event.preventDefault();
            });
        } else {
            musica.src = '../images/Off.png';
            musica.addEventListener('dragstart', function(event) {
                event.preventDefault();
            });
        }
        musica.addEventListener('click', () => {
            let music_status = localStorage.getItem('music');
            if (music_status == '0') {
                var sourceElement = document.createElement("source");
                sourceElement.src = "../song/fondo.mp3";
                sourceElement.type = "audio/mp3";
                audio.appendChild(sourceElement);
                localStorage.setItem('music', '1');
                musica.src = '../images/On.png';
                audio.play();
            } else {
                localStorage.setItem('music', '0');
                musica.src = '../images/Off.png';
                audio.innerHTML = "";
                audio.pause();
            }
        });
        
    } catch (e) {
        console.log(e);
    }
});