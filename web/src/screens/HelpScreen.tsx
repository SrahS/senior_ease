import { usePreferences } from '../contexts/PreferencesContext';

export function HelpScreen() {
  const { preferences } = usePreferences();

  const tutoriais = [
    { titulo: 'Início', texto: 'Aqui você vê o resumo do seu dia e confere se esqueceu de algo.' },
    { titulo: 'Tarefas', texto: 'Sua lista de afazeres. Clique em "Concluir" quando terminar algo. Não tenha pressa.' },
    { titulo: 'Ajustes', texto: 'Sinta-se livre para mudar o tamanho, as cores e ligar o modo simplificado.' },
    { titulo: 'Estamos com você', texto: 'Se errar, não tem problema. Suas informações estão seguras e você sempre pode voltar.' },
  ];

  return (
    <section className="panel" aria-labelledby="help-title">
      <div className="panel-heading">
        <h2 id="help-title">Como usar o aplicativo?</h2>
        {!preferences.simplifiedMode && <p>Um guia rápido e tranquilo para você aproveitar ao máximo.</p>}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem' }}>
        {tutoriais.map((item, index) => (
          <div key={index} style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#0f172a', margin: '0 0 0.5rem 0' }}>{item.titulo}</h3>
            <p style={{ margin: 0, color: '#475569', lineHeight: '1.5' }}>{item.texto}</p>
          </div>
        ))}
      </div>
    </section>
  );
}