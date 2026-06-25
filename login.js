// Variable d'état pour suivre le profil actif
let profilSelectionne = 'client';

/**
 * Alterne visuellement l'affichage des onglets et adapte l'identité visuelle
 */
function choisirProfil(profil) {
    profilSelectionne = profil;
    
    const tabClient = document.getElementById("tab-client");
    const tabFournisseur = document.getElementById("tab-fournisseur");
    const title = document.getElementById("auth-title");
    const subtitle = document.getElementById("auth-subtitle");
    const submitBtn = document.getElementById("submit-btn");
    const errorBox = document.getElementById("error-box");

    // Réinitialise les erreurs lors du switch
    errorBox.style.display = "none";

    if (profil === 'client') {
        tabClient.classList.add("active");
        tabFournisseur.classList.remove("active");
        
        title.innerText = "Espace Client";
        subtitle.innerText = "Connectez-vous pour commander les produits de nos provinces";
        submitBtn.innerText = "Se connecter comme Client";
        
        // Vert Forêt pour l'action client
        submitBtn.style.backgroundColor = "#0f5132";
        submitBtn.style.color = "#ffffff";
    } else {
        tabFournisseur.classList.add("active");
        tabClient.classList.remove("active");
        
        title.innerText = "Espace Fournisseur";
        subtitle.innerText = "Accédez à votre console pour gérer vos stocks et produits";
        submitBtn.innerText = "Accéder au Dashboard";
        
        // Or Territoire pour l'action fournisseur
        submitBtn.style.backgroundColor = "#ffb703";
        submitBtn.style.color = "#000000";
    }
}

/**
 * Traite la soumission des données selon le profil choisi
 */
function gererConnexion(event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const errorBox = document.getElementById("error-box");
    const errorText = document.getElementById("error-text");

    errorBox.style.display = "none";

    if (profilSelectionne === 'client') {
        // Validation Client de Test
        if (email === "client@nyoni.ga" && password === "pass123") {
            localStorage.setItem("user_connecte", "true");
            localStorage.setItem("user_role", "client");
            localStorage.setItem("user_name", "Mon Profil"); 
            
            alert("Connexion client réussie !");
            window.location.href = "index.html";
        } else {
            errorText.innerText = "Identifiants client incorrects (Démo: client@nyoni.ga / pass123)";
            errorBox.style.display = "flex";
        }
    } else {
        // Validation Fournisseur de Test
        if (email === "fournisseur@nyoni.ga" && password === "admin123") {
            localStorage.setItem("user_connecte", "true");
            localStorage.setItem("user_role", "fournisseur");
            
            alert("Bienvenue sur votre console de gestion !");
            window.location.href = "fournisseur1.html"; 
        } else {
            errorText.innerText = "Identifiants fournisseur incorrects (Démo: fournisseur@nyoni.ga / admin123)";
            errorBox.style.display = "flex";
        }
    }
}

// Sécurité : si la session existe déjà, retour immédiat à l'accueil
window.onload = function() {
    if (localStorage.getItem("user_connecte")) {
        window.location.href = "index.html";
    }
};
