import React, { useState } from 'react';
const apiUrl = process.env.REACT_APP_BACKEND_URL;

const PatrimoinePage = () => {
  const [date, setDate] = useState('');
  const [patrimoine, setPatrimoine] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCalculate = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiUrl}/api/patrimoine?date=${date}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setPatrimoine(data.valeur);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const styleDivPage = { backgroundColor: 'gray', padding: '40px', borderRadius: '20px 20px 20px 20px', boxShadow: "15px -22px 5px #5d5d5d4d"}
  const styleDivDate = {display : 'flex' , justifyContent: 'space-evenly'}

  return (
    <div style={styleDivPage}>
      <h1 className='d-flex align-items-center justify-content-center'>Calculer Patrimoine</h1>
      <div style={styleDivDate} className='mt-5'>
        <div className="form-group d-flex align-items-center">
          <label htmlFor="date" className='mx-2 text-grey'>Selectionne une date:</label>
          <input
            className='p-2 px-4'
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <button className="btn btn-success" onClick={handleCalculate} disabled={loading}>
          {loading ? 'Calculating...' : 'Calculate'}
        </button>
      </div>

      {patrimoine !== null && 
      <h3 className='mt-5'>Valeur du patrimoine au {date} : <strong className='text-light'>{patrimoine.toFixed(2)}</strong></h3>
      }
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default PatrimoinePage;
