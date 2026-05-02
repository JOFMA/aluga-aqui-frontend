import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import RentalModal from '../components/RentalModal';

const categoryEmoji = {
  'balões': '🎈',
  'painel': '🎨',
  'fitas': '🎀',
  'confete': '✨',
  'vela': '🕯️',
  'enfeite': '🎊',
  'outro': '🎁',
};

const conditionColor = {
  'novo': '#16a34a',
  'como novo': '#2563eb',
  'bom': '#d97706',
  'aceitável': '#dc2626',
};

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRental, setShowRental] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchItem = async () => {
    try {
      const response = await api.get(`/items/${id}`);
      setItem(response.data);
    } catch (err) {
      setError('Item não encontrado.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Tem certeza que deseja deletar este item?')) return;
    try {
      await api.delete(`/items/${id}`);
      navigate('/items');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao deletar item.');
    }
  };

  if (loading) return (
    <div style={styles.center}>
      <div style={styles.spinner} />
      <p style={{ color: '#6b7280', marginTop: '16px' }}>Carregando item...</p>
    </div>
  );

  if (error) return (
    <div style={styles.center}>
      <span style={{ fontSize: '48px' }}>😕</span>
      <p style={{ color: '#dc2626', marginTop: '12px' }}>{error}</p>
      <Link to="/items" style={styles.backBtn}>← Voltar para itens</Link>
    </div>
  );

  const isOwner = user && item.owner && (user.id === item.owner._id || user._id === item.owner._id);

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        <Link to="/items" style={styles.backLink}>← Voltar para itens</Link>

        <div style={styles.card}>
          {/* Imagem */}
          <div style={styles.imageWrapper}>
            {item.image ? (
              <img src={item.image} alt={item.name} style={styles.image} />
            ) : (
              <div style={styles.imagePlaceholder}>
                <span style={{ fontSize: '80px' }}>{categoryEmoji[item.category] || '🎁'}</span>
              </div>
            )}
            <div style={styles.categoryBadge}>
              {categoryEmoji[item.category]} {item.category}
            </div>
          </div>

          {/* Conteúdo */}
          <div style={styles.content}>
            <div style={styles.topRow}>
              <h1 style={styles.name}>{item.name}</h1>
              <span style={{ ...styles.conditionBadge, backgroundColor: conditionColor[item.condition] + '20', color: conditionColor[item.condition] }}>
                {item.condition}
              </span>
            </div>

            <p style={styles.description}>{item.description}</p>

            <div style={styles.priceBox}>
              <span style={styles.price}>R$ {Number(item.pricePerDay).toFixed(2)}</span>
              <span style={styles.perDay}>/dia</span>
            </div>

            <div style={styles.detailsGrid}>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Quantidade</span>
                <span style={styles.detailValue}>{item.quantity} disponível(is)</span>
              </div>
              {item.color && (
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Cor</span>
                  <span style={styles.detailValue}>{item.color}</span>
                </div>
              )}
              {item.size && (
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Tamanho</span>
                  <span style={styles.detailValue}>{item.size}</span>
                </div>
              )}
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Avaliação</span>
                <span style={styles.detailValue}>⭐ {item.rating} ({item.reviews} avaliações)</span>
              </div>
            </div>

            {item.owner && (
              <div style={styles.ownerBox}>
                <span style={styles.ownerAvatar}>{item.owner.name?.[0]?.toUpperCase() || '?'}</span>
                <div>
                  <p style={styles.ownerLabel}>Anunciado por</p>
                  <p style={styles.ownerName}>{item.owner.name}</p>
                  {item.owner.phone && <p style={styles.ownerContact}>📞 {item.owner.phone}</p>}
                </div>
              </div>
            )}

            {/* Ações */}
            <div style={styles.actions}>
              {isOwner ? (
                <>
                  <Link to={`/items/${id}/edit`} style={styles.editBtn}>✏️ Editar item</Link>
                  <button onClick={handleDelete} style={styles.deleteBtn}>🗑️ Deletar</button>
                </>
              ) : (
                <button
                  style={styles.rentBtn}
                  onClick={() => !user ? navigate('/login') : setShowRental(true)}
                >
                  🎁 {user ? 'Alugar este item' : 'Entre para alugar'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Aluguel */}
      {showRental && (
        <RentalModal
          item={item}
          onClose={() => setShowRental(false)}
          onSuccess={() => {
            setShowRental(false);
            alert('✅ Solicitação enviada! Aguarde aprovação do dono.');
          }}
        />
      )}
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '40px 20px' },
  container: { maxWidth: '900px', margin: '0 auto' },
  center: { minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  spinner: { width: '40px', height: '40px', border: '4px solid #e5e7eb', borderTop: '4px solid #2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
  backLink: { display: 'inline-block', marginBottom: '24px', color: '#2563eb', textDecoration: 'none', fontWeight: '600', fontSize: '15px' },
  backBtn: { marginTop: '16px', padding: '10px 20px', backgroundColor: '#2563eb', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: '600' },
  card: { backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.10)', overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 1fr' },
  imageWrapper: { position: 'relative', minHeight: '400px', backgroundColor: '#f9fafb' },
  image: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  imagePlaceholder: { width: '100%', height: '100%', minHeight: '400px', background: 'linear-gradient(135deg, #dbeafe, #ede9fe)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  categoryBadge: { position: 'absolute', top: '16px', left: '16px', backgroundColor: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', textTransform: 'capitalize' },
  content: { padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' },
  topRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' },
  name: { fontSize: '26px', fontWeight: 'bold', color: '#111827', margin: 0, lineHeight: 1.2 },
  conditionBadge: { padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', textTransform: 'capitalize', whiteSpace: 'nowrap' },
  description: { color: '#6b7280', lineHeight: 1.6, margin: 0, fontSize: '15px' },
  priceBox: { display: 'flex', alignItems: 'baseline', gap: '4px', padding: '16px', backgroundColor: '#eff6ff', borderRadius: '12px' },
  price: { fontSize: '32px', fontWeight: 'bold', color: '#2563eb' },
  perDay: { fontSize: '16px', color: '#6b7280' },
  detailsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  detailItem: { backgroundColor: '#f9fafb', padding: '12px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '4px' },
  detailLabel: { fontSize: '12px', color: '#9ca3af', fontWeight: '600', textTransform: 'uppercase' },
  detailValue: { fontSize: '15px', color: '#111827', fontWeight: '600' },
  ownerBox: { display: 'flex', alignItems: 'center', gap: '14px', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '12px' },
  ownerAvatar: { width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#2563eb', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold', flexShrink: 0 },
  ownerLabel: { fontSize: '12px', color: '#9ca3af', margin: 0 },
  ownerName: { fontSize: '15px', fontWeight: '700', color: '#111827', margin: '2px 0' },
  ownerContact: { fontSize: '13px', color: '#6b7280', margin: 0 },
  actions: { display: 'flex', gap: '12px', marginTop: 'auto' },
  rentBtn: { flex: 1, padding: '14px', background: 'linear-gradient(to right, #2563eb, #7c3aed)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '700', cursor: 'pointer' },
  editBtn: { flex: 1, padding: '14px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', textDecoration: 'none', textAlign: 'center' },
  deleteBtn: { padding: '14px 20px', backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: 'pointer' },
};
