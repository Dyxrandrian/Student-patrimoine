import fs from 'fs/promises';
import Possession from '../models/possessions/Possession.js';
import Flux from '../models/possessions/Possession.js';

async function loadPossessions() {
    try {
        const data = await fs.readFile('./data/possessions.json', 'utf-8');
        const possessions = JSON.parse(data);

        const possessionInstances = possessions.map(item => {
            const { possesseur, libelle, valeur, dateDebut, dateFin, tauxAmortissement } = item;
            const dateDebutObj = new Date(dateDebut);
            const dateFinObj = dateFin ? new Date(dateFin) : null;

            if (item.jour !== undefined) {
                // Si "jour" est défini, créer une instance de Flux
                return new Flux(possesseur, libelle, valeur, dateDebutObj, dateFinObj, tauxAmortissement, item.jour);
            } else {
                // Sinon, créer une instance de Possession
                return new Possession(possesseur, libelle, valeur, dateDebutObj, dateFinObj, tauxAmortissement);
            }
        });

        return possessionInstances;

    } catch (error) {
        console.error("Erreur lors du chargement des possessions :", error);
        return [];
    }
}

export default loadPossessions;
