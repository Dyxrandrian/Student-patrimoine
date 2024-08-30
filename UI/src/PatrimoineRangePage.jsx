import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto'; // Import nécessaire pour Chart.js 3.x

const PatrimoineRangePage = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [jour, setJour] = useState(1);
  const [chartData, setChartData] = useState(null);

  const fetchData = async () => {
    const response = await fetch(`http://localhost:3001/api/patrimoine/range?startDate=${startDate.toString()}&endDate=${endDate.toString()}&jour=${1}`);
    const data = await response.json();
    const dates = data.map(entry => new Date(entry.date).toLocaleDateString());
    const valeurs = data.map(entry => entry.valeur);

    setChartData({
      labels: dates,
      datasets: [
        {
          label: 'Valeur du Patrimoine',
          data: valeurs,
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          fill: false,
        },
      ],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  const styleDivPage = { backgroundColor: 'gray', padding: '40px', borderRadius: '20px 20px 20px 20px', boxShadow: "15px -22px 5px #5d5d5d4d"}

  return (
    <div style={styleDivPage}>
      <h2>Valeur du Patrimoine par Plage de Dates</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="startDate">
          <Form.Label>Date de début</Form.Label>
          <Form.Control
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="endDate">
          <Form.Label>Date de fin</Form.Label>
          <Form.Control
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="jour">
          <Form.Label>Jour</Form.Label>
          <Form.Control
            type="number"
            value={jour}
            onChange={(e) => setJour(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-3">
          Obtenir Valeur
        </Button>
      </Form>

      {chartData && (
        <div className="mt-4">
          <Line data={chartData} />
        </div>
      )}
    </div>
  );
};

export default PatrimoineRangePage;
