import { useState } from 'react';
import { usePreferences } from '../contexts/PreferencesContext';
import { AnnounceActionUseCase } from '../../../shared/domain/useCases/announceActionUseCase';
import { signOut } from 'firebase/auth';
import { auth } from '../../../shared/firebase/config';

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

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
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

      <div className="control-group" style={{ marginBottom: '32px' }}>
        <label style={{ fontWeight: isAltoContraste ? '900' : '600', display: 'block', marginBottom: '12px' }}>
          Modo de navegação
        </label>

        <div className="chip-row" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <button
            className={`chip ${preferences.simplifiedMode ? 'selected' : ''} ${isFeedback && preferences.simplifiedMode ? 'feedback-active' : ''}`}
            style={{ flex: 1, padding: '12px' }}
            onClick={() => updatePreference('simplifiedMode', true)}
          >
            Simplificado
          </button>

          <button
            className={`chip ${!preferences.simplifiedMode ? 'selected' : ''} ${isFeedback && !preferences.simplifiedMode ? 'feedback-active' : ''}`}
            style={{ flex: 1, padding: '12px' }}
            onClick={() => updatePreference('simplifiedMode', false)}
          >
            Padrão
          </button>
        </div>
      </div>

      <button
        className="primary-btn save-btn"
        style={{ width: '100%', padding: '16px', marginTop: '16px', fontSize: '1.1rem' }}
        onClick={handleProfileSave}
      >
        Salvar perfil
      </button>
      {savedMessage && <p className="assistive-text" style={{ color: '#16a34a', marginTop: '1rem', textAlign: 'center', fontWeight: 'bold' }}>{savedMessage}</p>}

      <button 
        onClick={handleLogout}
        style={{ 
          width: '100%', 
          padding: '16px', 
          marginTop: '16px', 
          fontSize: '1.1rem', 
          backgroundColor: 'transparent', 
          border: isAltoContraste ? '4px solid #000' : '2px solid #ef4444', 
          color: isAltoContraste ? '#000' : '#ef4444', 
          borderRadius: '8px', 
          fontWeight: 'bold', 
          cursor: 'pointer' 
        }}
      >
        Sair da conta
      </button>
    </section>
  );
}