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
