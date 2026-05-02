import React, { useState, useEffect } from 'react';
import api from '../services/api';

const statusConfig = {
  pending:     { label: 'Pendente',     color: '#d97706', bg: '#fef3c7' },
  approved:    { label: 'Aprovado',     color: '#16a34a', bg: '#f0fdf4' },
  rejected:    { label: 'Rejeitado',    color: '#dc2626', bg: '#fef2f2' },
  in_progress: { label: 'Em andamento', color: '#2563eb', bg: '#eff6ff' },
  completed:   { label: 'Concluído',    color: '#7c3aed', bg: '#f5f3ff' },
  cancelled:   { label: 'Cancelado',    color: '#6b7280', bg: '#f3f4f6' },
};

export default function RentalRequests() {
  const [tab, setTab] = useState('pending');
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    fetchRentals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const fetchRentals = async () => {
    setLoading(true);
    try {
      const endpoint = tab === 'pending' ? '/rentals/solicitacoes' : '/rentals/historico';
      const res = await api.get(endpoint);
      setRentals(res.data.rentals || []);
    } catch {
      setRentals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setActionLoading(id + '_approve');
    try {
      await api.put(`/rentals/${id}/approve`);
      fetchRentals();
    } catch (err) {
      alert(err.response?.data?.error || 'Erro ao aprovar.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    setActionLoading(rejectModal + '_reject');
    try {
      await api.put(`/rentals/${rejectModal}/reject`, { reason: rejectReason });
      setRejectModal(null);
      setRejectReason('');
      fetchRentals();
    } catch (err) {
      alert(err.response?.data?.error || 'Erro ao rejeitar.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleStart = async (id) => {
    setActionLoading(id + '_start');
    try {
      await api.put(`/rentals/${id}/start`);
      fetchRentals();
    } catch (err) {
      alert(err.response?.data?.error || 'Erro.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleComplete = async (id) => {
    setActionLoading(id + '_complete');
    try {
      await api.put(`/rentals/${id}/complete`);
      fetchRentals();
    } catch (err) {
      alert(err.response?.data?.error || 'Erro.');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>🏠 Painel do Dono</h1>
        <p style={styles.subtitle}>Gerencie as solicitações de aluguel dos seus itens</p>

        {/* Tabs */}
        <div style={styles.tabs}>
          <button
            onClick={() => setTab('pending')}
            style={{ ...styles.tab, ...(tab === 'pending' ? styles.tabActive : {}) }}
          >
            ⏳ Solicitações Pendentes
          </button>
          <button
            onClick={() => setTab('history')}
            style={{ ...styles.tab, ...(tab === 'history' ? styles.tabActive : {}) }}
          >
            📋 Histórico Completo
          </button>
        </div>

        {/* Lista */}
        {loading ? (
          <div style={styles.center}><div style={styles.spinner} /></div>
        ) : rentals.length === 0 ? (
          <div style={styles.empty}>
            <span style={{ fontSize: '48px' }}>{tab === 'pending' ? '✅' : '📭'}</span>
            <p>{tab === 'pending' ? 'Nenhuma solicitação pendente!' : 'Nenhum histórico ainda.'}</p>
          </div>
        ) : (
          <div style={styles.list}>
            {rentals.map(rental => {
              const st = statusConfig[rental.status] || statusConfig.pending;
              return (
                <div key={rental._id} style={styles.card}>
                  {/* Imagem */}
                  <div style={styles.imageBox}>
                    {rental.item?.image
                      ? <img src={rental.item.image} alt={rental.item.name} style={styles.image} />
                      : <div style={styles.imagePlaceholder}>🎁</div>
                    }
                  </div>

                  {/* Info */}
                  <div style={styles.info}>
                    <div style={styles.cardTop}>
                      <div>
                        <h3 style={styles.itemName}>{rental.item?.name || 'Item removido'}</h3>
                        <p style={styles.renterName}>👤 Solicitado por: <strong>{rental.renter?.name}</strong></p>
                      </div>
                      <span style={{ ...styles.badge, color: st.color, backgroundColor: st.bg }}>{st.label}</span>
                    </div>

                    <div style={styles.dates}>
                      <span>📅 {new Date(rental.startDate).toLocaleDateString('pt-BR')} → {new Date(rental.endDate).toLocaleDateString('pt-BR')}</span>
                      <span>⏱ {rental.days} dia(s)</span>
                      <span style={{ fontWeight: '700', color: '#2563eb' }}>R$ {Number(rental.totalPrice).toFixed(2)}</span>
                    </div>

                    {rental.notes && <p style={styles.notes}>💬 "{rental.notes}"</p>}
                    {rental.rejectionReason && <p style={styles.reason}>Motivo: {rental.rejectionReason}</p>}

                    {/* Ações */}
                    <div style={styles.cardActions}>
                      {rental.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(rental._id)}
                            disabled={actionLoading === rental._id + '_approve'}
                            style={styles.approveBtn}
                          >
                            {actionLoading === rental._id + '_approve' ? '...' : '✅ Aprovar'}
                          </button>
                          <button
                            onClick={() => { setRejectModal(rental._id); setRejectReason(''); }}
                            style={styles.rejectBtn}
                          >
                            ❌ Rejeitar
                          </button>
                        </>
                      )}
                      {rental.status === 'approved' && (
                        <button
                          onClick={() => handleStart(rental._id)}
                          disabled={actionLoading === rental._id + '_start'}
                          style={styles.startBtn}
                        >
                          {actionLoading === rental._id + '_start' ? '...' : '▶️ Iniciar'}
                        </button>
                      )}
                      {rental.status === 'in_progress' && (
                        <button
                          onClick={() => handleComplete(rental._id)}
                          disabled={actionLoading === rental._id + '_complete'}
                          style={styles.completeBtn}
                        >
                          {actionLoading === rental._id + '_complete' ? '...' : '🏁 Concluir'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Rejeição */}
      {rejectModal && (
        <div style={styles.overlay} onClick={() => setRejectModal(null)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 16px' }}>❌ Rejeitar Aluguel</h3>
            <label style={styles.label}>Motivo da rejeição (opcional)</label>
            <textarea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="Ex: Item indisponível nessa data..."
              rows={3}
              style={styles.textarea}
            />
            <div style={styles.modalActions}>
              <button onClick={() => setRejectModal(null)} style={styles.cancelBtn}>Cancelar</button>
              <button onClick={handleReject} disabled={!!actionLoading} style={styles.rejectBtn}>
                {actionLoading ? '...' : 'Confirmar Rejeição'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '40px 20px' },
  container: { maxWidth: '800px', margin: '0 auto' },
  title: { fontSize: '28px', fontWeight: 'bold', margin: '0 0 4px' },
  subtitle: { color: '#6b7280', margin: '0 0 24px' },
  tabs: { display: 'flex', gap: '8px', marginBottom: '24px' },
  tab: { padding: '10px 20px', borderRadius: '8px', border: '1px solid #d1d5db', background: 'white', cursor: 'pointer', fontWeight: '600', fontSize: '14px', color: '#6b7280' },
  tabActive: { backgroundColor: '#2563eb', color: 'white', border: '1px solid #2563eb' },
  center: { minHeight: '40vh', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  spinner: { width: '40px', height: '40px', border: '4px solid #e5e7eb', borderTop: '4px solid #2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
  empty: { textAlign: 'center', padding: '60px 20px', color: '#6b7280', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' },
  list: { display: 'flex', flexDirection: 'column', gap: '16px' },
  card: { backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex', gap: '16px', padding: '20px', alignItems: 'flex-start' },
  imageBox: { flexShrink: 0 },
  image: { width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' },
  imagePlaceholder: { width: '80px', height: '80px', borderRadius: '8px', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' },
  info: { flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' },
  itemName: { fontSize: '17px', fontWeight: '700', margin: '0 0 2px' },
  renterName: { fontSize: '13px', color: '#6b7280', margin: 0 },
  badge: { padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', whiteSpace: 'nowrap' },
  dates: { display: 'flex', gap: '16px', fontSize: '14px', color: '#6b7280', flexWrap: 'wrap' },
  notes: { fontSize: '13px', color: '#6b7280', fontStyle: 'italic', margin: 0 },
  reason: { fontSize: '13px', color: '#dc2626', margin: 0 },
  cardActions: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  approveBtn: { padding: '8px 16px', backgroundColor: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' },
  rejectBtn: { padding: '8px 16px', backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' },
  startBtn: { padding: '8px 16px', backgroundColor: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' },
  completeBtn: { padding: '8px 16px', backgroundColor: '#f5f3ff', color: '#7c3aed', border: '1px solid #ddd6fe', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' },
  overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' },
  modal: { backgroundColor: 'white', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '440px', display: 'flex', flexDirection: 'column', gap: '16px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#374151' },
  textarea: { padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '15px', fontFamily: 'inherit', resize: 'vertical', width: '100%', boxSizing: 'border-box' },
  modalActions: { display: 'flex', gap: '12px', justifyContent: 'flex-end' },
  cancelBtn: { padding: '10px 20px', borderRadius: '8px', border: '1px solid #d1d5db', background: 'white', color: '#374151', fontWeight: '600', cursor: 'pointer' },
};
