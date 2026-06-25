/**
 * NYONI PLATFORM - SCRIPT PRINCIPAL
 * Gestion du catalogue, du panier, des filtres et des publicités.
 */

// ==========================================================================
// 1. DONNÉES ET INITIALISATION
// ==========================================================================

const catalogueInitial = [
    { id: 1, nom: "Chenilles d'Odika", type: "chenille", origine: "Ogooué-Ivindo", prix: 5000, stock: 40, image: "./images/6.jpeg" },
    { id: 2, nom: "Miel Sauvage", type: "miel", origine: "Woleu-Ntem", prix: 7000, stock: 50, image: "./images/m.png" },
    // ... ajoute le reste de tes produits ici (note : prix en nombre pour le tri)
];

// Initialisation du stock dans le localStorage si inexistant
if (!localStorage.getItem("stocks_nyoni")) {
    localStorage.setItem("stocks_nyoni", JSON.stringify(catalogueInitial));
}

// ==========================================================================
// 2. MOTEUR DE RECHERCHE ET DE TRI
// ==========================================================================

/**
 * Filtre et trie les produits selon le texte, la catégorie et l'option de tri.
 */
function filtrerEtTrierProduits() {
    const texte = document.getElementById("search-input").value.toLowerCase();
    const type = document.getElementById("filter-select").value;
    const tri = document.getElementById("sort-select").value; // Nouveau sélecteur de tri

    let produits = JSON.parse(localStorage.getItem("stocks_nyoni"));

    // 1. Filtrage
    let resultat = produits.filter(p => {
        const matchTexte = p.nom.toLowerCase().includes(texte);
        const matchType = (type === "tous" || p.type === type);
        return matchTexte && matchType;
    });

    // 2. Tri
    if (tri === "prix-asc") resultat.sort((a, b) => a.prix - b.prix);
    if (tri === "prix-desc") resultat.sort((a, b) => b.prix - a.prix);

    afficherCatalogue(resultat);
}

// ==========================================================================
// 3. FONCTIONS D'AFFICHAGE (UI)
// ==========================================================================

function afficherCatalogue(produits) {
    const grille = document.getElementById("product-grid");
    grille.innerHTML = produits.map(p => `
        <div class="card">
            <img src="${p.image}" class="card-img">
            <div class="card-body">
                <h3>${p.nom}</h3>
                <p>${p.prix.toLocaleString()} FCFA</p>
                <button onclick="ajouterAuPanierDirect(${p.id})" class="btn btn-primary">Ajouter</button>
            </div>
        </div>
    `).join('');
}

// ==========================================================================
// 4. LANCEMENT ET ÉVÉNEMENTS
// ==========================================================================

window.onload = () => {
    afficherCatalogue(JSON.parse(localStorage.getItem("stocks_nyoni")));
    // ... autres initialisations
};
