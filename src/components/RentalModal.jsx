import React, { useState } from 'react';
import api from '../services/api';

export default function RentalModal({ item, onClose, onSuccess }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const calcDays = () => {
    if (!startDate || !endDate) return 0;
    const diff = new Date(endDate) - new Date(startDate);
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const days = calcDays();
  const total = days > 0 ? (days * item.pricePerDay).toFixed(2) : '0.00';

  const handleSubmit = async () => {
    setError('');
    if (!startDate || !endDate) return setError('Preencha as datas.');
    if (days <= 0) return setError('A data de fim precisa ser após a data de início.');

    setLoading(true);
    try {
      await api.post('/rentals', {
        itemId: item._id,
        startDate,
        endDate,
        notes,
      });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao criar aluguel.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>🎁 Alugar Item</h2>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        {/* Item info */}
        <div style={styles.itemInfo}>
          {item.image && <img src={item.image} alt={item.name} style={styles.itemImage} />}
          <div>
            <p style={styles.itemName}>{item.name}</p>
            <p style={styles.itemPrice}>R$ {Number(item.pricePerDay).toFixed(2)}/dia</p>
          </div>
        </div>

        {/* Datas */}
        <div style={styles.grid2}>
          <div style={styles.field}>
            <label style={styles.label}>Data de início *</label>
            <input
              type="date"
              min={today}
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              style={styles.input}
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Data de fim *</label>
            <input
              type="date"
              min={startDate || today}
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              style={styles.input}
            />
          </div>
        </div>

        {/* Resumo */}
        {days > 0 && (
          <div style={styles.summary}>
            <div style={styles.summaryRow}>
              <span>Duração</span>
              <span><strong>{days} dia(s)</strong></span>
            </div>
            <div style={styles.summaryRow}>
              <span>Preço por dia</span>
              <span>R$ {Number(item.pricePerDay).toFixed(2)}</span>
            </div>
            <div style={{ ...styles.summaryRow, borderTop: '1px solid #e5e7eb', paddingTop: '12px', marginTop: '4px' }}>
              <span style={{ fontWeight: '700' }}>Total estimado</span>
              <span style={{ fontWeight: '700', color: '#2563eb', fontSize: '18px' }}>R$ {total}</span>
            </div>
          </div>
        )}

        {/* Observações */}
        <div style={styles.field}>
          <label style={styles.label}>Observações (opcional)</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Alguma informação adicional para o dono do item..."
            rows={3}
            style={{ ...styles.input, resize: 'vertical' }}
          />
        </div>

        {error && <div style={styles.errorMsg}>⚠️ {error}</div>}

        {/* Ações */}
        <div style={styles.actions}>
          <button onClick={onClose} style={styles.cancelBtn}>Cancelar</button>
          <button onClick={handleSubmit} disabled={loading} style={styles.submitBtn}>
            {loading ? 'Enviando...' : '✅ Confirmar Aluguel'}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed', inset: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000, padding: '20px',
  },
  modal: {
    backgroundColor: 'white', borderRadius: '16px',
    padding: '32px', width: '100%', maxWidth: '500px',
    display: 'flex', flexDirection: 'column', gap: '20px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: '22px', fontWeight: 'bold', margin: 0 },
  closeBtn: { background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6b7280' },
  itemInfo: { display: 'flex', gap: '14px', alignItems: 'center', padding: '14px', backgroundColor: '#f9fafb', borderRadius: '10px' },
  itemImage: { width: '56px', height: '56px', objectFit: 'cover', borderRadius: '8px' },
  itemName: { margin: 0, fontWeight: '700', fontSize: '16px' },
  itemPrice: { margin: '4px 0 0', color: '#2563eb', fontWeight: '600' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#374151' },
  input: { padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '15px', fontFamily: 'inherit', boxSizing: 'border-box', width: '100%' },
  summary: { backgroundColor: '#eff6ff', borderRadius: '10px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', fontSize: '15px' },
  errorMsg: { backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px 16px', borderRadius: '8px', fontSize: '14px' },
  actions: { display: 'flex', gap: '12px', justifyContent: 'flex-end' },
  cancelBtn: { padding: '12px 24px', borderRadius: '8px', border: '1px solid #d1d5db', background: 'white', color: '#374151', fontWeight: '600', cursor: 'pointer', fontSize: '15px' },
  submitBtn: { padding: '12px 24px', borderRadius: '8px', border: 'none', background: 'linear-gradient(to right, #2563eb, #7c3aed)', color: 'white', fontWeight: '700', cursor: 'pointer', fontSize: '15px' },
};