const formulaire = document.querySelector(".formulaire");
const erreurMotDePasse = document.querySelector(".erreurMotDePasse");
const erreurMail = document.querySelector(".erreurMail");

function messageErreurLogin(querySelector, message) {
    document.querySelector(querySelector).innerHTML = message;
};
formulaire.addEventListener("submit", async function (event) {
    event.preventDefault();
    const mail = document.getElementById("email").value.trim();
    const motDePasse = document.getElementById("password").value.trim();
    const regexEmail = new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]");

    

    if (mail == "") {
        messageErreurLogin(".erreurMail", "Le champ E-Mail est vide");

    } else if (regexEmail.test(mail) == false) {
        messageErreurLogin(".erreurMail", "L'e-mail est invalide");

    } else {
        
        erreurMail.innerHTML = "";
    }
    
    if (motDePasse == "") {
        messageErreurLogin(".erreurMotDePasse", "Le champ Mot de passe est vide");

    } else {
        const erreurMotDePasse = document.querySelector(".erreurMotDePasse");
        erreurMotDePasse.innerHTML = "";
    }
    await loggin(mail, motDePasse);
});


const loggin = async (mail, motDePasse) => {
    let user = {
        email: mail,
        password: motDePasse
    };

    try {
        let response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify(user)
        });
        const result = await response.json();
        if (response.status === 200) {
            localStorage.setItem("token", result.token);
            document.location.href = "index.html";

        } else if (response.status === 404) {
            if (motDePasse == "") {
                messageErreurLogin(".erreurMotDePasse", "Le champ Mot de passe est vide");
            } else {
                messageErreurLogin(".erreurMotDePasse", "Erreur dans l’identifiant ou le mot de passe");
            }

        } else if (response.status === 401) {
            if (motDePasse == "") {
                messageErreurLogin(".erreurMotDePasse", "Le champ Mot de passe est vide");
            } else {
                messageErreurLogin(".erreurMotDePasse", "Erreur dans l’identifiant ou le mot de passe");
            }
        };

    } catch (error) {
        if (motDePasse == "") {
            messageErreurLogin(".erreurMotDePasse", "Le champ Mot de passe est vide");
        } else {
            erreurMotDePasse.innerHTML = "Erreur dans l’identifiant / le mot de passe ou l'API est indisponible";
        }
    };
};
