import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('SeniorEase app', () => {
  it('renders the main accessibility experience sections', () => {
    render(<App />);

    expect(screen.getByText('Painel de personalização')).toBeInTheDocument();
    expect(screen.getByText('Organizador simplificado')).toBeInTheDocument();
    expect(screen.getByText('Seu dia, mais simples e seguro')).toBeInTheDocument();
  });
});
