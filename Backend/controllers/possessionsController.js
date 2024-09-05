import { readFile, writeFile } from '../data/index.js';

// Ajouter une possession
export async function ajouterPossession(req, res) {
    try {
        const { libelle, valeur, dateDebut, tauxAmortissement } = req.body;

        // Lire les données existantes
        const { data: existingData, status: readStatus } = await readFile('./data/possessions.json');
        if (readStatus === 'ERROR') throw new Error('Erreur de lecture du fichier');

        // Ajouter la nouvelle possession
        const newPossession = {
            libelle,
            valeur,
            dateDebut,
            tauxAmortissement,
        };
        existingData.push(newPossession);

        // Écrire les données mises à jour dans le fichier
        const { status: writeStatus } = await writeFile('./data/possessions.json', existingData);
        if (writeStatus === 'ERROR') throw new Error('Erreur d\'écriture du fichier');

        // Répondre avec la nouvelle possession créée
        res.status(201).json(newPossession);
    } catch (error) {
        console.error('Erreur dans ajouterPossession:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
}

// Obtenir la liste des possessions
export async function getPossessions(req, res) {
    try {
        const { status, data } = await readFile('./data/possessions.json');
        if (status === 'ERROR') {
            return res.status(500).json({ error: 'Erreur de lecture du fichier' });
        }
        res.status(200).json(data);
    } catch (error) {
        console.error('Erreur lors de la récupération des possessions:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
}

// Mettre à jour une possession par libelle
export async function updatePossession(req, res) {
    const { libelle } = req.params;
    const { valeur, dateFin } = req.body;

    try {
        // Lire les données existantes
        const { data: existingData, status: readStatus } = await readFile('./data/possessions.json');
        if (readStatus === 'ERROR') throw new Error('Erreur de lecture du fichier');

        // Trouver et mettre à jour la possession correspondante
        let updated = false;
        const updatedData = existingData.map(possession => {
            if (possession.libelle === libelle) {
                updated = true;
                return { ...possession, valeur, dateFin }; // Mise à jour des champs
            }
            return possession;
        });

        if (!updated) {
            return res.status(404).json({ error: 'Possession non trouvée' });
        }

        // Écrire les données mises à jour dans le fichier
        const { status: writeStatus } = await writeFile('./data/possessions.json', updatedData);
        if (writeStatus === 'ERROR') throw new Error('Erreur d\'écriture du fichier');

        res.status(200).json({ message: 'Possession mise à jour avec succès' });
    } catch (error) {
        console.error('Erreur dans updatePossession:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
}

// Clore une possession par libelle
export async function closePossession(req, res) {
    const { libelle } = req.params;
    console.log('Received libelle:', libelle);

    try {
        const { status, data } = await readFile('./data/possessions.json');
        if (status === 'ERROR') {
            return res.status(500).json({ error: 'Erreur de lecture du fichier' });
        }

        console.log('Data from file:', data);
        const possession = data.find(p => p.libelle === libelle);
        if (!possession) {
            return res.status(404).json({ error: 'Possession non trouvée' });
        }

        possession.dateFin = new Date().toISOString();

        await writeFile('./data/possessions.json', data);
        res.status(200).json({ success: true, data: possession });
    } catch (error) {
        console.error('Erreur lors de la clôture de la possession:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
}

export async function deletePossession(req, res) {
    const { libelle } = req.params;

    try {
        // Lire les données existantes
        const { status, data } = await readFile('./data/possessions.json');
        if (status === 'ERROR') {
            return res.status(500).json({ error: 'Erreur de lecture du fichier' });
        }

        // Trouver l'index de la possession à supprimer
        const index = data.findIndex(p => p.libelle === libelle);
        if (index === -1) {
            return res.status(404).json({ error: 'Possession non trouvée' });
        }

        // Supprimer la possession
        data.splice(index, 1);

        // Écrire les données mises à jour
        await writeFile('./data/possessions.json', data);
        res.status(200).json({ success: true, message: 'Possession supprimée' });
    } catch (error) {
        console.error('Erreur lors de la suppression de la possession:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
}
import Flux from "../../models/possessions/Flux.js"
export const getValeurPatrimoine = async (req, res) => {
    const { date } = req.params;
    const dateObjet = new Date(date);

    try {
        // Lire le fichier des possessions
        const { status, data } = await readFile('./data/possessions.json');
        if (status === 'ERROR') {
            console.error('Erreur de lecture du fichier');
            return res.status(500).json({ error: 'Erreur de lecture du fichier' });
        }

        let patrimoineTotal = 0;

        // Calculer la valeur totale du patrimoine
        data.forEach(possession => {
            const instancePossession = new Flux(
                possession.possesseur,
                possession.libelle,
                parseFloat(possession.valeur), // Conversion en nombre
                new Date(possession.dateDebut),
                possession.dateFin ? new Date(possession.dateFin) : null,
                parseFloat(possession.tauxAmortissement), // Conversion en nombre
                possession.jour // Si applicable
            );

            patrimoineTotal += instancePossession.getValeur(dateObjet);
        });

        // Envoyer la réponse avec la valeur calculée
        res.status(200).json({ date: dateObjet.toString(), patrimoine: patrimoineTotal });
    } catch (error) {
        console.error('Erreur lors du calcul du patrimoine:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};
import Possession from '../../models/possessions/Possession.js';

export const getValeurPatrimoineRange = async (req, res) => {
    const { dateDebut, dateFin, jour, type } = req.body;
    const debut = new Date(dateDebut);
    const fin = new Date(dateFin);

    try {
        const { status, data } = await readFile('./data/possessions.json');
        if (status === 'ERROR') {
            return res.status(500).json({ error: 'Erreur de lecture du fichier' });
        }

        let results = [];
        let currentDate = new Date(debut);

        while (currentDate <= fin) {
            let patrimoineTotal = 0;
            data.forEach(possession => {
                const instancePossession = new Flux(
                    possession.possesseur,
                    possession.libelle,
                    possession.valeur,
                    new Date(possession.dateDebut),
                    possession.dateFin ? new Date(possession.dateFin) : null,
                    possession.tauxAmortissement,
                    possession.jour,
                    possession.valeurConstante
                );
                patrimoineTotal += instancePossession.getValeur(currentDate);
            });

            results.push({ date: new Date(currentDate), patrimoine: patrimoineTotal });

            if (type === 'month') {
                currentDate.setMonth(currentDate.getMonth() + 1);
            } else {
                currentDate.setDate(currentDate.getDate() + 1);
            }
        }

        res.status(200).json(results);
    } catch (error) {
        console.error('Erreur lors du calcul du patrimoine:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};

