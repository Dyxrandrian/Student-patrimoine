import React, { useState } from 'react';
const apiUrl = "https://student-patrimoine.onrender.com";
const CreatePossessionPage = () => {
  const [libelle, setLibelle] = useState('');
  const [valeur, setValeur] = useState('');
  const [dateDebut, setDateDebut] = useState('');
  const [tauxAmortissement, setTaux] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(`${apiUrl}/api/possession`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          libelle,
          valeur,
          dateDebut,
          tauxAmortissement,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setSuccessMessage('Possession créée avec succès!');
      // Reset form fields or redirect as needed
      setLibelle('');
      setValeur('');
      setDateDebut('');
      setTaux('');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const styleDivPage = { backgroundColor: 'gray', padding: '40px', borderRadius: '20px 20px 20px 20px', boxShadow: "15px -22px 5px #5d5d5d4d"}

  return (
    <div style={styleDivPage} className='d-flex items-center justify-content-center flex-column'>
      <h1 className='d-flex align-items-center justify-content-center'>Créer une possession</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="bg-secondary d-flex flex-column items-center justify-content-center rounded mx-5"
      >
        <div className="form-group d-flex justify-content-evenly mb-2 mt-5">
          <label htmlFor="libelle text-xl-left" className='text-info'>Libelle:</label>
          <input
            className='px-4 bg-secondary'
            type="text"
            id="libelle"
            value={libelle}
            onChange={(e) => setLibelle(e.target.value)}
            required
          />
        </div>
        <div className="form-group d-flex justify-content-evenly mb-2">
          <label htmlFor="valeur" className='text-info'>Valeur:</label>
          <input
            className='px-4 bg-secondary'
            type="number"
            id="valeur"
            value={valeur}
            onChange={(e) => setValeur(e.target.value)}
            required
          />
        </div>
        <div className="form-group d-flex justify-content-evenly mb-2">
          <label htmlFor="dateDebut" className='text-info'>Date Début:</label>
          <input
            className='px-4 bg-secondary'
            type="date"
            id="dateDebut"
            value={dateDebut}
            onChange={(e) => setDateDebut(e.target.value)}
            required
          />
        </div>
        <div className="form-group d-flex justify-content-evenly mb-2">
          <label htmlFor="taux" className='text-info'>Taux:</label>
          <input
            className='px-4 bg-secondary'
            type="number"
            id="taux"
            value={tauxAmortissement}
            onChange={(e) => setTaux(e.target.value)}
            required
          />
        </div>
        <div className='d-flex items-center justify-content-center mt-3 mb-3'>
        <button type="submit" className='btn btn-success px-5' disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </div>
      </form>
      {successMessage && <p className='text-light mt-3 text-weight-bold'>{successMessage}</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default CreatePossessionPage;
