import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/soundEffects';
import { 
  Newspaper, 
  ThumbsUp, 
  Eye, 
  PenTool, 
  Send, 
  BookOpen, 
  Sparkles,
  Flame
} from 'lucide-react';

export default function NewspaperView() {
  const { 
    articles, 
    publishArticle, 
    upvoteArticle, 
    player 
  } = useGame();

  const [showWriteModal, setShowWriteModal] = useState(false);
  const [headline, setHeadline] = useState('');
  const [category, setCategory] = useState('Opini Politik');
  const [content, setContent] = useState('');

  const handlePublish = (e) => {
    e.preventDefault();
    if (!headline || !content) return;
    publishArticle(headline, content, category);
    setHeadline('');
    setContent('');
    setShowWriteModal(false);
  };

  return (
    <div className="newspaper-view-container">
      {/* Header Banner */}
      <div className="newspaper-hero glass-panel">
        <div className="hero-left">
          <div className="hero-badge">
            <Newspaper size={18} /> PERS & MEDIA MASSA NASIONAL
          </div>
          <h2 className="hero-title">Koran & Opini Publik Nusantara</h2>
          <p className="hero-desc">
            Pilar keempat demokrasi. Tuliskan gagasan, investigasi kebijakan, atau kritik terhadap 
            jalannya parlemen untuk membentuk opini publik di 38 provinsi.
          </p>
        </div>

        <button 
          className="btn-gold" 
          onClick={() => { setShowWriteModal(true); sounds.playClick(); }}
        >
          <PenTool size={16} /> Tulis Artikel / Opini Pers
        </button>
      </div>

      {/* Articles Stream */}
      <div className="articles-stream">
        {articles.map((art) => (
          <article key={art.id} className="article-card glass-panel">
            <div className="article-header">
              <div className="article-tags">
                <span className="badge badge-gold">{art.category}</span>
                <span className="badge badge-cyan">{art.partyTag}</span>
              </div>
              <span className="article-time">{art.timeAgo}</span>
            </div>

            <h3 className="article-headline">{art.headline}</h3>

            <div className="article-author-row">
              <span className="author-label">Penulis:</span>
              <strong className="author-name">{art.author}</strong>
            </div>

            <p className="article-body-text">{art.content}</p>

            <div className="article-footer">
              <div className="article-stats">
                <span className="stat-reads"><Eye size={14} /> {art.reads.toLocaleString('id-ID')} Pembaca</span>
                <span className="stat-likes"><Flame size={14} color="#f59e0b" /> {art.upvotes} Dukungan</span>
              </div>

              <button
                className="btn-secondary upvote-btn"
                onClick={() => upvoteArticle(art.id)}
              >
                <ThumbsUp size={15} /> Dukung Gagasan Ini ({art.upvotes})
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Modal: Write Article */}
      {showWriteModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel-gold">
            <div className="modal-header">
              <h3><PenTool size={18} /> Redaksi Penulisan Opini Publik</h3>
              <button className="modal-close-btn" onClick={() => setShowWriteModal(false)}>✕</button>
            </div>

            <form onSubmit={handlePublish} className="modal-form">
              <div className="form-group">
                <label>Judul Berita / Tajuk Rencana:</label>
                <input
                  type="text"
                  placeholder="Contoh: Mengapa Kedaulatan Nikel Harus Menguntungkan Masyarakat Adat"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Rubrik / Kategori:</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="form-select"
                >
                  <option value="Opini Politik">Opini & Debat Kebijakan</option>
                  <option value="Ekonomi & Bisnis">Ekonomi, Fiskal & Tambang</option>
                  <option value="Parlemen & Hukum">Parlemen Senayan & RUU</option>
                  <option value="Investigasi & Transparansi">Investigasi & Transparansi Anggaran</option>
                </select>
              </div>

              <div className="form-group">
                <label>Isi Tulisan / Analisis:</label>
                <textarea
                  rows={6}
                  placeholder="Tuliskan argumen tajam Anda yang persuasif dan berbobot..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  className="form-textarea"
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowWriteModal(false)}>
                  Batal
                </button>
                <button type="submit" className="btn-gold">
                  <Send size={15} /> Terbitkan ke Surat Kabar Nasional (+75 EXP)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
