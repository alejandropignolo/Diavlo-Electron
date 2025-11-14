window.addEventListener("load", () => {
    const { ipcRenderer } = require("electron");
    const audio = document.getElementById('backgroundAudio');
    audio.volume = 0.1;
    // Reproduce el sonido después de 3 segundos
    setTimeout(function() {
        audio.play();
    }, 3000); // 3000 milisegundos = 3 segundos
    
    ipcRenderer.invoke("autologin",localStorage.getItem("token")).then(result => {
            localStorage.setItem("token", result.access_token);
            localStorage.setItem("rank", result.rank);
            localStorage.setItem("username", result.username);
            localStorage.setItem("extended", result.extended);
            localStorage.setItem("rank_expiration", result.rank_expiration);
            localStorage.setItem("bruteforce_db", result.bruteforce_db);
            localStorage.setItem("gen", result.gen);
            localStorage.setItem("gen_time", result.gen_time);
            localStorage.setItem("gen_master", result.gen_master);
            localStorage.setItem("discord", result.discord);
            localStorage.setItem('gen_vip', result.gen_vip);
            localStorage.setItem("inicio_effect", "diavlo");
            
        }).catch(_ => {

            let last_user = localStorage.getItem("last_user");
            let last_password = localStorage.getItem("last_password");
            if (last_user != null && last_user != undefined && last_password != null && last_password != undefined) {

                console.log("ENTRO LOL");
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
                    var username_user = document.getElementById("username");
                    var password_user = document.getElementById("password");
                    var confirmButton = document.createElement("button");
                    confirmButton.textContent = "Cargar datos";
                    confirmButton.addEventListener("click", function () {
                        username_user.value = last_user;
                        password_user.value = last_password;
                        confirmationDialog.remove();

                        ipcRenderer.invoke('login', {username: last_user, password: last_password}).then((result) => {
                            if (result !== undefined) {
                                localStorage.setItem("token", result.access_token);
                                localStorage.setItem("rank", result.rank);
                                localStorage.setItem("username", result.username);
                                localStorage.setItem("extended", result.extended);
                                localStorage.setItem("rank_expiration", result.rank_expiration);
                                localStorage.setItem("bruteforce_db", result.bruteforce_db);
                                localStorage.setItem("gen", result.gen);
                                localStorage.setItem("gen_time", result.gen_time);
                                localStorage.setItem("discord", result.discord);
                                localStorage.setItem('gen_vip', result.gen_vip);
                                localStorage.setItem("inicio_effect", "diavlo");
                                localStorage.setItem("last_user", last_user);
                                localStorage.setItem("last_password", last_password);
                                localStorage.setItem("gen_master", result.gen_master);
                            }
                        }).catch((error) => {
                            console.log(error);
                        });

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
                showCustomConfirmation("¡Se ha detectado un inicio de sesión previo! ¿Te gustaría cargar dichas credenciales?", "Diavlo v3");
            }
    });


    let last_user = localStorage.getItem("last_user");
    let last_password = localStorage.getItem("last_password");
    let token = localStorage.getItem("token");
    if (last_user != null && last_user != undefined && last_password != null && last_password != undefined && token == null) {
        console.log("ENTRO LOL");
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
            var username_user = document.getElementById("username");
            var password_user = document.getElementById("password");
            var confirmButton = document.createElement("button");
            confirmButton.textContent = "Cargar datos";
            confirmButton.addEventListener("click", function () {
                username_user.value = last_user;
                password_user.value = last_password;
                confirmationDialog.remove();

                ipcRenderer.invoke('login', {username: last_user, password: last_password}).then((result) => {
                    if (result !== undefined) {
                        localStorage.setItem("token", result.access_token);
                        localStorage.setItem("rank", result.rank);
                        localStorage.setItem("username", result.username);
                        localStorage.setItem("extended", result.extended);
                        localStorage.setItem("rank_expiration", result.rank_expiration);
                        localStorage.setItem("bruteforce_db", result.bruteforce_db);
                        localStorage.setItem("gen", result.gen);
                        localStorage.setItem("gen_master", result.gen_master);
                        localStorage.setItem("gen_time", result.gen_time);
                        localStorage.setItem("discord", result.discord);
                        localStorage.setItem('gen_vip', result.gen_vip);
                        localStorage.setItem("inicio_effect", "diavlo");
                        localStorage.setItem("last_user", last_user);
                        localStorage.setItem("last_password", last_password);
                    }
                }).catch((error) => {
                    console.log(error);
                });

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
        showCustomConfirmation("¡Se ha detectado un inicio de sesión previo! ¿Te gustaría cargar dichas credenciales?", "Diavlo v3");
    }
    

    var loginButton = document.querySelector(".sign-in-button");
    loginButton.addEventListener("click", (e) => {
        e.preventDefault();
        var username = document.getElementById("username").value;
        var password = document.getElementById("password").value;

        const data = {
            username: username,
            password: password
        }

        ipcRenderer.invoke('login', data).then((result) => {
            if (result !== undefined) {
                localStorage.setItem("token", result.access_token);
                localStorage.setItem("rank", result.rank);
                localStorage.setItem("username", result.username);
                localStorage.setItem("extended", result.extended);
                localStorage.setItem("rank_expiration", result.rank_expiration);
                localStorage.setItem("bruteforce_db", result.bruteforce_db);
                localStorage.setItem("gen", result.gen);
                localStorage.setItem("gen_master", result.gen_master);
                localStorage.setItem("gen_time", result.gen_time);
                localStorage.setItem("discord", result.discord);
                localStorage.setItem('gen_vip', result.gen_vip);
                localStorage.setItem("inicio_effect", "diavlo");
                localStorage.setItem("last_user", username);
                localStorage.setItem("last_password", password);
            }

        }).catch((error) => {
            console.log(error);
        });

    })

})