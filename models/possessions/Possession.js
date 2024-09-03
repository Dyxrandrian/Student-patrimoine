export default class Possession {
  constructor(possesseur, libelle, valeur, dateDebut, dateFin, tauxAmortissement) {
    this.possesseur = possesseur;
    this.libelle = libelle;
    this.valeur = valeur;
    this.dateDebut = dateDebut;
    this.dateFin = dateFin;
    this.tauxAmortissement = tauxAmortissement;
  }

  getValeur(date) {
    return this.getValeurApresAmortissement(date);
  }

  getValeurApresAmortissement(dateActuelle) {
    if (dateActuelle < this.dateDebut) {
        return 0;
    }
    
    // Calculer la différence en mois
    const moisDiff = (dateActuelle.getFullYear() - this.dateDebut.getFullYear()) * 12 + 
                      (dateActuelle.getMonth() - this.dateDebut.getMonth());

    // Convertir les mois en années
    const anneesDiff = moisDiff / 12;

    // Calculer la nouvelle valeur après amortissement
    const valeurApresAmortissement = this.valeur * (1 - (anneesDiff * this.tauxAmortissement / 100));

    // S'assurer que la valeur n'est pas négative
    return Math.max(valeurApresAmortissement, 0);
}

}
