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

    const goBackTools2 = document.querySelector(".gobacktools2");
    goBackTools2.addEventListener("click", () => {
        ipcRenderer.invoke("openTools");
    });


    const addOrders = (orders) => {
        const ordersList = document.querySelector(".tebex-order-list");
        let totalPaid = 0.0;
        orders.forEach(order => {
            const orderItem = document.createElement("li");
            orderItem.classList.add("tebex-order-item");

            const imgDiv = document.createElement("div");
            const innerSkin = document.createElement("img");
            innerSkin.classList.add("tebex-order-skin");

            let nick = order['player']['name'];
            innerSkin.setAttribute("src", `https://mc-heads.net/body/${nick}/right"`);
            innerSkin.setAttribute("alt", nick);
            innerSkin.height = '120';
            innerSkin.width = '50';

            imgDiv.appendChild(innerSkin);
            orderItem.appendChild(imgDiv);

            const orderData = document.createElement("div");
            orderData.classList.add("tebex-order-data");

            const orderTitle = document.createElement("h3");

            try {
                orderTitle.textContent = "Compró: " + order['packages'][0]['name'];
            } catch (error) {
                orderTitle.textContent = "Compró: ???";
            }


            const orderUsername = document.createElement("h2");
            orderUsername.textContent = nick;

            const orderEmail = document.createElement("p"); 
            orderEmail.textContent = order['email'];

            const divNamePackage = document.createElement("div");
            divNamePackage.classList.add("tebex-order-name-package");

            divNamePackage.appendChild(orderUsername);
            divNamePackage.appendChild(orderTitle);
            divNamePackage.appendChild(orderEmail);

            orderData.appendChild(divNamePackage);

            const divDatePrice = document.createElement("div");
            divDatePrice.classList.add("tebex-order-date-price");

            
            const orderDate = document.createElement("p");
            orderDate.textContent = new Date(order['date']).toLocaleDateString();

            const orderPrice = document.createElement("h2");
            orderPrice.classList.add("tebex-order-price");
            orderPrice.textContent = order['amount'] + " " + order['currency']['symbol'];

            totalPaid += parseFloat(order['amount']);


            divDatePrice.appendChild(orderDate);
            divDatePrice.appendChild(orderPrice);
            

            orderData.appendChild(divDatePrice);

            orderItem.appendChild(imgDiv);
            orderItem.appendChild(orderData);
            
            ordersList.appendChild(orderItem);
        });

        const totalPaidDiv = document.querySelector(".tebex-data-total-paid");
        totalPaidDiv.textContent = "Ganancias totales: " + totalPaid + " " + orders[0]['currency']['symbol'];
    }

    const addCoupons = (coupons,currency) => {
        const couponsList = document.querySelector(".tebex-coupons-list");
        coupons.forEach(coupon => {
            const couponItem = document.createElement("li");
            couponItem.classList.add("tebex-coupon-item");

            const couponData = document.createElement("div");
            couponData.classList.add("tebex-coupon-data");

            const couponTitle = document.createElement("h3");
            couponTitle.textContent = coupon['code'];

            const couponDiscount = document.createElement("h2");
            couponDiscount.textContent = coupon['discount']['type'] === "percentage" ? coupon['discount']['percentage'] + "%" : coupon['discount']['value'] + " " + currency;
            couponDiscount.classList.add("tebex-coupon-discount");

            const divTitleDiscount = document.createElement("div");
            divTitleDiscount.classList.add("tebex-coupon-title-discount");

            divTitleDiscount.appendChild(couponTitle);
            divTitleDiscount.appendChild(couponDiscount);

            couponData.appendChild(divTitleDiscount);

            const expirationDiv = document.createElement("div");
            expirationDiv.classList.add("tebex-coupon-expiration");

            const expiration = document.createElement("p");
            expiration.textContent = "Fecha expiración: " + (coupon['expire']['expire_never'] === 'true' ? "Nunca" : new Date(coupon['expire']['date']).toLocaleDateString());
            
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Eliminar Cupón";
            deleteButton.classList.add("tebex-delete-coupon");
            deleteButton.addEventListener("click", () => {
                ipcRenderer.invoke("deleteCoupon", {secret_key: document.getElementById("busqueda").value, token: userToken, coupon: coupon['id']}).then((res) => {
                    couponsList.removeChild(couponItem);
                });
            });

            expirationDiv.appendChild(deleteButton);
            expirationDiv.appendChild(expiration);

            couponData.appendChild(expirationDiv);

            couponItem.appendChild(couponData);

            couponsList.prepend(couponItem);
        });

    }

    const createCouponButton = document.querySelector(".botonCrearCupon");
    createCouponButton.addEventListener("click", (e) => {
        e.preventDefault();
        const couponCode = document.querySelector(".cuponCreateInput").value;

        ipcRenderer.invoke("createCoupon", {secret_key: document.getElementById("busqueda").value, token: userToken, coupon: couponCode}).then((res) => {
            addCoupons([res['data']], '%');
        });

    });

    const packageList = document.querySelector(".tebex-packages-list");


    
    const editPackageDiv = document.querySelector(".edit-package-div");

    const clearPackageEdit = () => {
        editPackageDiv.querySelector(".edit-package-title").value = "";
        editPackageDiv.querySelector(".edit-package-price").value = "";
    }

    const showEditPackage = (id,name,price,currency) => {
        console.log(id,name,price,currency);
        editPackageDiv.style.display = "block";
        editPackageDiv.querySelector(".package-edit-id").textContent = id;
        editPackageDiv.querySelector(".edit-package-title").value = name;
        editPackageDiv.querySelector(".edit-package-price").value = price;

        editPackageDiv.querySelector(".edit-package-save").addEventListener("click", () => {

            let newName = editPackageDiv.querySelector(".edit-package-title").value;
            let newPrice = editPackageDiv.querySelector(".edit-package-price").value;

            ipcRenderer.invoke("editTebexPackage", {secret_key: document.getElementById("busqueda").value, token: userToken, package_id: id, package_name: newName, package_price: newPrice})
            .then((res) => {
                document.querySelector(`[data-package-id="${id}"]`).querySelector(".tebex-package-price").textContent = newPrice + " " + currency;
                document.querySelector(`[data-package-id="${id}"]`).querySelector(".tebex-package-name h3").textContent = newName;
                editPackageDiv.style.display = "none";
                clearPackageEdit();
                
            });
        });
    }

    const closeEditPackage = document.querySelector(".close-edit-package");
    closeEditPackage.addEventListener("click", () => {
        document.querySelector(".edit-package-div").style.display = "none";
        clearPackageEdit();
    });

    const addPackages = (packages,currency) => {
        packages.forEach(package => {
            const packageItem = document.createElement("li");
            packageItem.setAttribute("data-package-id", package['id']);
            packageItem.classList.add("tebex-package-item");

            const imgDiv = document.createElement("div");
            const innerIMG = document.createElement("img");
            innerIMG.classList.add("tebex-package-image");

            innerIMG.setAttribute("src", package['image']);
            innerIMG.setAttribute("alt", package['name']);
            innerIMG.height = '120';
            innerIMG.width = '120';

            imgDiv.appendChild(innerIMG);
            packageItem.appendChild(imgDiv);

            const packageData = document.createElement("div");
            packageData.classList.add("tebex-package-data");

            const packageTitle = document.createElement("h3");
            packageTitle.textContent = package['name'];


            const packageServers = document.createElement("p");
            packageServers.textContent = "Servidores: " + package['servers'].map(server => server['name']).join(", ");

            const packageCategory = document.createElement("p");
            packageCategory.textContent = "Categoría: " + package['category']['name'];

            const divNamePackage = document.createElement("div");
            divNamePackage.classList.add("tebex-package-name");

            divNamePackage.appendChild(packageTitle);
            divNamePackage.appendChild(packageServers);
            divNamePackage.appendChild(packageCategory);

            packageData.appendChild(divNamePackage);

            const divDatePrice = document.createElement("div");
            divDatePrice.classList.add("tebex-package-date-price");

            const packagePrice = document.createElement("h2");
            packagePrice.classList.add("tebex-package-price");
            packagePrice.textContent = package['price'] + " " + currency;

            const editButton = document.createElement("button");
            editButton.textContent = "Editar Paquete";
            editButton.classList.add("tebex-edit-package");
            editButton.addEventListener("click", () => {
                clearPackageEdit();
                let packDiv = document.querySelector(`[data-package-id="${package['id']}"]`);
                let packName = packDiv.querySelector(".tebex-package-name h3").textContent;
                let packPrice = packDiv.querySelector(".tebex-package-price").textContent.replace(currency,"").trim();
                showEditPackage(package['id'],packName,packPrice,currency);
            });

            divDatePrice.appendChild(packagePrice);
            divDatePrice.appendChild(editButton);

            packageData.appendChild(divDatePrice);

            packageItem.appendChild(imgDiv);
            packageItem.appendChild(packageData);
            
            packageList.appendChild(packageItem);
        });

    }


    const showBuyCraftData = (data) => {
        document.querySelector(".secret-key-div").style.display = "none";

        document.querySelector(".TebexData").style.display = "block";
        document.querySelector(".header-tebex-data-title").textContent = data['account']['name'];
        document.querySelector(".header-tebex-data-url").textContent = data['account']['domain'];
        document.querySelector(".header-tebex-data-url").setAttribute("href", data['account']['domain']);
        document.querySelector(".header-tebex-img > img").setAttribute("src", data['favicon']);

        addOrders(data['orders']);
        addCoupons(data['coupons']['data'], data['account']['currency']['symbol']);
        addPackages(data['packages'], data['account']['currency']['symbol']);
    }


    const connectBuyCraft = document.getElementById("searchButton");


    document.getElementById("busqueda").addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && e.target.value.length >= 20) {
            let secret_key = document.getElementById("busqueda").value;
            data = {secret_key: secret_key, token: userToken}
            if(secret_key !== "") {
                ipcRenderer.invoke("connectBuyCraft", data).then((res) => {
                    document.getElementById("busqueda").setAttribute("disabled", "true");
                    document.getElementById("searchButton").setAttribute("disabled", "true");
                    showBuyCraftData(res);
                })
            }
        }
      });

    connectBuyCraft.addEventListener("click", (e) => {
        console.log(e.target);
        console.log (typeof (e.target.value))
        console.log(document.getElementById("busqueda"));
        console.log(document.getElementById("busqueda").value);
        if (document.getElementById("busqueda").value.length >= 20) {
            console.log("hacking")
            let secret_key = document.getElementById("busqueda").value;
            data = {secret_key: secret_key, token: userToken}
            if(secret_key !== "") {
                ipcRenderer.invoke("connectBuyCraft", data).then((res) => {
                    document.getElementById("busqueda").setAttribute("disabled", "true");
                    document.getElementById("searchButton").setAttribute("disabled", "true");
                    showBuyCraftData(res);
                })
            }
        }
        e.preventDefault();
    });

    const tabButtonOrders = document.getElementById("orders-button");
    const tabButtonCoupons = document.getElementById("cupons-button");
    const tabButtonPackages = document.getElementById("packages-button");

    tabButtonOrders.addEventListener("click", () => {
        document.querySelector(".tebex-orders").style.display = "block";
        document.querySelector(".tebex-coupons").style.display = "none";
        document.querySelector(".tebex-packages").style.display = "none";
    });

    tabButtonCoupons.addEventListener("click", () => {
        document.querySelector(".tebex-orders").style.display = "none";
        document.querySelector(".tebex-coupons").style.display = "block";
        document.querySelector(".tebex-packages").style.display = "none";
    });

    tabButtonPackages.addEventListener("click", () => {
        document.querySelector(".tebex-orders").style.display = "none";
        document.querySelector(".tebex-coupons").style.display = "none";
        document.querySelector(".tebex-packages").style.display = "block";
    });



});

