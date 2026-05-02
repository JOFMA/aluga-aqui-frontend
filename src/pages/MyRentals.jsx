import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const statusConfig = {
  pending:     { label: 'Pendente',    color: '#d97706', bg: '#fef3c7' },
  approved:    { label: 'Aprovado',    color: '#16a34a', bg: '#f0fdf4' },
  rejected:    { label: 'Rejeitado',   color: '#dc2626', bg: '#fef2f2' },
  in_progress: { label: 'Em andamento',color: '#2563eb', bg: '#eff6ff' },
  completed:   { label: 'Concluído',   color: '#7c3aed', bg: '#f5f3ff' },
  cancelled:   { label: 'Cancelado',   color: '#6b7280', bg: '#f3f4f6' },
};

export default function MyRentals() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = async () => {
    try {
      const res = await api.get('/rentals/meus-alugueis');
      setRentals(res.data.rentals || []);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancelar este aluguel?')) return;
    setCancelling(id);
    try {
      await api.put(`/rentals/${id}/cancel`);
      fetchRentals();
    } catch (err) {
      alert(err.response?.data?.error || 'Erro ao cancelar.');
    } finally {
      setCancelling(null);
    }
  };

  if (loading) return <div style={styles.center}><div style={styles.spinner} /></div>;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>📦 Meus Aluguéis</h1>
        <p style={styles.subtitle}>Aluguéis que você solicitou</p>

        {rentals.length === 0 ? (
          <div style={styles.empty}>
            <span style={{ fontSize: '48px' }}>🎁</span>
            <p>Você ainda não fez nenhum aluguel.</p>
            <Link to="/items" style={styles.linkBtn}>Ver itens disponíveis</Link>
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
                      <h3 style={styles.itemName}>{rental.item?.name || 'Item removido'}</h3>
                      <span style={{ ...styles.badge, color: st.color, backgroundColor: st.bg }}>{st.label}</span>
                    </div>

                    <div style={styles.dates}>
                      <span>📅 {new Date(rental.startDate).toLocaleDateString('pt-BR')} → {new Date(rental.endDate).toLocaleDateString('pt-BR')}</span>
                      <span>⏱ {rental.days} dia(s)</span>
                    </div>

                    <div style={styles.priceRow}>
                      <span style={styles.totalPrice}>Total: R$ {Number(rental.totalPrice).toFixed(2)}</span>
                      {rental.owner && <span style={styles.ownerInfo}>Dono: {rental.owner.name}</span>}
                    </div>

                    {rental.rejectionReason && (
                      <p style={styles.reason}>Motivo: {rental.rejectionReason}</p>
                    )}

                    {rental.notes && (
                      <p style={styles.notes}>💬 {rental.notes}</p>
                    )}
                  </div>

                  {/* Ações */}
                  {['pending', 'approved'].includes(rental.status) && (
                    <div style={styles.cardActions}>
                      <button
                        onClick={() => handleCancel(rental._id)}
                        disabled={cancelling === rental._id}
                        style={styles.cancelBtn}
                      >
                        {cancelling === rental._id ? '...' : 'Cancelar'}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '40px 20px' },
  container: { maxWidth: '800px', margin: '0 auto' },
  title: { fontSize: '28px', fontWeight: 'bold', margin: '0 0 4px' },
  subtitle: { color: '#6b7280', margin: '0 0 32px' },
  center: { minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  spinner: { width: '40px', height: '40px', border: '4px solid #e5e7eb', borderTop: '4px solid #2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
  empty: { textAlign: 'center', padding: '60px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', color: '#6b7280' },
  linkBtn: { padding: '12px 24px', backgroundColor: '#2563eb', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: '600' },
  list: { display: 'flex', flexDirection: 'column', gap: '16px' },
  card: { backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex', gap: '16px', padding: '20px', alignItems: 'flex-start' },
  imageBox: { flexShrink: 0 },
  image: { width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' },
  imagePlaceholder: { width: '80px', height: '80px', borderRadius: '8px', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' },
  info: { flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' },
  itemName: { fontSize: '17px', fontWeight: '700', margin: 0 },
  badge: { padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', whiteSpace: 'nowrap' },
  dates: { display: 'flex', gap: '16px', fontSize: '14px', color: '#6b7280', flexWrap: 'wrap' },
  priceRow: { display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' },
  totalPrice: { fontWeight: '700', color: '#2563eb', fontSize: '16px' },
  ownerInfo: { fontSize: '13px', color: '#6b7280' },
  reason: { fontSize: '13px', color: '#dc2626', margin: 0 },
  notes: { fontSize: '13px', color: '#6b7280', margin: 0 },
  cardActions: { flexShrink: 0 },
  cancelBtn: { padding: '8px 16px', backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' },
};
