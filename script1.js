// ==========================================================================
// CONFIGURATION ET INITIALISATION DES DONNÉES
// ==========================================================================

// 1. CATALOGUE COMPLET DES 05 PRODUITS INITIAUX
const catalogueInitial = [
  {
    id: 1,
    nom: "Chenilles de l'Arbre à Pain",
    type: "chenille",
    origine: "Woleu-Ntem",
    prix: "10 000 FCFA",
    stock: 65,
    image: "images/4.png",
  },
  {
    id: 2,
    nom: "Chenilles Rouges de l'Ogooué",
    type: "chenille",
    origine: "Ogooué-Lolo",
    prix: "10 000 FCFA",
    stock: 22,
    image: "images/3.png",
  },

  {
    id: 3,
    nom: "Vers à Soie Vivants de la Nyanga",
    type: "ver",
    origine: "Nyanga",
    prix: "10 000 FCFA",
    stock: 18,
    image: "images/7.png",
  },
  {
    id: 4,
    nom: "Miel Pur Sauvage Extrait à Froid",
    type: "miel",
    origine: "Woleu-Ntem",
    prix: "15 000 FCFA",
    stock: 50,
    image: "images/m.png",
  },

  {
    id: 5,
    nom: "Élixir de Moucheron de Mandji",
    type: "moucheron",
    origine: "Ogooué-Maritime",
    prix: "26 000 FCFA",
    stock: 5,
    image: "images/m6.png",
  },
];

const fichesRecettes = [
  {
    id: "r1",
    titre: "Evoura dans le chocolat indigène",
    prix: "5 000 FCFA",
    image: "./images/p4.png",
  },
  {
    id: "r2",
    titre: "EKELE ",
    prix: "5 000 FCFA",
    image: "./images/p3.png",
  },
  {
    id: "r3",
    titre: "Verre à soie sauté",
    prix: "2 000 FCFA",
    image: "./images/Vs.png",
  },
];

// 2. BASE DE DONNÉES DE PUBLICATIONS ÉPHÉMÈRES (CHARTE GRAPHIQUE)
const publicationsNyoni = [
  {
    icon: "🔥",
    titre: "Arrivage Spécial Ogooué-Ivindo !",
    texte:
      "Les récoltes fraîches de chenilles d'Odika viennent d'arriver à Libreville. Les stocks sont très limités !",
  },
  {
    icon: "🐝",
    titre: "Le Saviez-vous ?",
    texte:
      "Le Miel de Moucherons de Kango est collecté de manière ancestrale au cœur de nos mangroves. Un trésor d'une rareté absolue.",
  },
  {
    icon: "✈️",
    titre: "Livraison Internationale disponible",
    texte:
      "Nyoni exporte la richesse de notre terroir partout dans le monde et prend en charge l'ensemble des certificats phytosanitaires obligatoires.",
  },
];

// INITIALISATION SÉCURISÉE DU STOCK DANS LE LOCALSTORAGE
// On vérifie d'abord s'il existe déjà pour ne pas écraser les modifications du fournisseur
if (!localStorage.getItem("stocks_nyoni")) {
  localStorage.setItem("stocks_nyoni", JSON.stringify(catalogueInitial));
}

// ==========================================================================
// FONCTIONS D'AFFICHAGE ET RENDU DYNAMIQUE
// ==========================================================================

// AFFICHAGE DU CATALOGUE
function afficherCatalogue(produits) {
  const grille = document.getElementById("product-grid");
  if (!grille) return;
  grille.innerHTML =
    produits.length === 0 ? "<p>Aucun produit trouvé.</p>" : "";

  produits.forEach((p) => {
    grille.innerHTML += `
            <div class="card">
                <img src="${p.image}" alt="${p.nom}" class="card-img">
                <div class="card-body">
                    <span class="card-tag">📍 ${p.origine}</span>
                    <h3>${p.nom}</h3>
                    <p class="quantity-tag">Stock : <b>${p.stock}</b> dispo(s)</p>
                    <div class="card-footer-flex">
                        <div class="price">${p.prix}</div>
                        <button onclick="ajouterAuPanierDirect(${p.id})" class="btn btn-primary">🛒 Ajouter</button>
                    </div>
                </div>
            </div>
        `;
  });
}

// AFFICHAGE DES RECETTES
function afficherRecettes() {
  const grilleRecette = document.getElementById("recipe-grid");
  if (!grilleRecette) return;
  grilleRecette.innerHTML = fichesRecettes
    .map(
      (r) => `
        <div class="card">
            <img src="${r.image}" alt="${r.titre}" class="card-img">
            <div class="card-body">
                <span class="card-tag">🍳 GASTRONOMIE</span>
                <h3>${r.titre}</h3>
                <div class="card-footer-flex">
                    <div class="price">${r.prix}</div>
                    <button class="btn btn-secondary" onclick="ajouterRecetteAuPanier('${r.id}', '${r.titre}', '${r.prix}')">Acheter</button>
                </div>
            </div>
        </div>
    `,
    )
    .join("");
}

// GESTION DU SYSTÈME ACTU / PUBLICATIONS TOURNANTES
function piloterPublications() {
  const conteneur = document.getElementById("publications-container");
  const blocLive = document.getElementById("live-publication");
  if (!conteneur || !blocLive) return;

  const indexAleatoire = Math.floor(Math.random() * publicationsNyoni.length);
  const pub = publicationsNyoni[indexAleatoire];

  blocLive.innerHTML = `
        <div style="display: flex; align-items: center; gap: 20px;">
            <div style="font-size: 2.5rem; background: #fff; padding: 10px; border-radius: 50%; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">${pub.icon}</div>
            <div>
                <h4 style="margin: 0 0 5px 0; color: #ffb703; font-size: 1.2rem; font-weight: bold; text-transform: uppercase;">⚡ Nyoni Actu</h4>
                <p style="margin: 0; font-weight: bold; font-size: 1.1rem; color: #ffffff;">${pub.titre}</p>
                <p style="margin: 5px 0 0 0; font-size: 0.95rem; color: #f8faf9; opacity: 0.95;">${pub.texte}</p>
            </div>
        </div>
    `;

  conteneur.style.display = "block";
}

// FILTRAGE AVANCÉ
function filtrerProduits() {
  const texteSaisi = document
    .getElementById("search-input")
    .value.toLowerCase();
  const filtreType = document.getElementById("filter-select").value;

  // Récupération sécurisée du stock actuel
  const stockStocke = localStorage.getItem("stocks_nyoni");
  const complet = stockStocke ? JSON.parse(stockStocke) : catalogueInitial;

  const resultat = complet.filter((p) => {
    const correspondTexte =
      p.nom.toLowerCase().includes(texteSaisi) ||
      p.origine.toLowerCase().includes(texteSaisi);
    const correspondType = filtreType === "tous" || p.type === filtreType;
    return correspondTexte && correspondType;
  });
  afficherCatalogue(resultat);
}

// ==========================================================================
// LOGIQUE DE SESSION (COMMUNICATION AVEC CONNEXION.HTML)
// ==========================================================================

function ajouterAuPanierDirect(id) {
  if (localStorage.getItem("user_connecte") !== "true") {
    alert(
      "Oups ! Vous devez être connecté pour ajouter des articles à votre panier. 🇬🇦",
    );
    window.location.href = "login.html";
    return;
  }

  const stockStocke = localStorage.getItem("stocks_nyoni");
  const complet = stockStocke ? JSON.parse(stockStocke) : catalogueInitial;
  const produit = complet.find((p) => p.id === id);
  let panier = JSON.parse(localStorage.getItem("panier_nyoni")) || [];

  const itemExistant = panier.find((item) => item.id === id && !item.isRecette);
  if (itemExistant) {
    itemExistant.quantite += 1;
  } else {
    panier.push({
      id: produit.id,
      nom: produit.nom,
      prix: produit.prix,
      quantite: 1,
      isRecette: false,
    });
  }

  localStorage.setItem("panier_nyoni", JSON.stringify(panier));
  mettreAjourBadgePanier();
  alert(`"${produit.nom}" a bien été ajouté à votre panier !`);
}

function ajouterRecetteAuPanier(id, titre, prix) {
  if (localStorage.getItem("user_connecte") !== "true") {
    alert("Oups ! Veuillez vous connecter pour acheter cette fiche recette.");
    window.location.href = "login.html";
    return;
  }

  let panier = JSON.parse(localStorage.getItem("panier_nyoni")) || [];
  const itemExistant = panier.find((item) => item.id === id && item.isRecette);

  if (!itemExistant) {
    panier.push({
      id: id,
      nom: titre,
      prix: prix,
      quantite: 1,
      isRecette: true,
    });
    localStorage.setItem("panier_nyoni", JSON.stringify(panier));
    mettreAjourBadgePanier();
    alert(`Recette : "${titre}" ajoutée !`);
  } else {
    alert("Cette fiche recette est déjà dans votre panier.");
  }
}

function mettreAjourBadgePanier() {
  const panier = JSON.parse(localStorage.getItem("panier_nyoni")) || [];
  const total = panier.reduce((acc, item) => acc + item.quantite, 0);
  const badge = document.getElementById("cart-count");
  if (badge) badge.innerText = total;
}

function synchroniserEtatAuthentification() {
  const authBtn = document.getElementById("nav-auth-btn");
  if (!authBtn) return;

  if (localStorage.getItem("user_connecte") === "true") {
    const prenom = localStorage.getItem("user_name") || "Profil";

    authBtn.innerHTML = `<i class="fas fa-sign-out-alt"></i> Déconnexion (${prenom})`;
    authBtn.href = "#";

    authBtn.onclick = function (e) {
      e.preventDefault();
      localStorage.removeItem("user_connecte");
      localStorage.removeItem("user_role");
      localStorage.removeItem("user_name");
      localStorage.removeItem("user_email");

      alert("Vous avez été déconnecté avec succès. À bientôt !");
      window.location.reload();
    };
  } else {
    authBtn.innerHTML = `<i class="fas fa-user"></i> Connexion`;
    authBtn.href = "login.html";
    authBtn.onclick = null;
  }
}

// ==========================================================================
// UTILITAIRES DE NAVIGATION GENERALE
// ==========================================================================

window.onscroll = function () {
  const btn = document.getElementById("scroll-top-btn");
  if (!btn) return;
  if (
    document.body.scrollTop > 300 ||
    document.documentElement.scrollTop > 300
  ) {
    btn.style.display = "block";
  } else {
    btn.style.display = "none";
  }
};

function remonterEnHaut() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function toggleMenu() {
  const navLinks = document.getElementById("nav-links");
  if (navLinks) {
    navLinks.classList.toggle("open");
  }
}

// ==========================================================================
// LANCEMENT SÉCURISÉ DES FONCTIONS
// ==========================================================================
window.onload = function () {
  // 1. Récupération saine des données ou repli sur le tableau brut si vide
  const stockActuel = localStorage.getItem("stocks_nyoni");
  const listeProduits = stockActuel
    ? JSON.parse(stockActuel)
    : catalogueInitial;

  // 2. Affichages graphiques
  afficherCatalogue(listeProduits);
  afficherRecettes();
  mettreAjourBadgePanier();

  // 3. Boucle de rotation des actualités
  piloterPublications();
  setInterval(piloterPublications, 15000);

  // 4. Synchronisation Navbar
  synchroniserEtatAuthentification();
};
