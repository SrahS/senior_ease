import { useState } from 'react';
import { usePreferences } from '../contexts/PreferencesContext';
import { AnnounceActionUseCase } from '../../../shared/domain/useCases/announceActionUseCase';

const announceActionUseCase = new AnnounceActionUseCase();

export function ProfileScreen() {
  const { preferences, updatePreference } = usePreferences();
  const [savedMessage, setSavedMessage] = useState('');

  const isFeedback = preferences.visualFeedback;
  const isAltoContraste = preferences.contrast === 'alto';

  const handleProfileSave = () => {
    setSavedMessage(announceActionUseCase.execute('Perfil atualizado com sucesso!'));
    setTimeout(() => setSavedMessage(''), 3000);
  };

  return (
    <section className="panel" aria-labelledby="profile-title">
      <div className="panel-heading">
        <h2 id="profile-title">Perfil do usuário</h2>
        {!preferences.simplifiedMode && <p>Configure o nome, a função e o modo de navegação com linguagem simples.</p>}
      </div>

      <div className="control-group">
        <label htmlFor="user-name" style={{ fontWeight: isAltoContraste ? '900' : '600' }}>Nome</label>
        <input id="user-name" value={preferences.userName} onChange={(e) => updatePreference('userName', e.target.value)} className="text-input" />
      </div>

      <div className="control-group">
        <label htmlFor="user-role" style={{ fontWeight: isAltoContraste ? '900' : '600' }}>Função</label>
        <input id="user-role" value={preferences.userRole} onChange={(e) => updatePreference('userRole', e.target.value)} className="text-input" />
      </div>

      <div className="control-group">
        <label style={{ fontWeight: isAltoContraste ? '900' : '600' }}>Modo de navegação</label>
        <div className="chip-row">
          
          {}
          <button 
            className={`chip ${preferences.simplifiedMode ? 'selected' : ''} ${isFeedback && preferences.simplifiedMode ? 'feedback-active' : ''}`} 
            onClick={() => updatePreference('simplifiedMode', true)}
          >
            Simplificado
          </button>

          {}
          <button 
            className={`chip ${!preferences.simplifiedMode ? 'selected' : ''} ${isFeedback && !preferences.simplifiedMode ? 'feedback-active' : ''}`} 
            onClick={() => updatePreference('simplifiedMode', false)}
          >
            Padrão
          </button>

        </div>
      </div>

      <button className="primary-btn save-btn" onClick={handleProfileSave}>Salvar perfil</button>
      {savedMessage && <p className="assistive-text" style={{color: '#16a34a', marginTop: '1rem'}}>{savedMessage}</p>}
    </section>
  );
}