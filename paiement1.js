

document.addEventListener('DOMContentLoaded', function() {
    const selectLivraison = document.getElementById('mode-livraison');
    const affichageFrais = document.getElementById('frais-livraison');
    const affichageTotal = document.getElementById('total-commande');
    const alertePhyto = document.getElementById('phytosanitary-alert');
    const formPaiement = document.getElementById('payment-form');
    
    const sousTotalPanier = 7000; // Exemple simulé d'un panier en V1

    if (selectLivraison) {
        selectLivraison.addEventListener('change', function() {
            let frais = 0;
            let option = this.value;

            // Logique de frais basée sur la stratégie de distribution
            if (option === 'local') {
                frais = 2000;
                alertePhyto.style.display = 'none';
            } else if (option === 'province') {
                frais = 5000;
                alertePhyto.style.display = 'none';
            } else if (option === 'international') {
                frais = 25000;
                alertePhyto.style.display = 'block'; // Fait apparaitre l'argument phytosanitaire
            }

            // Calcul et affichage au format propre
            affichageFrais.innerText = frais.toLocaleString() + " FCFA";
            let totalGeneral = sousTotalPanier + frais;
            affichageTotal.innerText = totalGeneral.toLocaleString() + " FCFA";
        });
    }

    if (formPaiement) {
        formPaiement.addEventListener('submit', function(e) {
            e.preventDefault();
            const nom = document.getElementById('client-name').value;
            const mode = document.querySelector('input[name="payment-method"]:checked').value;
            
            alert(`Merci ${nom} ! Votre commande Nyoni a été validée via ${mode.toUpperCase()}. Le suivi de livraison vous a été envoyé.`);
        });
    }
});
