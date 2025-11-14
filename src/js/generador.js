// Necesario para la concurrencia
class Semaphore {
    constructor(maxConcurrency) {
        this.maxConcurrency = maxConcurrency; // Número máximo de operaciones simultáneas
        this.currentCount = 0; // Número de operaciones actualmente en ejecución
        this.queue = []; // Cola de promesas en espera
    }

    // Solicita un "permiso" del semáforo
    acquire() {
        return new Promise(resolve => {
            const attemptAcquire = () => {
                if (this.currentCount < this.maxConcurrency) {
                    this.currentCount++; // Incrementa el contador de operaciones en ejecución
                    resolve(); // Resuelve la promesa para continuar con la operación
                } else {
                    // Si no hay permisos disponibles, guarda el resolve en la cola para cuando haya espacio
                    this.queue.push(attemptAcquire);
                }
            };
            attemptAcquire(); // Intentamos adquirir de inmediato
        });
    }

    // Libera un "permiso" del semáforo
    release() {
        this.currentCount--; // Decrementa el contador de operaciones en ejecución
        if (this.queue.length > 0) {
            const next = this.queue.shift(); // Toma el siguiente en la cola
            next(); // Intenta que continúe
        }
    }

    // Función de utilidad para ejecutar con el semáforo
    async runWithSemaphore(task) {
        await this.acquire(); // Solicita un permiso
        try {
            return await task(); // Ejecuta la tarea asíncrona
        } finally {
            this.release(); // Libera el permiso cuando termina
        }
    }
}

imagenes_service = {
    "crunchyroll": "crunchyroll.png",
    "crunchyroll-year-fa": "crunchyroll.png",
    "hbomax": "hbo.png",
    "disneyplus": "disneyplus.png",
    "disneyplus-checked": "disneyplus.png",
    "paramount": "paramount.png",
    "starplus": "starplus.webp",
    "dazn": "dazn.png",
    "proxies": "proxies.png",
    "valorant": "valorant.png",
    "steam": "steam.png",
    "ipvanish": "proxies.png",
    "spotify": "spotify.png",
    "spotify-lifetime": "spotify.png",
    "netflix": "netflix.webp",
    "deezer": "deezer.png",
    "napster": "napster.png",
    "geoguessr": "geoguessr.webp",
    "roblox": "roblox.png",
    "farcry4": "steam.png",
    "mortalkombat": "steam.png",
    "nba": "nba.png",
    "promocode": "promocode.png",
    "socks4": "proxies.png",
    "socks5": "proxies.png",
    "clarovideo": "clarovideo.png",
    "default": "logodiavlo.png",
    "crunchyroll-checked": "crunchyroll.png",
    "netflix-lifetime": "netflix.webp",
    "nitro": "discord.png",
    "promocode": "discord.png",
    "fortnite": "fortnite.webp",
    "epicgames": "epicgames.png",
    "hotmail": "hotmail.png",
    "xbox": "xbox.png",
    "ubisoft": "ubisoft.webp",
    "microsoft": "microsoft.png",
    "cyberghost": "cyberghost.webp",
    "duolingo": "duolingo.png",
    "udemy": "udemy.webp",
    "hbomax": "max.png",
    "max": "max.png",
    "instagram": "instagram.webp",
    "wondershare": "wondershare.png"
}

info_generador = {
    "proxies": ['candado.png', 'IP', 'candado.png', 'PORT'],
    "socks4": ['candado.png', 'IP', 'candado.png', 'PORT'],
    "socks5": ['candado.png', 'IP', 'candado.png', 'PORT'],
    "default": ['logotipo.png', 'EMAIL/USERNAME', 'candado.png', 'CONTRASEÑA']
}

function image_content(service) {
    if (service in info_generador) {
        return info_generador[service];
    }
    return info_generador["default"];
}

function image(service) {
    if (service in imagenes_service) {
        return imagenes_service[service];
    }
    return imagenes_service["default"];
}

window.addEventListener('load', () => {
    const backButton = document.querySelector(".HeaderHome");

    // Ponemos el loader en marcha
    const loader = document.querySelector(".loader");
    loader.style.display = "block";

    // Evento para el boton de volver atrás
    backButton.addEventListener("click", () => {
        ipcRenderer.invoke("goIndex");
    });
    const userRank = localStorage.getItem("rank");
    const userRankExpiration = localStorage.getItem("rank_expiration");
    const userExtended = localStorage.getItem("extended");
    const userToken = localStorage.getItem("token");
    if (userToken === null) {
        window.close();
    }
    const username = localStorage.getItem("username");

    const gen_premium = localStorage.getItem("gen");
    const gen_vip = localStorage.getItem("gen_vip");
    const gen_master = localStorage.getItem("gen_master");
    const UserHeaderData = document.querySelector(".user-info");
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

    const { ipcRenderer } = require("electron");

    // Obtenemos toda la info que necesitamos :)

    let data_global = null;

    async function fetchStockInfo() {
        try {
            const data = await ipcRenderer.invoke("stockinfo", { 'token': localStorage.getItem('token') });
            data_global = JSON.parse(data);
            console.log("STOCK INFO:");
            console.log(data_global);
            // Aquí puedes realizar más acciones después de que se complete
        } catch (error) {
            console.error("Error fetching stock info:", error);
        }
    }


    async function main() {
        await fetchStockInfo();
        // Más lógica aquí

        // Revisamos si tiene stock exclusivo
        if (data_global.stock_exclusivo) {
            // <img class="stock_icon" src="../images/new.png">
            let stock_exclusivo = document.querySelector('.gen_master');
            stock_exclusivo.innerHTML = 'Stock exclusivo <img class="stock_icon" src="../images/new.png">'
        }

        let gen = localStorage.getItem("gen");

        // Configuramos el botón para ir al genmaster
        let gen_masterr = document.querySelector(".gen_master");
        gen_masterr.addEventListener('click', () => {

            if (gen_master != 1) {

                ipcRenderer.invoke("error", { 'error': "¡Necesitas la licencia Gen Master para poder acceder a este tipo de servicios exclusivos!" }).then(d => {

                })
            } else {
                ipcRenderer.invoke("goGeneratorMaster");
            }

        })

        // Al entrar a esta opción cargará el stock actualizado

        // Obtenemos el timer del stock y lo vamos actualizando brokies
        // Suponiendo que el backend proporciona el tiempo en segundos

        w = data_global.time_restock

        let timeInSeconds = Math.round(w);

        const counterElement = document.querySelector('.title__counter');
        const timerElement = document.querySelector('.title__timer');
        if (timeInSeconds == 0) {
            // Se acaba de realizar un re-stock
            counterElement.innerHTML = `<strong class="title__timer">¡Se acaba de realizar un re-stock!</strong>`;
        } else if (timeInSeconds == -1) {

            counterElement.innerHTML = `<strong class="title__timer">¡Nuevo re-stock en los próximos días!</strong>`;

        } else {

            function formatTime(seconds) {
                const hours = Math.floor(seconds / 3600);
                const minutes = Math.floor((seconds % 3600) / 60);
                const secs = seconds % 60;

                return `${hours > 0 ? hours + " hora" + (hours > 1 ? "s, " : ", ") : ""}`
                    + `${minutes} minuto${minutes !== 1 ? "s" : ""}, `
                    + `${secs} segundo${secs !== 1 ? "s" : ""}`;
            }

            function updateTimer() {
                if (timeInSeconds > 0) {
                    timerElement.textContent = formatTime(timeInSeconds);
                    timeInSeconds--;
                } else {
                    clearInterval(timerInterval);
                    // Cambiar el contenido al finalizar
                    counterElement.innerHTML = `<strong class="title__timer">¡Se acaba de realizar un re-stock! ¡Recarga el stock para poder visualizarlo!</strong>`;
                }
            }
            // Inicializa el texto del temporizador y comienza la cuenta regresiva
            const timerInterval = setInterval(updateTimer, 1000);

            // Evitamos el retraso inicial
            updateTimer();

        }


        // Vamos a ver cual es el nuevo stock

        w = data_global.gen;
        new_stock = data_global.newstock;

        function existeEnStock(servicio, tarifa) {
            // Recorre el array new_stock para comprobar cada elemento
            for (let i = 0; i < new_stock.length; i++) {
                let item = new_stock[i]; // Accede directamente al índice del array
                // Compara el servicio y la tarifa con los elementos del array
                if (item[0] === servicio && item[1] === tarifa) {
                    return true;  // Si ambos coinciden, devuelve true
                }
            }

            return false;  // Si no se encuentra, devuelve false
        }

        // Al entrar a esta opción cargará el stock actualizado
        d = data_global.genplus;
        let contenido_vip_parsed = d;

        let container_services = document.querySelector('.info__servicios');
        loader.style.display = "none";

        // Enchufamos las cookies
        cookies_master = data_global.cookies;
        if (cookies_master) {
            console.log("Hay stock");
            let cookies_entries = Object.entries(cookies_master);
            cookies_entries.sort((a, b) => b[1] - a[1]);

            // Agregamos el stock de las cookies
            cookies_entries.forEach(([clave, valor], index) => {
                let nuevoElementoLi = document.createElement('li');
                nuevoElementoLi.classList.add('info__servicio');
                nuevoElementoLi.classList.add('info__servicio--cookies');
                if (localStorage.getItem("gen_master") == 0) {
                    nuevoElementoLi.style.cursor = "not-allowed";
                }
                console.log("CLAVE: " + clave);
                nuevoElementoLi.setAttribute('data-value', clave);

                let imagen = image(clave);

                if (existeEnStock(clave, 'genmaster')) {
                    nuevoElementoLi.innerHTML = `
                        <a class="info__enlace">
                            <div class="info__logo">
                                <img class="info__icon" src="../images/${imagen}" alt="">
                            </div>
                            <div class="info__content">
                                <p class="info__service">${clave}</p>
                                <p class="stock">${cookies_master[clave]} stock</p>
                            </div>
                            <div class="new_stock">
                                <img class="stock_icon" src="../images/new.png"/>
                            </div>
                        </a>
                            `;
                } else {
                    nuevoElementoLi.innerHTML = `
                        <a class="info__enlace">
                            <div class="info__logo">
                                <img class="info__icon" src="../images/${imagen}" alt="">
                            </div>
                            <div class="info__content">
                                <p class="info__service">${clave}</p>
                                <p class="stock">${cookies_master[clave]} stock</p>
                            </div>
                        </a>
                            `;
                }

                // Paso 11: Agregar el elemento <li> al <ul>
                container_services.appendChild(nuevoElementoLi);
            });
        } else {
            console.log("No hay stock");
        }

        // Ordenamos el stock VIP
        if (d != null) {
            let vip_entries = Object.entries(contenido_vip_parsed);
            vip_entries.sort((a, b) => b[1] - a[1]);

            // Agregamos el stock de jefe
            vip_entries.forEach(([clave, valor], index) => {


                let nuevoElementoLi = document.createElement('li');
                nuevoElementoLi.classList.add('info__servicio');
                nuevoElementoLi.classList.add('info__servicio--vip');
                if (localStorage.getItem('gen_vip') == 0 && localStorage.getItem("gen_master") == 0) {
                    nuevoElementoLi.style.cursor = "not-allowed";
                }
                console.log("CLAVE: " + clave);
                nuevoElementoLi.setAttribute('data-value', clave);

                let imagen = image(clave);

                if (contenido_vip_parsed[clave] == 0) {
                    nuevoElementoLi.style.cursor = "not-allowed";
                    nuevoElementoLi.classList.add('info__servicio--outofstock');
                    nuevoElementoLi.innerHTML = `
                        <a class="info__enlace">
                            <div class="info__logo">
                                <img class="info__icon" src="../images/${imagen}" alt="">
                            </div>
                            <div class="info__content">
                                <p class="info__service">${clave}</p>
                                <p class="stock">Out of Stock</p>
                            </div>
                        </a>
                            `;
                } else {
                    if (existeEnStock(clave, 'genplus')) {
                        nuevoElementoLi.innerHTML = `
                            <a class="info__enlace">
                                <div class="info__logo">
                                    <img class="info__icon" src="../images/${imagen}" alt="">
                                </div>
                                <div class="info__content">
                                    <p class="info__service">${clave}</p>
                                    <p class="stock">${contenido_vip_parsed[clave]} stock</p>
                                </div>
                                <div class="new_stock">
                                    <img class="stock_icon" src="../images/new.png"/>
                                </div>
                            </a>
                                `;
                    } else {
                        nuevoElementoLi.innerHTML = `
                            <a class="info__enlace">
                                <div class="info__logo">
                                    <img class="info__icon" src="../images/${imagen}" alt="">
                                </div>
                                <div class="info__content">
                                    <p class="info__service">${clave}</p>
                                    <p class="stock">${contenido_vip_parsed[clave]} stock</p>
                                </div>
                            </a>
                                `;
                    }
                }

                // Paso 11: Agregar el elemento <li> al <ul>
                container_services.appendChild(nuevoElementoLi);
            })
        }


        contenido_parsed = data_global.gen;
        // Ordenamos el stock de brokie
        let entries = Object.entries(contenido_parsed);
        entries.sort((a, b) => b[1] - a[1]);



        // Agregamos el stock de brokie
        const semaforo = new Semaphore(1);
        entries.forEach(([clave, valor], index) => {

            semaforo.runWithSemaphore(async () => {
                let nuevoElementoLi = document.createElement('li');
                nuevoElementoLi.classList.add('info__servicio');
                nuevoElementoLi.setAttribute('data-value', clave);

                // Si no tienen ningún generador directamente no podrá generar nada
                if (localStorage.getItem('gen_vip') == 0 && localStorage.getItem('gen') == 0 && localStorage.getItem('gen_master') == 0) {
                    nuevoElementoLi.style.cursor = "not-allowed";
                }

                let imagen = image(clave);

                if (contenido_parsed[clave] == 0) {
                    nuevoElementoLi.style.cursor = "not-allowed";
                    nuevoElementoLi.classList.add('info__servicio--outofstock');
                    nuevoElementoLi.innerHTML = `
                            <a class="info__enlace">
                                <div class="info__logo">
                                    <img class="info__icon" src="../images/${imagen}" alt="">
                                </div>
                                <div class="info__content">
                                    <p class="info__service">${clave}</p>
                                    <p class="stock">Out of Stock</p>
                                </div>
                            </a>`;
                } else {
                    if (existeEnStock(clave, 'genmegapremium')) {
                        nuevoElementoLi.innerHTML = `
                                <a class="info__enlace">
                                    <div class="info__logo">
                                        <img class="info__icon" src="../images/${imagen}" alt="">
                                    </div>
                                    <div class="info__content">
                                        <p class="info__service">${clave}</p>
                                        <p class="stock">${contenido_parsed[clave]} stock</p>
                                    </div>
                                    <div class="new_stock">
                                        <img class="stock_icon" src="../images/new.png"/>
                                    </div>
                                </a>`;
                    } else {

                        nuevoElementoLi.innerHTML = `
                                <a class="info__enlace">
                                    <div class="info__logo">
                                        <img class="info__icon" src="../images/${imagen}" alt="">
                                    </div>
                                    <div class="info__content">
                                        <p class="info__service">${clave}</p>
                                        <p class="stock">${contenido_parsed[clave]} stock</p>
                                    </div>
                                </a>`;
                    }
                }

                // Paso 11: Agregar el elemento <li> al <ul>
                container_services.appendChild(nuevoElementoLi);

                let isLastIteration = index === entries.length - 1;
                if (isLastIteration) {
                    // Esperamos a que se suba todo el stock

                    let servicios_disponibles = document.querySelectorAll(".info__servicio");
                    // Al hacer clic en algun servicio se generará la cuenta
                    let gen_jefe = localStorage.getItem('gen_vip');
                    let gen_master = localStorage.getItem('gen_master');
                    for (let service of servicios_disponibles) {
                        if (gen == 1 || gen_jefe == 1 || gen_master == 1) {
                            console.log("SERVICE ");
                            console.log(service);
                            // Si el usuario no tiene el gen+, no podrá generar stock de este servicio de JEFES
                            if (service.classList.contains('info__servicio--vip') && gen_jefe == 0 && gen_master == 0) {
                                service.addEventListener('click', () => {
                                    ipcRenderer.invoke("error", { 'error': "¡Necesitas la licencia Gen+ o Gen Master para poder generar este tipo de servicios!" }).then(d => {

                                    })
                                })
                                continue;
                            }

                            // Las cookies solo la podrán generar los Gen Masters
                            if (service.classList.contains('info__servicio--cookies') && gen_master == 0) {
                                service.addEventListener('click', () => {
                                    ipcRenderer.invoke("error", { 'error': "¡Necesitas la licencia Gen Master para poder generar este tipo de servicios exclusivos!" }).then(d => {

                                    })
                                })
                                continue;
                            }

                            // Detectamos si el usuario gen+ quiere generar una cuenta de gen o gen+
                            let type_account = null;
                            if (service.classList.contains('info__servicio--cookies')) {
                                type_account = "genmaster";
                            } else if (service.classList.contains('info__servicio--vip')) {
                                type_account = "genplus";
                            } else {
                                type_account = "genmegapremium";
                            }

                            let more_info = document.querySelector('.result__more-info');
                            service.addEventListener('click', () => {
                                let dataValue = service.getAttribute('data-value');
                                ipcRenderer.invoke("Gen", { 'service': dataValue, 'token': localStorage.getItem("token"), 'tarifa': type_account }).then(d => {
                                    if (Number.isInteger(d)) {
                                        // Estamos bajo cooldown
                                        ipcRenderer.invoke("error", { 'error': `¡Tienes que esperar ${d} segundos para poder generar otra cuenta!` }).then(d => {
                                        })

                                    } else {
                                        more_info.style.display = "none";
                                        console.log("stock: " + d);
                                        if (d == "no hay stock") {
                                            return;
                                        }
                                        let datos = JSON.parse(d);
                                        console.log("DATOS");
                                        console.log(datos);
                                        const infoResultDiv = document.querySelector('.info__result');
                                        infoResultDiv.style.display = "block";
                                        infoResultDiv.classList.add('container__effect');
                                        let imagen_servicio = image(datos.service);
                                        let tiempo_espera;

                                        // Determinar tiempo de espera según VIP o no
                                        if (localStorage.getItem('gen_vip') == 1) {
                                            tiempo_espera = 60;
                                        } else if (localStorage.getItem('gen_master') == 1) {
                                            tiempo_espera = 30;
                                        } else {
                                            tiempo_espera = 120;
                                        }

                                        // Mostrar el contenido inicial
                                        if (type_account == "genmaster") {
                                            infoResultDiv.classList.add('info__master')
                                            infoResultDiv.innerHTML = `
        <div class="result__container--title">
            <h2 class="container--title__title">DATOS DE LA COOKIE GENERADA</h2>
        </div>
        <div class="result__label">
            <div class="label__email">
                <div class="email__content">
                    <img class="email__icon" src="../images/${imagen_servicio}" alt="email">
                    <h3 class="label__h3">${dataValue}</h3>
                </div>
            </div>
            <div class="result__service">
                <img class="service__red" src="../images/${imagen_servicio}" alt="Servicio">
            </div>
            <div class="label__password">
                <div class="password__content">
                    <img class="email__password" src="../images/candado.png" alt="candado">
                    <h3 class="label__h3">COOKIE</h3>
                </div>
                <div class="passwords__password">
                    <div class="passwords__copy">
                        ¡Haz clic aquí para copiar la cookie!
                    </div>
                    <div class="cookie">
                        ${datos.cookie}
                    </div>
                </div>
            </div>
        </div>
        <div class="cooldown">
            <p id="mensaje">Tienes que esperar <span class="text-effect" id="contador">${tiempo_espera}</span> segundos para poder volver a generar una cuenta.</p>
        </div>
    `;
                                        } else {

                                            infoResultDiv.innerHTML = `
        <div class="result__container--title">
            <h2 class="container--title__title">DATOS DE LA CUENTA GENERADA</h2>
        </div>
        <div class="result__label">
            <div class="label__email">
                <div class="email__content">
                    <img class="email__icon" src="../images/${imagen_servicio}" alt="email">
                    <h3 class="label__h3">${dataValue}</h3>
                </div>
                <div class="passwords__login">
                    ${datos.email}
                </div>
            </div>
            <div class="result__service">
                <img class="service__red" src="../images/${imagen_servicio}" alt="Servicio">
            </div>
            <div class="label__password">
                <div class="password__content">
                    <img class="email__password" src="../images/candado.png" alt="candado">
                    <h3 class="label__h3">CONTRASEÑA</h3>
                </div>
                <div class="passwords__password">
                    ${datos.password}
                    <div class="passwords__copy">
                        <i class="fa-solid fa-copy"></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="cooldown">
            <p id="mensaje">Tienes que esperar <span class="text-effect" id="contador">${tiempo_espera}</span> segundos para poder volver a generar una cuenta.</p>
        </div>
    `;
                                        }

                                        // Función de cuenta regresiva
                                        function iniciarCuentaRegresiva(tiempo) {
                                            const contadorElemento = document.getElementById("contador");
                                            const mensajeElemento = document.getElementById("mensaje");

                                            let contador = tiempo;

                                            // Mostrar el valor inicial inmediatamente
                                            contadorElemento.textContent = contador;

                                            const intervalo = setInterval(() => {
                                                contador--;

                                                if (contador <= 0) {
                                                    clearInterval(intervalo); // Detener la cuenta regresiva
                                                    contadorElemento.style.display = "none"; // Ocultar el contador
                                                    mensajeElemento.textContent = '¡Ya puedes generar una cuenta otra vez!';
                                                } else {
                                                    contadorElemento.textContent = contador; // Actualizar el contador visualmente
                                                }
                                            }, 1000); // Cada segundo
                                        }

                                        // Iniciar la cuenta regresiva con el tiempo definido
                                        iniciarCuentaRegresiva(tiempo_espera);


                                        let buttonResultCopy = document.querySelector('.passwords__copy');

                                        buttonResultCopy.addEventListener('click', () => {
                                            let content;
                                            if (type_account == "genmaster") {
                                                content = document.querySelector('.cookie').innerText.trim();
                                                let password_copy = document.querySelector('.passwords__copy');
                                                password_copy.innerHTML = '¡La cookie ha sido copiada con éxito!'
                                            } else {
                                                let email = document.querySelector(".passwords__login").innerText;
                                                let password = document.querySelector(".passwords__password").innerText;
                                                content = email + ":" + password;
                                            }

                                            // Crear un elemento temporal (textarea)
                                            var textareaTemp = document.createElement('textarea');
                                            textareaTemp.value = content; // Asegúrate que content tenga \n y \t ya procesados
                                            document.body.appendChild(textareaTemp);

                                            // Seleccionar el contenido del textarea temporal
                                            textareaTemp.select();
                                            textareaTemp.setSelectionRange(0, 99999); // Para móviles

                                            // Copiar al portapapeles
                                            document.execCommand('copy');

                                            // Eliminar el textarea temporal
                                            document.body.removeChild(textareaTemp);

                                        });

                                        // Movemos el scroll hacia abajo
                                        infoResultDiv.scrollIntoView({ behavior: 'smooth' });

                                    }
                                })
                            });

                            const input = document.querySelector('.search__input');
                            input.style.cursor = 'text';
                            input.disabled = false;
                            const serviceItems = document.querySelectorAll('.info__servicio');

                            input.addEventListener('input', () => {
                                const filter = input.value.toLowerCase();
                                let servicios_operativos = 0;
                                console.log(serviceItems);
                                serviceItems.forEach(item => {
                                    const serviceName = item.querySelector('.info__service').textContent.toLowerCase();
                                    if (serviceName.includes(filter)) {
                                        servicios_operativos++;
                                        item.style.display = ''; // Muestra el elemento
                                    } else {
                                        item.style.display = 'none'; // Oculta el elemento
                                    }
                                });
                                const nostock = document.querySelector('.no-stock');
                                if (servicios_operativos == 0) {
                                    nostock.style.display = 'flex';
                                } else {
                                    nostock.style.display = 'none';
                                }
                            });
                        } else {
                            service.style.cursor = "not-allowed";
                            service.addEventListener('click', () => {
                                ipcRenderer.invoke("error", { 'error': "¡Necesitas la licencia Gen, Gen+ o Gen Master para poder generar cuentas!" }).then(d => {

                                })
                            })
                        }
                    }
                }
            });
        })

        let logs = document.querySelector('#logs');
        let history = document.querySelector('#history');
        let span_not_search = document.querySelector('#not_found');
        logs.addEventListener('click', () => {
            if (history.style.display == "flex") {
                history.style.display = "none";
            } else {
                ipcRenderer.invoke("GenLogs", { 'token': localStorage.getItem("token") }).then(d => {
                    if (d.length == undefined) {
                        span_not_search.style.display = "none";
                        // Crear el elemento ol
                        let ol = document.querySelector("#resultados-mc");
                        if (ol == null) {
                            ol = document.createElement('ol');
                            ol.id = 'resultados-mc';
                        }
                        ol.innerHTML = '';

                        // Iterar sobre la lista de arrays
                        d.data.forEach(data => {
                            const [datos, service, fecha] = data;
                            // Crear elementos li y span
                            const li = document.createElement('li');
                            const span = document.createElement('span');
                            span.className = 'neon-effect';
                            if (datos.startsWith("Cookie: ")) {
                                span.textContent = "Service: " + service;
                                const button_copy = document.createElement('button');
                                button_copy.innerText = '¡Clic para copiar la cookie!'
                                button_copy.classList.add('boton_copy');
                                button_copy.addEventListener('click', () => {
                                    // Crear un elemento temporal (textarea)
                                    var textareaTemp = document.createElement('textarea');
                                    textareaTemp.value = datos.replace("Cookie: ", "").replace("Service: " + service, ""); // Asegúrate que content tenga \n y \t ya procesados
                                    document.body.appendChild(textareaTemp);

                                    // Seleccionar el contenido del textarea temporal
                                    textareaTemp.select();
                                    textareaTemp.setSelectionRange(0, 99999); // Para móviles

                                    // Copiar al portapapeles
                                    document.execCommand('copy');

                                    // Eliminar el textarea temporal
                                    document.body.removeChild(textareaTemp);

                                    button_copy.innerText = '¡Cookie copiada con éxito!'
                                });
                                span.appendChild(button_copy)
                            } else {
                                span.textContent = datos.replace("Email: ", "Username/Email: ") + " ";
                            }

                            // Agregar span al li
                            li.appendChild(span);
                            // Agregar texto adicional al li
                            parrafo = document.createElement('p');
                            parrafo.textContent = `(${fecha})`;
                            parrafo.classList.add('fecha-cookies');
                            li.appendChild(parrafo);

                            // Agregar li al ol
                            ol.appendChild(li);
                        });
                        history.appendChild(ol);
                    } else {
                        span_not_search.style.display = "flex";
                    }
                });
                history.style.display = "flex";
            }
        });
    }

    main();

    // Boton de refresh
    let refresh = document.querySelector('.refresher');
    refresh.addEventListener('click', () => {
        ipcRenderer.invoke('goGenerator');
    })

    let history = document.querySelector('#history');
    let close_gen = document.querySelector('#close_mc');
    close_gen.addEventListener('click', () => {
        history.style.display = "none";
    });

})