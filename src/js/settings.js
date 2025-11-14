window.addEventListener('load', () => {
    const { ipcRenderer } = require("electron");
    const setHeaderData = () => {
        const userRank = localStorage.getItem("rank");
        const userRankExpiration = localStorage.getItem("rank_expiration");
        const userExtended = localStorage.getItem("extended");
        const userToken = localStorage.getItem("token");
        const username = localStorage.getItem("username");
        const wordlist = localStorage.getItem("bruteforce_db");

        
        if (userRank === 'Mazikeen' || userRank == "null"){
            document.getElementById("bffile").style.display = "none";
        }

        const UserHeaderData = document.querySelector(".user-info");

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
        try {
            UserHeaderData.querySelector('.usernameHeader').innerHTML = username;
            UserHeaderData.querySelector('.rank-data h3').innerHTML = userRank + `${userExtended === "1" ? " +" : ""}`;
            var timeDiff = new Date(userRankExpiration).getTime() - new Date().getTime();
            var daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
            UserHeaderData.querySelector('.rank-data span').innerHTML = `${daysRemaining} Dias`;

            // Verificamos si el usuario es o no extended
            if (userExtended === "1") {
                // Es extended

                // Obtener el elemento select por su ID
                const selectElement = document.getElementById('choose-brute');

                // Obtener todas las etiquetas option dentro del select
                const optionElements = selectElement.getElementsByTagName('option');

                // Recorrer todas las etiquetas option y quitar la clase y el atributo
                for (let i = 0; i < optionElements.length; i++) {
                    const option = optionElements[i];
                    option.classList.remove('disabled-brute');
                    option.removeAttribute('disabled');
                }
                if (wordlist != null && wordlist != undefined) {
                    selectElement.selectedIndex = parseInt(wordlist);
                }

                selectElement.addEventListener('change', function() {
                    // Obtener la opción seleccionada
                    const selectedOption = this.options[this.selectedIndex];
                    
                    // Obtener el valor del atributo "value" de la opción seleccionada
                    const optionValue = selectedOption.value;
                    
                    // Imprimir el valor en la consola
                    localStorage.setItem('bruteforce_db', `${optionValue}`);
                    ipcRenderer.invoke("setBruteForceFile", {'db': optionValue,'token':userToken});
                });
                selectElement.selectedIndex = parseInt(optionValue);
            } else {
                // No es extended

            }
        } catch (e) {
            
        }
    }

    setHeaderData();

    const settings_input = document.getElementById("settings_input")
    const error_current_password = document.getElementById("error_current_password");
    const error_new_password = document.getElementById("error_new_passwords");

    const password_changed = document.getElementById("contrasena_cambiada");

    error_current_password.style.display = "none";
    error_new_password.style.display = "none";
    password_changed.style.display = "none";



    settings_input.addEventListener("click", (e) => {
        e.preventDefault();
        const current_password = document.getElementById("current_password").value;
        const new_password = document.getElementById("new_password").value;
        const new_password_repeat = document.getElementById("new_password_2").value;
        if (new_password !== new_password_repeat) {
            error_new_passwords.style.display = "block";
            error_current_password.style.display = "none";
            password_changed.style.display = "none";
        } else {
            ipcRenderer.invoke("changepassword", { current_password: current_password,new_password: new_password,token: localStorage.getItem('token') }).then(_ => {
                new_passwords.style.display = "none";
                error_current_password.style.display = "none";
                password_changed.style.display = "block";
            }).catch(_ => {
                new_passwords.style.display = "none";
                error_current_password.style.display = "block";
                password_changed.style.display = "none";
            });
        };
    });
                    
    const backButton = document.querySelector(".HeaderHome");


    // Evento para el boton de volver atrás
    backButton.addEventListener("click", () => {
        ipcRenderer.invoke("goIndex");
    });

    // Cambiar discord
    let discord = localStorage.getItem("discord");
    if (discord == null || discord == undefined || discord == "null") {
        let changeDiscord = document.querySelector('.container-discord__form');
        changeDiscord.addEventListener('submit', (e) => {
            e.preventDefault();
            ipcRenderer.invoke("changeDiscord", {'token': localStorage.getItem("token")}).then((res) => {
                // Obtenemos una key
                if ("key" in res) {
                    let key = document.querySelector('.container-discord__key');
                    let boton_enviar = document.querySelector('.container-discord__send');
                    key.innerHTML = res.key;
                    boton_enviar.style.display = "None";
                    key.style.display = "flex";
                } else {
                    localStorage.setItem("discord", res.discord);
                    let key = document.querySelector('.container-discord__key');
                    let boton_enviar = document.querySelector('.container-discord__send');
                    key.style.display = "none";
                    boton_enviar.style.display = "none";
                    let user_discord = document.querySelector('.discord-user');
                    user_discord.innerHTML = res.discord;
                    container_discord = document.querySelector(".container-user-discord");
                    container_discord.style.display = "block";
                }
            });
        })
    } else {
        let key = document.querySelector('.container-discord__key');
        let boton_enviar = document.querySelector('.container-discord__send');
        key.style.display = "none";
        boton_enviar.style.display = "none";
        let user_discord = document.querySelector('.discord-user');
        user_discord.innerHTML = discord;
        container_discord = document.querySelector(".container-user-discord");
        container_discord.style.display = "block";
    }
});