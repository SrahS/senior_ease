import { useState } from 'react';
import { usePreferences } from '../contexts/PreferencesContext';

interface CreateTaskProps {
  onBack: () => void;
  onSave: (title: string, detail: string) => void;
}

export function CreateTaskScreen({ onBack, onSave }: CreateTaskProps) {
  const { preferences } = usePreferences();
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');

  const handleSave = () => {
    if (!title.trim()) return; 
    onSave(title, detail);
    onBack();
  };

  return (
    <section className="panel" aria-labelledby="create-task-title">
      <div className="panel-heading" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button 
          onClick={onBack} 
          className="secondary-btn" 
          style={{ padding: '0.5rem 1rem', borderRadius: '999px', border: 'none', backgroundColor: '#f1f5f9' }}
          aria-label="Voltar"
        >
          ← Voltar
        </button>
        <h2 id="create-task-title" style={{ margin: 0 }}>Nova Tarefa</h2>
      </div>

      {!preferences.simplifiedMode && (
        <p style={{ marginBottom: '1.5rem', color: '#475569' }}>
          Adicione um título e detalhes opcionais para não esquecer o que precisa ser feito.
        </p>
      )}

      <div className="control-group">
        <label htmlFor="task-title" style={{ fontWeight: 'bold' }}>O que você precisa fazer?</label>
        <input 
          id="task-title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          className="text-input" 
          placeholder="Ex: Comprar remédio..."
          style={{ width: '100%', boxSizing: 'border-box' }}
        />
      </div>

      <div className="control-group">
        <label htmlFor="task-detail" style={{ fontWeight: 'bold' }}>Detalhes (opcional)</label>
        <textarea 
          id="task-detail" 
          value={detail} 
          onChange={(e) => setDetail(e.target.value)} 
          className="text-input" 
          placeholder="Ex: Lembrar de levar a receita médica."
          rows={4}
          style={{ width: '100%', boxSizing: 'border-box', resize: 'vertical' }}
        />
      </div>

      <button 
        className="primary-btn" 
        onClick={handleSave}
        disabled={!title.trim()}
        style={{ width: '100%', marginTop: '1rem', opacity: !title.trim() ? 0.6 : 1 }}
      >
        Salvar Tarefa
      </button>
    </section>
  );
}