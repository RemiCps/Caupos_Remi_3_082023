// Récupération des données depuis le fichier JSON
async function fetchWorks() {
   const response = await fetch("http://localhost:5678/api/works")
   return response.json()
}
const works = await fetchWorks()

// Récupération de l'élément du DOM qui accueillera les fiches

function genererWorks(works) {
   const sectionGalerie = document.querySelector(".gallery")
   for (let i = 0; i < works.length; i++) {

      const article = works[i];
      // Création d’une balise dédiée à une fiche
      const worksElement = document.createElement("figure")
      worksElement.setAttribute("id", `fig-${article.id}`)
      // Création des balises 
      const imageElement = document.createElement("img")
      imageElement.src = article.imageUrl
      const nomElement = document.createElement("figcaption")
      nomElement.innerText = article.title

      sectionGalerie.appendChild(worksElement)
      worksElement.appendChild(imageElement)
      worksElement.appendChild(nomElement)
   }
}
genererWorks(works);

// Création des boutons du filtre

// filtre tous
const tousFiltrer = document.querySelector(".btnTous");
const sectionGalerie = document.querySelector(".gallery")
tousFiltrer.addEventListener("click", function () {
   sectionGalerie.innerHTML = ""
   genererWorks(works)
})

let categories = await fetch("http://localhost:5678/api/categories")
categories = await categories.json()
let filtres = document.querySelector(".filtres")

function listerCategories() {
   categories.forEach((categorie) => {
      let boutons = document.createElement("button")
      boutons.innerHTML = categorie.name
      filtres.appendChild(boutons)
      boutons.addEventListener("click", function () {
         const worksFiltres = works.filter(obj => obj.categoryId === categorie.id)
         document.querySelector(".gallery").innerHTML = ""
         genererWorks(worksFiltres)
      })
   })
}
listerCategories()
//------------------------------- Les données du localstorage ------------------------------//
let dataResponse = window.localStorage.getItem("token")

//---------------------------- Apparition du mode edition --------------------------//
// Fait apparaitre les éléments cachés si logged
const accueilModeEdition = document.getElementsByClassName("log")
const login = document.querySelector(".login")
const logout = document.querySelector(".logout")

function refreshAccueil() {
   for (let element of accueilModeEdition) {
      if (dataResponse) {
         element.style.display = "flex"
      } else {
         element.style.display = "none"
      }
   }

   if (dataResponse) {
      logout.style.display = "flex"
      login.style.display = "none"
      filtres.style.display = "none"
   } else {
      logout.style.display = "none"
      login.style.display = "flex"
      filtres.style.display = "flex"
   }
}
refreshAccueil()

logout.addEventListener("click", function (e) {
   window.localStorage.removeItem("token")
   e.preventDefault()
   for (let element of accueilModeEdition) {
      element.style.display = "none"
   }
   logout.style.display = "none"
   login.style.display = "flex"
   filtres.style.display = "flex"
})

//------------------------------ Switcher de modale ----------------------------//
function changerModale(id) {
   document.getElementById("modal-v1").style.display = "none"
   document.getElementById("modal-v2").style.display = "none"
   document.getElementById(id).style.display = null
}

//------------------------------ Création de la modale -----------------------------//
let modal = null
const stopPropagation = function (e) {
   e.stopPropagation()
}

function fermerModale() {
   if (modal === null) return

   modal.style.display = "none"
   modal.setAttribute("aria-hidden", "true")
   modal.removeEventListener("click", fermerModale)
   modal.querySelector(".js-modal-close").removeEventListener("click", fermerModale)
   modal.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation)
   changerModale("modal-v1")
   modal = null
}

const ouvrirModale = function (e) {
   e.preventDefault()
   modal = document.querySelector(e.target.getAttribute("href"))
   modal.style.display = null
   modal.removeAttribute("aria-hidden")
   modal.querySelector(".js-modal-close").addEventListener("click", fermerModale)
   modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation)
   modal.addEventListener("click", fermerModale)
}
document.querySelectorAll(".js-modal").forEach(a => {
   a.addEventListener("click", ouvrirModale)
})

// Modale se ferme en cliquant sur la croix v1 ou v2 
let fermetureModals = document.querySelectorAll(".js-modal-close").forEach(function (btn) {
   btn.addEventListener("click", fermerModale)
})


//------------------ Affichage gallerie ------------------// 
function genererPhotosModal(works) {
   //Création d'une boucle qui va prendre toutes les photos
   for (let i = 0; i < works.length; i++) {
      // Création des balises
      const article = works[i]

      const galerieModale = document.querySelector(".gallery-modal")

      const articleElement = document.createElement("article")
      articleElement.classList.add("photosRealisation")
      articleElement.dataset.id = [i]

      const idElement = document.createElement("p")
      idElement.innerText = article.id

      //Ajout de l'icone supprimé-----------
      const iconeElement = document.createElement("div")
      iconeElement.setAttribute("id", article.id)
      iconeElement.classList.add("deletePhoto")
      iconeElement.innerHTML =
         '<i class="fa-solid fa-trash-can"></i>'

      const imageElement = document.createElement("img")
      imageElement.src = article.imageUrl

      const categoryIdElement = document.createElement("p")
      categoryIdElement.innerText = article.categoryId

      //Ajout de articleElement dans galerieModale

      galerieModale.appendChild(articleElement)

      //Ajout de nos balises au DOM
      articleElement.appendChild(imageElement)
      articleElement.appendChild(iconeElement)

      //--------------Suppression photo--------------------------------

      iconeElement.addEventListener("click", async (e) => {
         e.preventDefault()

         const sectionGalerie = document.querySelector(".gallery")
         const iconeElement = article.id
         const idCible = `fig-${iconeElement}`

         let response = await fetch(
            `http://localhost:5678/api/works/${iconeElement}`, {
               method: "DELETE",
               headers: {
                  Authorization: `Bearer ${dataResponse}`,
               },
            }
         );
         if (response.ok) {
            alert("Photo supprimé avec succes")
            const pictureSupprime = document.getElementById(idCible)
            galerieModale.removeChild(articleElement)
            sectionGalerie.removeChild(pictureSupprime)


         } else {
            alert("Echec de la suppression")
         }
      })

   }
}
genererPhotosModal(works)

// Switche sur la v2 en cliquant sur le bouton "Ajout photo"

document.querySelector(".btn-ajout").addEventListener("click", function () {
   changerModale("modal-v2")
});

// Switche sur la v1 en cliquant sur la flèche retour
document
   .querySelector(".js-retour-modal1")
   .addEventListener("click", function () {
      changerModale("modal-v1")
      effacerPhoto()
      effacerTitle()
      effacerCategory()
      messageErrFormModal.style.visibility = "hidden"
   });


//---------------------------------------------------------------------------------//
//------------------------ Upload photo dans le formulaire ------------------------//
const imageForm = document.querySelector("#image")
var uploadedImage = ""

imageForm.addEventListener("change", function () {
   const reader = new FileReader()
   reader.addEventListener("load", () => {
      uploadedImage = reader.result
      document.querySelector(
         "#display-image"
      ).style.backgroundImage = `url(${uploadedImage})`;
      document.querySelector(".display-image-none").style.display = "none"
   })
   reader.readAsDataURL(this.files[0])
})

//--------------------------------------------------------------------------------//
//------------------ Création liste déroulante formulaire modale -----------------//

// Crée les <options> de la balise <select> en parcourant la liste des catégories de l'API

for (let i = 0; i < categories.length; i++) {
   const selectForm = document.getElementById("category")

   const categorie = categories[i]

   const optionForm = document.createElement("option")
   optionForm.innerText = categorie.name
   optionForm.value = categorie.id

   selectForm.appendChild(optionForm)
}


//---------------------------------------------------------------------------------//
//--------------------------- Effacer le contenu du formulaire --------------------//
// Fonction effacer la photo uploadée
function effacerPhoto() {
   imageForm.value = null
   document.querySelector("#display-image").style.backgroundImage = null
   document.querySelector(".display-image-none").style.display = "block"
}

// Fonction effacer le titre
const titreForm = document.querySelector("#title")

function effacerTitle() {
   titreForm.value = null
}

// Fonction effacer la categorie selectionnée
const categoryForm = document.querySelector("#category")

function effacerCategory() {
   categoryForm.value = null
}


//--------------------------------------------------------------------------------//
//---------------------- Changement couleur bouton submit ------------------------//

// Bouton Valider passera de gris à vert si tous les champs sont remplis
function submitFormColor() {
   if (
      imageForm.value.length > 0 &&
      titreForm.value.length > 0 &&
      categoryForm.value.length > 0
   ) {
      document.querySelector(".btn-submit-modal").style.background = "#1D6154"
   } else {
      document.querySelector(".btn-submit-modal").style.background = "grey"
   }
}

imageForm.addEventListener("change", submitFormColor)
titreForm.addEventListener("keyup", submitFormColor)
categoryForm.addEventListener("change", submitFormColor)

//--------------------------------------------------------------------------------//
//-------------------- Envoi des données du formulaire modale --------------------//

// Récupère les données du formulaire
const projectForm = document.querySelector(".modal-form")
let messageErrFormModal = document.querySelector(".erreur-form-modal")

projectForm.addEventListener("submit", async function (e) {
   e.preventDefault()

   const formData = new FormData(projectForm)
   const image = formData.get("image")
   const title = formData.get("title")
   const category = formData.get("category")

   // Instruction if pour contrôler la validité de tous les champs
   if (image.size == 0) {
      messageErrFormModal.innerText = "Veuillez mettre une image"
      messageErrFormModal.style.visibility = "visible"
      return 0
   }

   if (image.size > 4194304) {
      messageErrFormModal.innerText =
         "Veuillez mettre une image dont la taille est < à 4mo"
      messageErrFormModal.style.visibility = "visible"
      effacerPhoto()
      return 0
   }

   if (title.length == 0) {
      messageErrFormModal.innerText = "Veuillez mettre un titre"
      messageErrFormModal.style.visibility = "visible"
      return 0
   }

   if (!category) {
      messageErrFormModal.innerText = "Veuillez selectionner une catégorie"
      messageErrFormModal.style.visibility = "visible"
      return 0
   }

   //***** Envoie les données du nouveau projet en POST via fetch

   const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
         Authorization: `Bearer ${dataResponse}`,
         Accept: "application/json"
      },
      body: formData,
   })

   if (response.ok) {
      alert("Votre projet a bien été ajouté à la base de données")
      effacerPhoto()
      effacerTitle()
      effacerCategory()
      fermerModale()
      const sectionGalerie = document.querySelector(".gallery")
      const galerieModale = document.querySelector(".gallery-modal")

      sectionGalerie.innerHTML = ""
      galerieModale.innerHTML = ""

      const travaux = await fetchWorks()
      genererPhotosModal(travaux)
      genererWorks(travaux)

   }
})