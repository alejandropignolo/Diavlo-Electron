
window.addEventListener('load', () => {
    const { ipcRenderer } = require("electron");
    try {
        const MCOption = document.querySelector('.mc-container');
        const FinderOption = document.querySelector('.finder-container');
        const SettingsOption = document.querySelector('.settings-container');
        const ToolsOption = document.querySelector('.tools-container');
        const userRank = localStorage.getItem("rank");
        const userRankExpiration = localStorage.getItem("rank_expiration");
        const userExtended = localStorage.getItem("extended");
        const userToken = localStorage.getItem("token");
        const username = localStorage.getItem("username");
        const gen_premium = localStorage.getItem("gen");
        const setHeaderDataAndDisableOptions = () => {
    
                const UserHeaderData = document.querySelector(".user-info");
            
                UserHeaderData.querySelector('.usernameHeader').innerHTML = username;
                UserHeaderData.querySelector('.rank-data .data__diavlo h3').innerHTML = userRank + `${userExtended === "1" ? " +" : ""}`;
                var timeDiff = new Date(userRankExpiration).getTime() - new Date().getTime();
                var daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
                UserHeaderData.querySelector('.rank-data .data__diavlo span').innerHTML = `${daysRemaining} Dias`;

                if (gen_premium == 1) {
                    const gen_premium_time = localStorage.getItem("gen_time");
                    UserHeaderData.querySelector(".data__gen h3").textContent = "Gen";
                    var timeDiff2 = new Date(gen_premium_time).getTime() - new Date().getTime();
                    var daysRemaining2 = Math.ceil(timeDiff2 / (1000 * 60 * 60 * 24));
                    UserHeaderData.querySelector(".data__gen span").textContent = daysRemaining2 + " Dias";
                }
        }

        setHeaderDataAndDisableOptions()
    } catch (e) {
        console.log("xd");
    }
    try {

        const audio = document.getElementById('backgroundAudio');
        audio.volume = 0.2;
    } catch (e) {

    }

    let logoutButton = document.getElementById('logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            function showCustomConfirmation(message, title) {
                // Create a hidden confirmation dialog
                var confirmationDialog = document.createElement("dialog");
                document.body.appendChild(confirmationDialog);

                // Create a custom title for the dialog
                var dialogTitle = document.createElement("h1");
                dialogTitle.textContent = title;
                confirmationDialog.appendChild(dialogTitle);

                // Create the message for the dialog
                var dialogMessage = document.createElement("p");
                dialogMessage.textContent = message;
                confirmationDialog.appendChild(dialogMessage);

                var containerButton = document.createElement("div");
                containerButton.classList.add("emergencia");
                // Create the OK button
                var confirmButton = document.createElement("button");
                confirmButton.textContent = "Cerrar sesión";
                confirmButton.addEventListener("click", function () {
                    last_user = localStorage.getItem("last_user");
                    last_password = localStorage.getItem("last_password");
                    localStorage.clear();
                    localStorage.setItem("last_user", last_user);
                    localStorage.setItem("last_password", last_password);
                    window.close();
                    confirmationDialog.remove();
                });
                containerButton.appendChild(confirmButton);

                // Create the Cancel button
                var cancelButton = document.createElement("button");
                cancelButton.textContent = "Cancelar";
                cancelButton.addEventListener("click", function () {
                    confirmationDialog.remove();
                });
                containerButton.appendChild(cancelButton);

                confirmationDialog.appendChild(containerButton);
                // Show the dialog
                confirmationDialog.showModal();
            }

            // Usage
            showCustomConfirmation("¿Estás seguro de querer cerrar sesión?", "Diavlo v3");
            /*
             if(confirm('¿Estás seguro de que quieres cerrar sesión?', 'Diavlo v3.1')) {
                 localStorage.clear();
                 window.close();
             }
             */
        });
    }

    /* DESPEDIDA */
    try {

        var tarifa_caducada = document.getElementsByClassName("despedida__button")[0];
        tarifa_caducada.addEventListener('click', function() {
            localStorage.clear();
            window.close();
        })
    } catch (e) {

    }

    /* PARTÍCULAS */ 
    particlesJS('particles-container', {
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: '#E75746' // Color rojo para simular el fuego
            },
            shape: {
                type: 'circle',
                stroke: {
                    width: 0,
                    color: '#000000'
                },
                polygon: {
                    nb_sides: 5
                }
            },
            opacity: {
                value: 0.7, // Opacidad de las partículas
                random: true,
                anim: {
                    enable: true,
                    speed: 1.2, // Velocidad de la animación de opacidad
                    opacity_min: 0,
                    sync: false
                }
            },
            size: {
                value: 3, // Tamaño de las partículas
                random: true,
                anim: {
                    enable: false,
                    speed: 40,
                    size_min: 0.1,
                    sync: false
                }
            },
            line_linked: {
                enable: false
            },
            move: {
                enable: true,
                speed: 4, // Velocidad de movimiento de las partículas
                direction: 'none',
                random: true,
                straight: false,
                out_mode: 'out',
                bounce: false,
                attract: {
                    enable: false,
                    rotateX: 600,
                    rotateY: 1200
                }
            }
        },
        interactivity: {
            events: {
                onhover: {
                    enable: false,
                    mode: 'repulse'
                }
            }
        },
        retina_detect: true
    });

})