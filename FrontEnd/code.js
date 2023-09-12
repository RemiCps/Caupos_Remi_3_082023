// Récupération des données depuis le fichier JSON
let works = await fetch("http://localhost:5678/api/works") 
works = await works.json();

// Récupération de l'élément du DOM qui accueillera les fiches
const sectionFiches = document.querySelector(".gallery");
 
function genererWorks(works){
    for (let i = 0; i < works.length; i++) {

        const article = works[i];        
        // Création d’une balise dédiée à une fiche
        const worksElement = document.createElement("figure");
        // Création des balises 
        const imageElement = document.createElement("img");
        imageElement.src = article.imageUrl;
        const nomElement = document.createElement("figcaption");
        nomElement.innerText = article.title;
        
        sectionFiches.appendChild(worksElement);
        worksElement.appendChild(imageElement);
        worksElement.appendChild(nomElement);
    }
}
genererWorks(works);

// Création des boutons du filtre

// filtre tous
const tousFiltrer = document.querySelector(".btnTous");

tousFiltrer.addEventListener("click", function () {
    console.log(works)
    genererWorks(works)
})

let categories = await fetch("http://localhost:5678/api/categories")
categories = await categories.json()
let filtres = document.querySelector(".filtres")

function listerCategorie (){
    categories.forEach ((categorie) => {
        let boutons = document.createElement("button")
        boutons.innerHTML = categorie.name
        filtres.appendChild(boutons)
        boutons.addEventListener("click", function () {
                 const worksFiltres = works.filter(obj => obj.categoryId === categorie.id)
                 document.querySelector(".gallery").innerHTML = "";
                 console.log(worksFiltres)
                 genererWorks(worksFiltres)
             })
    })
}
listerCategorie()
//------------------------------- Les données du localstorage ------------------------------//
// Évenement pour effacer les données du localStorage à la deconnexion et redirection vers index
const boutonLogout = document.querySelector(".logout");
boutonLogout.addEventListener("click", function (event) {
  event.preventDefault();
  window.localStorage.removeItem("token");
  document.location.href = "index.html";
});

// Récupère les data et les parse pour changer la config html de l'index si connecté ou non
let dataResponse = window.localStorage.getItem("token");
console.log(dataResponse)

//----------------------------------------------------------------------------------//
//---------------------------- Apparition du mode edition --------------------------//
// Fait apparaitre les éléments cachés si logged
let homeEditLogin = document.getElementsByClassName("log");

for (let element of homeEditLogin) {
  if (dataResponse) {
    element.style.display = "flex";
  } else {
    element.style.display = "none";
  }
}

let login = document.querySelector(".login")
let logout = document.querySelector(".logout")

  if (dataResponse) {
    logout.style.display = "flex"
    login.style.display = "none"
    filtres.style.display = "none"
  } else {
    logout.style.display = "none"
    login.style.display = "flex"
    filtres.style.display = "flex"
  }

//------------------------------ Création de la modale -----------------------------//
let modal = null
const closeModal = function(e) {
  if (modal === null) return
  e.preventDefault() 
  modal.style.display = "none"
  modal.setAttribute("aria-hidden", "true")
  modal.removeEventListener("click", closeModal)
  modal.querySelector(".js-modal-close").removeEventListener("click", closeModal)
  modal = null
}

const openModal = function (e) {
  e.preventDefault()  
  modal = document.querySelector(e.target.getAttribute("href"))
  modal.style.display = null
  modal.removeAttribute("aria-hidden")
  modal.querySelector(".js-modal-close").addEventListener("click", closeModal)
  modal.addEventListener("click", closeModal)
}
document.querySelectorAll(".js-modal").forEach(a => {
  a.addEventListener("click", openModal)
  
  let gallerieModal = document.querySelector(".gallery-modal")
  gallerieModal.innerHTML = "";
  
  // Parcours le tableau des works pour intégrer chaque work dans des éléments html créés ci-dessous
  for (let work of works) {
    gallerieModal.innerHTML += `<figure>
     <a href="#" class="delete-work" data-id="${work.id}"><i class="fa-solid fa-trash-can"></i></a>
     <img src="${work.imageUrl}" alt="${work.title}">
     <figcaption>Éditer</figcaption>
     </figure>`;
  }
})
