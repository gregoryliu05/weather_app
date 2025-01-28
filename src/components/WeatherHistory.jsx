import React, { useState, useEffect } from 'react';
import dbService from '../services/dbService';

function WeatherHistory() {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    location: '',
    start_date: '',
    end_date: ''
  });

  const loadHistory = async () => {
    try {
      const response = await dbService.getAllWeatherRequests();
      setHistory(response.data);
    } catch (err) {
      setError('Failed to load weather history');
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      loadHistory();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (id) => {
    try {
      await dbService.deleteWeatherRequest(id);
      loadHistory();
    } catch (err) {
      setError('Failed to delete record');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const handleEdit = (record) => {
    setEditingId(record.id);
    setEditForm({
      location: record.location,
      start_date: formatDate(record.start_date),
      end_date: formatDate(record.end_date)
    });
  };

  const handleUpdate = async () => {
    try {
      await dbService.updateWeatherRequest(editingId, editForm);
      setEditingId(null);
      loadHistory();
    } catch (err) {
      setError('Failed to update record');
    }
  };

  return (
    <div className="weather-history">
      <h2>Weather Search History</h2>
      {error && <div className="error">{error}</div>}
      
      <button onClick={loadHistory}>Refresh History</button>
      
      {history.length === 0 ? (
        <p>No weather requests found</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Location</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {history.map((record) => (
              <tr key={record.id}>
                {editingId === record.id ? (
                  <>
                    <td>
                      <input
                        value={editForm.location}
                        onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        value={formatDate(editForm.start_date)}
                        onChange={(e) => setEditForm({...editForm, start_date: e.target.value})}
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        value={formatDate(editForm.end_date)}
                        onChange={(e) => setEditForm({...editForm, end_date: e.target.value})}
                      />
                    </td>
                    <td>
                      <button onClick={handleUpdate}>Save</button>
                      <button onClick={() => setEditingId(null)}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{record.location}</td>
                    <td>{formatDate(record.start_date)}</td>
                    <td>{formatDate(record.end_date)}</td>
                    <td>
                      <button onClick={() => handleEdit(record)}>Edit</button>
                      <button onClick={() => handleDelete(record.id)}>Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default WeatherHistory; 