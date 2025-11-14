window.addEventListener("load", () => {
    if (localStorage.getItem("inicio_effect") != null) {
        document.body.style.animation = "fadeIn 2s ease";

        localStorage.removeItem("inicio_effect")
    }

})