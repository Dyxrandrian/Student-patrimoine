import express from 'express';
const router = express.Router();
import { ajouterPossession, getPossessions, updatePossession, closePossession, deletePossession, getValeurPatrimoine, getValeurPatrimoineRange } from '../controllers/possessionsController.js';

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
