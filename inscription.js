// ==========================================================================
// NYONI - LOGIQUE DE LA PAGE D'INSCRIPTION COMPTE
// ==========================================================================

let profilSelectionne = 'client';

/**
 * Alterne visuellement l'affichage des onglets et adapte les textes/couleurs
 */
function changerProfilInscription(profil) {
    profilSelectionne = profil;
    
    // Récupération des éléments du DOM correspondants à inscription.html
    const tabClient = document.getElementById("tab-client");
    const tabFournisseur = document.getElementById("tab-fournisseur");
    const title = document.getElementById("auth-title");
    const subtitle = document.getElementById("auth-subtitle");
    const submitBtn = document.getElementById("btn-submit-text");
    const labelNom = document.getElementById("label-nom");
    const inputNom = document.getElementById("reg-nom");
    const inputLoc = document.getElementById("reg-loc");

    if (profil === 'client') {
        // Activation visuelle de l'onglet
        tabClient.classList.add("active");
        tabFournisseur.classList.remove("active");
        
        // Mise à jour des textes
        if (title) title.innerText = "Créer un compte Client";
        if (subtitle) subtitle.innerText = "Découvrez et commandez les trésors de notre terroir forestier";
        if (labelNom) labelNom.innerText = "Nom complet *";
        if (inputNom) inputNom.placeholder = "Ex: Jean Junior";
        if (inputLoc) inputLoc.placeholder = "Ex: Estuaire (Bikélé)";
        
        // Configuration du bouton Client
        submitBtn.innerHTML = '<i class="fas fa-user-plus"></i> Créer mon compte Client';
        submitBtn.style.backgroundColor = "#0f5132";
        submitBtn.style.color = "#ffffff";
    } else {
        // Activation visuelle de l'onglet
        tabFournisseur.classList.add("active");
        tabClient.classList.remove("active");
        
        // Mise à jour des textes
        if (title) title.innerText = "Espace Distributeur / Collecteur";
        if (subtitle) subtitle.innerText = "Rejoignez la plateforme et distribuez vos produits locaux";
        if (labelNom) labelNom.innerText = "Nom de la coopérative ou Raison sociale *";
        if (inputNom) inputNom.placeholder = "Ex: Les Cueilleurs de l'Ivindo";
        if (inputLoc) inputLoc.placeholder = "Ex: Ogooué-Ivindo (Makokou)";
        
        // Configuration du bouton Fournisseur
        submitBtn.innerHTML = '<i class="fas fa-store"></i> Enregistrer ma Console Distributeur';
        submitBtn.style.backgroundColor = "#ffb703";
        submitBtn.style.color = "#000000";
    }
}

/**
 * Traite la soumission du formulaire d'inscription
 */
function gererInscription(event) {
    event.preventDefault();

    const nom = document.getElementById("reg-nom").value.trim();
    const email = document.getElementById("reg-email").value.trim().toLowerCase();
    const localisation = document.getElementById("reg-loc").value.trim();
    const password = document.getElementById("reg-pass").value;

    if (!nom || !email || !localisation || !password) {
        alert("Veuillez remplir tous les champs obligatoires.");
        return;
    }

    // Sauvegarde des données dans le localStorage
    localStorage.setItem("user_name", nom);
    localStorage.setItem("user_email", email);
    localStorage.setItem("user_role", profilSelectionne);
    localStorage.setItem("user_connecte", "true");

    // Redirection selon le choix de profil
    if (profilSelectionne === 'client') {
        alert(`Bienvenue chez Nyoni, ${nom} ! Votre compte client a été créé avec succès. 🇬🇦`);
        window.location.href = "index.html";
    } else {
        alert(`Félicitations ! La console distributeur pour "${nom}" a été configurée.`);
        window.location.href = "fournisseur1.html";
    }
}
