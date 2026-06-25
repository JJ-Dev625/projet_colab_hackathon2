// ==========================================================================
// CONSOLE DISTRIBUTEUR - LOGIQUE DE SYNCHR======
ONISATION FILTRÉE PAR FOURNISSEUR
// ====================================================================
document.addEventListener("DOMContentLoaded", () => {
  
  // Sécurité d'accès : Si pas connecté ou pas fournisseur, retour direct
  if (localStorage.getItem("user_connecte") !== "true" || localStorage.getItem("user_role") !== "fournisseur") {
      alert("Accès refusé. Cette console est réservée aux distributeurs Nyoni.");
      window.location.href = "connexion.html";
      return;
  }

  // RÉCUPÉRATION DE L'EMAIL DU FOURNISSEUR CONNECTÉ (Sert de clé unique)
  const emailFournisseurConnecte = localStorage.getItem("user_email") || "generique@nyoni.ga";

  // ==========================================
  // 1) GESTION DES ONGLETS (TABS)
  // ==========================================
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  function ouvrirOnglet(id) {
    tabContents.forEach((contenu) => {
      const actif = contenu.id === id;
      contenu.classList.toggle("active", actif);
      contenu.setAttribute("aria-hidden", !actif);
    });

    tabButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.target === id);
    });
  }

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      ouvrirOnglet(btn.dataset.target);
    });
  });

  // ==========================================
  // 2) CHARGEMENT ET RENDU DU STOCK FILTRÉ
  // ==========================================
  const tbody = document.getElementById("supplier-stock-list");
  const productsCountEl = document.getElementById("products-count");

  function chargerStockFournisseur() {
    // 1. Récupère le stock global de la plateforme
    const stockGlobal = JSON.parse(localStorage.getItem("stocks_nyoni")) || [];
    
    // 2. CORRECTION : On filtre pour ne garder QUE les produits de CE fournisseur
    const monStockAmoi = stockGlobal.filter(p => p.fournisseur === emailFournisseurConnecte);
    
    if (!tbody) return;
    tbody.innerHTML = "";

    if (monStockAmoi.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:30px; color:#66736c;">Vous n'avez aucun produit en vitrine actuellement.</td></tr>`;
      productsCountEl.innerText = "0";
      return;
    }

    // Remplissage du tableau avec uniquement ses produits
    monStockAmoi.forEach(p => {
        const tr = document.createElement("tr");
        tr.id = `row-${p.id}`;
        tr.innerHTML = `
          <td data-label="Nom du produit">
            <div style="display:flex; align-items:center; gap:10px;">
              <img src="${p.image}" alt="${p.nom}" style="width:40px; height:40px; border-radius:6px; object-fit:cover;">
              <b>${escapeHtml(p.nom)}</b>
            </div>
          </td>
          <td data-label="Tarification & Quantité">${formatMoney(p.prix)} (${p.stock} pièces dispo)</td>
          <td data-label="Provenance / Cueillette">📍 ${escapeHtml(p.origine)}</td>
          <td data-label="Filière"><span class="status-badge status-local">Filière Gabonaise</span></td>
          <td data-label="Action">
            <button class="btn-delete" data-id="${p.id}" aria-label="Supprimer ce produit">
              <i class="fas fa-trash-alt"></i>
            </button>
          </td>
        `;
        tbody.appendChild(tr);
    });

    // Met à jour la carte statistique supérieure avec son nombre de produits à lui
    productsCountEl.innerText = monStockAmoi.length;
  }

  // ==========================================
  // 3) AJOUT RÉEL DE PRODUIT LIÉ AU FOURNISSEUR
  // ==========================================
  const form = document.getElementById("add-product-form");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const nom = document.getElementById("p-nom").value.trim();
      const prixSaisi = document.getElementById("p-prix").value.trim();
      const stock = document.getElementById("p-stock").value.trim();
      const loc = document.getElementById("p-loc").value.trim();

      if (!nom || !prixSaisi || !stock || !loc) {
        alert("Veuillez remplir tous les champs obligatoires.");
        return;
      }

      const prixFormate = Number(prixSaisi).toLocaleString("fr-FR") + " FCFA";
      let stockGlobal = JSON.parse(localStorage.getItem("stocks_nyoni")) || [];
      const nouvelId = Date.now();

      // CORRECTION : On injecte la propriété 'fournisseur' dans l'objet
      const nouveauProduit = {
          id: nouvelId,
          nom: nom,
          type: "miel", // Catégorisation par défaut
          origine: loc,
          prix: prixFormate,
          stock: parseInt(stock),
          image: "./images/m.png", // Image par défaut
          fournisseur: emailFournisseurConnecte // Marqueur de propriété unique !
      };

      stockGlobal.unshift(nouveauProduit);
      localStorage.setItem("stocks_nyoni", JSON.stringify(stockGlobal));

      form.reset();
      chargerStockFournisseur(); 
      ouvrirOnglet("onglet-liste"); 

      alert(`Succès : Le produit "${nom}" est en ligne et lié à votre compte distributeur ! 🇬🇦`);
    });
  }

  // ==========================================
  // 4) SUPPRESSION REELLE (SÉCURISÉE)
  // ==========================================
  document.body.addEventListener("click", (e) => {
    const btnDelete = e.target.closest(".btn-delete");
    if (!btnDelete) return;

    const idProduit = parseInt(btnDelete.dataset.id);

    if (!confirm("Voulez-vous retirer définitivement ce produit du catalogue Nyoni ?")) {
      return;
    }

    let stockGlobal = JSON.parse(localStorage.getItem("stocks_nyoni")) || [];
    
    // On retire le produit globalement (l'ID étant unique, aucun risque)
    stockGlobal = stockGlobal.filter(p => p.id !== idProduit);
    localStorage.setItem("stocks_nyoni", JSON.stringify(stockGlobal));

    chargerStockFournisseur();
  });

  // ==========================================
  // 5) MESSAGERIE CLIENTS SIMULÉE
  // ==========================================
  document.body.addEventListener("click", (e) => {
    const btnReply = e.target.closest(".btn-reply");
    const btnCancel = e.target.closest(".btn-cancel-reply");
    const btnSend = e.target.closest(".btn-send-reply");

    if (btnReply) {
      const boxId = btnReply.dataset.target;
      const box = document.getElementById(boxId);
      if (box) {
        box.hidden = !box.hidden;
        if (!box.hidden) {
          const textarea = box.querySelector("textarea");
          if (textarea) textarea.focus();
        }
      }
    }

    if (btnCancel) {
      const boxId = btnCancel.dataset.target;
      const box = document.getElementById(boxId);
      if (box) box.hidden = true;
    }

    if (btnSend) {
      const messageName = btnSend.dataset.message;
      const messageItem = btnSend.closest(".message-item");
      const textarea = messageItem.querySelector("textarea");

      if (!textarea || textarea.value.trim() === "") {
        alert("Veuillez rédiger une réponse avant d'envoyer.");
        return;
      }

      alert(`Réponse transmise à ${messageName} :\n\n"${textarea.value.trim()}"`);
      
      textarea.value = "";
      const replyBox = btnSend.closest(".reply-box");
      if (replyBox) replyBox.hidden = true;
      
      if (messageItem) {
          messageItem.classList.remove("unread");
          document.getElementById("messages-count").innerText = "0";
      }
    }
  });

  // ==========================================
  // 6) SECURITE LOGOUT / QUITTER
  // ==========================================
  const btnQuit = document.querySelector(".btn-quit");
  if (btnQuit) {
      btnQuit.addEventListener("click", () => {
          alert("Fermeture de la console de gestion.");
      });
  }

  // UTILS SANITIZATION
  function escapeHtml(text) {
    return text
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function formatMoney(value) {
      if (typeof value === "string") return value; 
      return value.toLocaleString("fr-FR") + " FCFA";
  }

  chargerStockFournisseur();
});
