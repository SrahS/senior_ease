import { usePreferences } from '../contexts/PreferencesContext';

export function SettingsScreen() {
  const { preferences, updatePreference } = usePreferences();

  // Variáveis para facilitar a leitura das regras condicionais
  const isFeedback = preferences.visualFeedback;
  const isAltoContraste = preferences.contrast === 'alto';

  return (
    <section className="panel" aria-labelledby="preferences-title">
      <div className="panel-heading">
        <h2 id="preferences-title">Painel de personalização</h2>
        {!preferences.simplifiedMode && (
          <p>Adapte o espaço, a leitura e a segurança para o seu ritmo.</p>
        )}
      </div>

      <div className="control-group">
        <label style={{ fontWeight: isAltoContraste ? '900' : '600' }}>Contraste</label>
        <div className="chip-row">
          {(['padrão', 'alto'] as const).map(option => {
            const isSelected = preferences.contrast === option;
            return (
              <button 
                key={option} 
                className={`chip ${isSelected ? 'selected' : ''} ${isFeedback && isSelected ? 'feedback-active' : ''}`} 
                onClick={() => updatePreference('contrast', option)}
              >
                {option === 'alto' ? 'Alto contraste' : 'Padrão'}
              </button>
            )
          })}
        </div>
      </div>

      <div className="control-group">
        <label style={{ fontWeight: isAltoContraste ? '900' : '600' }}>Espaçamento</label>
        <div className="chip-row">
          {(['padrão', 'amplo'] as const).map(option => {
            // Verifica se a opção está ativa (considerando 'padrão' como a ausência de 'amplo')
            const isSelected = preferences.spacing === option || (option === 'padrão' && preferences.spacing !== 'amplo');
            return (
              <button 
                key={option} 
                className={`chip ${isSelected ? 'selected' : ''} ${isFeedback && isSelected ? 'feedback-active' : ''}`} 
                onClick={() => updatePreference('spacing', option === 'padrão' ? 'compacto' : 'amplo')}
              >
                {option === 'amplo' ? 'Espaçado' : 'Padrão'}
              </button>
            )
          })}
        </div>
      </div>

      <div className="control-group" style={{ marginTop: '24px' }}>
        
        {/* Modo Simplificado */}
        <div className={`switch-row ${isFeedback ? 'feedback-active' : ''}`}>
          <label className="switch-toggle">
            <input type="checkbox" checked={preferences.simplifiedMode} onChange={(e) => updatePreference('simplifiedMode', e.target.checked)} />
            <span className="switch-slider"></span>
          </label>
          <span style={{flex: 1, fontWeight: isAltoContraste ? '900' : '600', marginLeft: '8px'}}>Modo simplificado</span>
          {isFeedback && <span className="feedback-badge">{preferences.simplifiedMode ? 'LIGADO' : 'DESLIGADO'}</span>}
        </div>

        {/* Feedback Visual */}
        <div className={`switch-row ${isFeedback ? 'feedback-active' : ''}`}>
          <label className="switch-toggle">
            <input type="checkbox" checked={preferences.visualFeedback} onChange={(e) => updatePreference('visualFeedback', e.target.checked)} />
            <span className="switch-slider"></span>
          </label>
          <span style={{flex: 1, fontWeight: isAltoContraste ? '900' : '600', marginLeft: '8px'}}>Feedback visual reforçado</span>
          {isFeedback && <span className="feedback-badge">{preferences.visualFeedback ? 'LIGADO' : 'DESLIGADO'}</span>}
        </div>

        {/* Lembretes */}
        <div className={`switch-row ${isFeedback ? 'feedback-active' : ''}`}>
          <label className="switch-toggle">
            <input type="checkbox" checked={preferences.reminders} onChange={(e) => updatePreference('reminders', e.target.checked)} />
            <span className="switch-slider"></span>
          </label>
          <span style={{flex: 1, fontWeight: isAltoContraste ? '900' : '600', marginLeft: '8px'}}>Lembretes</span>
          {isFeedback && <span className="feedback-badge">{preferences.reminders ? 'LIGADO' : 'DESLIGADO'}</span>}
        </div>

        {/* Modo Acolhedor */}
        <div className={`switch-row ${isFeedback ? 'feedback-active' : ''}`}>
          <label className="switch-toggle">
            <input type="checkbox" checked={preferences.warmMode} onChange={(e) => updatePreference('warmMode', e.target.checked)} />
            <span className="switch-slider"></span>
          </label>
          <span style={{flex: 1, fontWeight: isAltoContraste ? '900' : '600', marginLeft: '8px'}}>Modo acolhedor</span>
          {isFeedback && <span className="feedback-badge">{preferences.warmMode ? 'LIGADO' : 'DESLIGADO'}</span>}
        </div>
      </div>

      {preferences.reminders && (
        <div className="panel" style={{backgroundColor: '#eff6ff', borderColor: '#bfdbfe', marginTop: '1.5rem'}}>
          <p style={{margin: 0, color: '#1e3a8a'}}><strong>Lembrete:</strong> Suas alterações são salvas automaticamente assim que você clica.</p>
        </div>
      )}
    </section>
  );
}