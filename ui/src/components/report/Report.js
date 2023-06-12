import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import api from '../../api/api';

const PresentationPage = () => {
  const [presentations, setPresentations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPresentations = async () => {
      setLoading(true);

      try {
        const response = await api.get('/api/presentations');
        console.log(response.data.data);
        setPresentations(response.data.data);
        setError(null);
      } catch (error) {
        setError('An error occurred while fetching the presentations.');
      }

      setLoading(false);
    };

    fetchPresentations();
  }, []);

  return (
    <div>
      <h1>Presentation Page</h1>
      {loading && <p>Loading presentations...</p>}
      {error && <p>{error}</p>}
      {presentations.length > 0 && (
        <ul>
          {presentations.map((presentation) => (
            <li key={presentation.id}>
              {presentation.title}
              <Link to={`/presentationreport/${presentation._id}`}>Show Report</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PresentationPage;
