import { useState } from 'react';
import { usePreferences } from '../contexts/PreferencesContext';

interface CreateTaskProps {
  onBack: () => void;
  onSave: (title: string, detail: string, important: boolean) => Promise<unknown>;
}

export function CreateTaskScreen({ onBack, onSave }: CreateTaskProps) {
  const { preferences } = usePreferences();
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [important, setImportant] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSave = async () => {
    const normalizedTitle = title.trim();
    if (!normalizedTitle) {
      setSaveError('Informe o que você precisa fazer.');
      return;
    }

    if (isSaving) return;

    setIsSaving(true);
    setSaveError(null);
    try {
      await onSave(normalizedTitle, detail, important);
      setTitle('');
      setDetail('');
      setImportant(false);
      onBack();
    } catch {
      setSaveError('Não foi possível salvar a tarefa. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="panel" aria-labelledby="create-task-title">
      <div className="panel-heading" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button 
          onClick={onBack} 
          className="secondary-btn" 
          disabled={isSaving}
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
          onChange={(e) => {
            setTitle(e.target.value);
            if (saveError) setSaveError(null);
          }}
          className="text-input" 
          disabled={isSaving}
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
          disabled={isSaving}
          placeholder="Ex: Lembrar de levar a receita médica."
          rows={4}
          style={{ width: '100%', boxSizing: 'border-box', resize: 'vertical' }}
        />
      </div>

      <div className="importance-row">
        <div>
          <strong>Tarefa importante</strong>
          <p id="task-important-description">Peça confirmação antes de concluir.</p>
        </div>
        <label className="switch-toggle">
          <input
            type="checkbox"
            checked={important}
            disabled={isSaving}
            onChange={(event) => setImportant(event.target.checked)}
            aria-label="Marcar como tarefa importante"
            aria-describedby="task-important-description"
          />
          <span className="switch-slider" />
        </label>
      </div>

      <button 
        className="primary-btn" 
        onClick={handleSave}
        disabled={isSaving}
        aria-busy={isSaving}
        style={{ width: '100%', marginTop: '1rem', opacity: isSaving ? 0.6 : 1 }}
      >
        {isSaving ? 'Salvando...' : 'Salvar Tarefa'}
      </button>
      {saveError && <p className="task-error" role="alert">{saveError}</p>}
    </section>
  );
}