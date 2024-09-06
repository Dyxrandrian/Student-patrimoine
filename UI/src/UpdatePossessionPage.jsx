import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const apiUrl = "https://student-patrimoine.onrender.com";

const UpdatePossessionPage = () => {
  const { libelle } = useParams();
  const navigate = useNavigate();
  const [currentPossession, setCurrentPossession] = useState(null);
  const [newLibelle, setNewLibelle] = useState('');
  const [valeur, setValeur] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPossession = async () => {
      try {
        console.log('Fetching possession for libelle:', libelle);
        const response = await fetch(`${apiUrl}/api/possession/${libelle}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Fetched possession data:', data);
        setCurrentPossession(data);
        setNewLibelle(data.libelle); // Initialisation du nouveau libelle
        setValeur(data.valeur);
        setDateFin(data.dateFin || '');
      } catch (error) {
        setError(error.message);
        console.error('Erreur lors de la récupération des données:', error);
      }
    };
    fetchPossession();
  }, [libelle]);

  const handleUpdate = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const formattedDateFin = dateFin ? new Date(dateFin).toISOString() : null; // Formatage de la date

      const response = await fetch(`${apiUrl}/api/possession/${libelle}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newLibelle,  // On envoie le nouveau libelle
          dateFin: formattedDateFin,  // Date de fin
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Network response was not ok: ${errorData.message || 'Unknown error'}`);
      }

      const data = await response.json();
      setSuccessMessage('Possession mise à jour avec succès!');
      navigate('/possession'); // Rediriger vers la liste des possessions
    } catch (error) {
      setError(error.message);
      console.error('Erreur dans handleUpdate:', error);
    } finally {
      setLoading(false);
    }
  };

  const styleDivPage = { backgroundColor: 'gray', padding: '40px', borderRadius: '20px', boxShadow: "15px -22px 5px #5d5d5d4d" }

  return (
    <div style={styleDivPage}>
      <h1 className='d-flex align-items-center justify-content-center'>Update Possession</h1>
      {currentPossession ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdate();
          }}
          className="bg-secondary d-flex flex-column items-center justify-content-center rounded mx-5"
        >
          <div className="form-group d-flex justify-content-evenly mb-2 mt-2">
            <label htmlFor="newLibelle" className='text-info'>Libelle :</label>
            <input
              type="text"
              id="newLibelle"
              value={newLibelle}
              onChange={(e) => setNewLibelle(e.target.value)}
              required
              className='px-4 bg-secondary'
            />
          </div>
          <div className="form-group d-flex justify-content-evenly mb-2 mt-2">
            <label htmlFor="dateFin" className='text-info'>Date Fin :</label>
            <input
              type="date"
              id="dateFin"
              value={dateFin}
              onChange={(e) => setDateFin(e.target.value)}
              className='px-4 bg-secondary'
            />
          </div>
          <div className='d-flex items-center justify-content-center mt-3 mb-3'>
            <button type="submit" className='btn btn-success px-5' disabled={loading}>
              {loading ? 'Updating...' : 'Update'}
            </button>
          </div>
        </form>
      ) : (
        <p>Loading...</p>
      )}

      {successMessage && <p>{successMessage}</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default UpdatePossessionPage;
