import loadPossessions from './loadPossessions.js';

async function calculatePatrimoine(date) {
    const possessions = await loadPossessions();
    const dateEvaluation = new Date(date);

    const totalValue = possessions.reduce((acc, possession) => {
        return acc + possession.getValeur(dateEvaluation);
    }, 0);

    return totalValue;
}
export default calculatePatrimoine

