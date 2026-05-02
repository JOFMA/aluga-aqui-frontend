import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const CLOUDINARY_CLOUD_NAME = 'dknimndb5';
const CLOUDINARY_UPLOAD_PRESET = 'aluga-aqui';

export default function CreateItem() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    pricePerDay: '',
    quantity: '',
    color: '',
    size: '',
    condition: 'bom',
    image: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview local
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);

    // Upload para Cloudinary
    setUploadingImage(true);
    try {
      const data = new FormData();
      data.append('file', file);
      data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: data }
      );
      const result = await response.json();

      if (result.secure_url) {
        setForm((prev) => ({ ...prev, image: result.secure_url }));
      } else {
        setError('Erro ao fazer upload da imagem.');
      }
    } catch (err) {
      setError('Erro ao fazer upload da imagem.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await api.post('/items', {
        ...form,
        pricePerDay: Number(form.pricePerDay),
        quantity: Number(form.quantity),
      });
      setSuccess('Item criado com sucesso!');
      setTimeout(() => navigate('/items'), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao criar item.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>🎁 Novo Item</h1>
          <p style={styles.subtitle}>Preencha os dados do item para alugar</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Upload de Imagem */}
          <div style={styles.imageSection}>
            <label style={styles.imageLabel} htmlFor="image-upload">
              {uploadingImage ? (
                <div style={styles.uploadingBox}>
                  <div style={styles.spinner} />
                  <span>Enviando imagem...</span>
                </div>
              ) : imagePreview ? (
                <img src={imagePreview} alt="Preview" style={styles.imagePreview} />
              ) : (
                <div style={styles.uploadPlaceholder}>
                  <span style={{ fontSize: '48px' }}>📷</span>
                  <span style={{ color: '#6b7280', marginTop: '8px' }}>Clique para adicionar foto</span>
                  <span style={{ color: '#9ca3af', fontSize: '13px' }}>JPG, PNG até 10MB</span>
                </div>
              )}
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
            {imagePreview && (
              <button
                type="button"
                onClick={() => { setImagePreview(null); setForm(f => ({ ...f, image: '' })); }}
                style={styles.removeImageBtn}
              >
                Remover imagem
              </button>
            )}
          </div>

          {/* Campos */}
          <div style={styles.grid2}>
            <div style={styles.field}>
              <label style={styles.label}>Nome do item *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Ex: Balão dourado"
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Categoria *</label>
              <select name="category" value={form.category} onChange={handleChange} required style={styles.input}>
                <option value="">Selecione...</option>
                <option value="balões">🎈 Balões</option>
                <option value="fitas">🎀 Fitas</option>
                <option value="painel">🎨 Painel</option>
                <option value="confete">✨ Confete</option>
                <option value="vela">🕯️ Vela</option>
                <option value="enfeite">🎊 Enfeite</option>
                <option value="outro">📦 Outro</option>
              </select>
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Descrição *</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              placeholder="Descreva o item com detalhes..."
              rows={3}
              style={{ ...styles.input, resize: 'vertical' }}
            />
          </div>

          <div style={styles.grid2}>
            <div style={styles.field}>
              <label style={styles.label}>Preço por dia (R$) *</label>
              <input
                name="pricePerDay"
                type="number"
                min="0"
                step="0.01"
                value={form.pricePerDay}
                onChange={handleChange}
                required
                placeholder="0,00"
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Quantidade disponível *</label>
              <input
                name="quantity"
                type="number"
                min="0"
                value={form.quantity}
                onChange={handleChange}
                required
                placeholder="1"
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.grid3}>
            <div style={styles.field}>
              <label style={styles.label}>Cor</label>
              <input
                name="color"
                value={form.color}
                onChange={handleChange}
                placeholder="Ex: Dourado"
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Tamanho</label>
              <select name="size" value={form.size} onChange={handleChange} style={styles.input}>
                <option value="">Selecione...</option>
                <option value="P">P</option>
                <option value="M">M</option>
                <option value="G">G</option>
              </select>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Condição</label>
              <select name="condition" value={form.condition} onChange={handleChange} style={styles.input}>
                <option value="novo">Novo</option>
                <option value="como novo">Como novo</option>
                <option value="bom">Bom</option>
                <option value="aceitável">Aceitável</option>
              </select>
            </div>
          </div>

          {/* Mensagens */}
          {error && <div style={styles.errorMsg}>⚠️ {error}</div>}
          {success && <div style={styles.successMsg}>✅ {success}</div>}

          {/* Botões */}
          <div style={styles.actions}>
            <button type="button" onClick={() => navigate('/items')} style={styles.cancelBtn}>
              Cancelar
            </button>
            <button type="submit" disabled={loading || uploadingImage} style={styles.submitBtn}>
              {loading ? 'Criando...' : '+ Criar Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f3f4f6',
    padding: '40px 20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
    width: '100%',
    maxWidth: '700px',
    overflow: 'hidden',
  },
  header: {
    background: 'linear-gradient(to right, #2563eb, #7c3aed)',
    padding: '32px',
    color: 'white',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    margin: 0,
  },
  subtitle: {
    margin: '6px 0 0',
    opacity: 0.85,
    fontSize: '15px',
  },
  form: {
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  imageSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
  },
  imageLabel: {
    width: '100%',
    height: '180px',
    border: '2px dashed #d1d5db',
    borderRadius: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    transition: 'border-color 0.2s',
  },
  uploadPlaceholder: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  },
  uploadingBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    color: '#6b7280',
  },
  spinner: {
    width: '32px',
    height: '32px',
    border: '3px solid #e5e7eb',
    borderTop: '3px solid #2563eb',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  imagePreview: {
    width: '100%',
    height: '180px',
    objectFit: 'cover',
  },
  removeImageBtn: {
    background: 'none',
    border: 'none',
    color: '#ef4444',
    cursor: 'pointer',
    fontSize: '13px',
    textDecoration: 'underline',
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  grid3: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '16px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
  },
  input: {
    padding: '10px 14px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '15px',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  errorMsg: {
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#dc2626',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '14px',
  },
  successMsg: {
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0',
    color: '#16a34a',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '14px',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '8px',
  },
  cancelBtn: {
    padding: '12px 24px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    background: 'white',
    color: '#374151',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '15px',
  },
  submitBtn: {
    padding: '12px 28px',
    borderRadius: '8px',
    border: 'none',
    background: 'linear-gradient(to right, #2563eb, #7c3aed)',
    color: 'white',
    fontWeight: '700',
    cursor: 'pointer',
    fontSize: '15px',
  },
};