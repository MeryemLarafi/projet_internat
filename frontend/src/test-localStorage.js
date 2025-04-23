// Script de test pour vérifier si le localStorage fonctionne correctement
console.log("Test du localStorage...");

// Vérifier si le localStorage est disponible
if (typeof localStorage !== 'undefined') {
  console.log("localStorage est disponible");
  
  // Tester l'écriture dans le localStorage
  try {
    localStorage.setItem('test', 'Ceci est un test');
    console.log("Écriture dans le localStorage réussie");
    
    // Tester la lecture depuis le localStorage
    const valeur = localStorage.getItem('test');
    console.log("Valeur lue depuis le localStorage:", valeur);
    
    // Tester la suppression depuis le localStorage
    localStorage.removeItem('test');
    console.log("Suppression depuis le localStorage réussie");
    
    console.log("Test du localStorage terminé avec succès");
  } catch (error) {
    console.error("Erreur lors du test du localStorage:", error);
  }
} else {
  console.error("localStorage n'est pas disponible");
} 