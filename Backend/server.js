import express from 'express';
const app = express();
const PORT = 3001;
import fs from 'fs/promises';
import cors from 'cors';
app.use(cors()); 
const dataFilePath = './data/possessions.json';
app.use(express.json());

import bodyParser from 'body-parser';

app.use(bodyParser.json());

// Fonction pour lire les données du fichier JSON
export async function readData() {
    try {
        await fs.access(dataFilePath); // Vérifie si le fichier existe
    } catch (err) {
        // Si le fichier n'existe pas, le créer avec un tableau vide
        await writeData([]);
    }

    try {
        const data = await fs.readFile(dataFilePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading data:', err);
        return [];
    }
}

// Fonction pour écrire les données dans le fichier JSON
export async function writeData(data) {
    try {
        await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Error writing data:', err);
    }
}

let possessions = [];

async function initializeData() {
    possessions = await readData();
}

initializeData();

app.get('/api/patrimoine', async (req, res) => {
    const { date } = req.query;

    if (!date) {
        return res.status(400).json({ error: 'La date est requise' });
    }

    try {
        const patrimoineValue = await calculatePatrimoine(date);
        res.json({ date, valeur: patrimoineValue });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors du calcul du patrimoine' });
    }
});

import Possession from '../models/possessions/Possession.js';

app.get('/api/patrimoine/range', async (req, res) => {
    const { startDate, endDate } = req.query;

    const start = new Date(startDate);
    const end = new Date(endDate);

    try {
        // Lire les données et les parser en JSON
        const data = await readData();

        let valeursPatrimoine = [];

        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            const totalValeur = data.reduce((total, possession) => {
                // Convertir les valeurs en nombres
                const valeur = parseFloat(possession.valeur);
                const tauxAmortissement = parseFloat(possession.tauxAmortissement);

                const flux = new Possession(
                    possession.possesseur || '', 
                    possession.libelle || '', 
                    valeur,
                    new Date(possession.dateDebut),
                    possession.dateFin ? new Date(possession.dateFin) : null,
                    tauxAmortissement
                );

                return total + flux.getValeur(new Date(d));
            }, 0);

            valeursPatrimoine.push({
                date: new Date(d).toISOString().split('T')[0], // Formater la date
                valeur: totalValeur
            });
        }

        res.json(valeursPatrimoine);
    } catch (error) {
        console.error('Erreur lors du calcul du patrimoine:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});
*/

const router = express.Router();
import { ajouterPossession, getPossessions, updatePossession, closePossession, deletePossession, getValeurPatrimoine, getValeurPatrimoineRange } from './controllers/possessionsController.js';

// Route pour ajouter une possession
router.post('/', ajouterPossession);

// Route pour obtenir la liste des possessions
router.get('/', getPossessions);

// Route pour mettre à jour une possession par libelle
router.put('/:libelle', updatePossession);

// Route pour clore une possession par libelle
router.patch('/:libelle/close', closePossession);

// Route pour supprimer une possession
router.delete('/:libelle', deletePossession);

// Route pour obtenir la valeur du patrimoine à une date donnée
router.get('/:date', getValeurPatrimoine);

//
router.get('/range', getValeurPatrimoineRange);

export default router;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
