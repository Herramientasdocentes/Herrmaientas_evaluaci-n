import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RegisterPage from './RegisterPage';

describe('RegisterPage', () => {
  it('muestra errores si los campos están vacíos', () => {
    render(<RegisterPage onSwitchToLogin={() => {}} />);
    fireEvent.click(screen.getByText('Registrarse'));
    expect(screen.getByText('El nombre es requerido.')).toBeInTheDocument();
    expect(screen.getByText('El correo es requerido.')).toBeInTheDocument();
    expect(screen.getByText('La contraseña es requerida.')).toBeInTheDocument();
  });

  it('muestra error si el email es inválido', () => {
    render(<RegisterPage onSwitchToLogin={() => {}} />);
    fireEvent.change(screen.getByLabelText('Nombre Completo'), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText('Correo Electrónico'), { target: { value: 'correo-invalido' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: '123456' } });
    fireEvent.click(screen.getByText('Registrarse'));
    expect(screen.getByText('El formato del correo no es válido.')).toBeInTheDocument();
  });

  it('muestra error si la contraseña es muy corta', () => {
    render(<RegisterPage onSwitchToLogin={() => {}} />);
    fireEvent.change(screen.getByLabelText('Nombre Completo'), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText('Correo Electrónico'), { target: { value: 'test@email.com' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: '123' } });
    fireEvent.click(screen.getByText('Registrarse'));
    expect(screen.getByText('La contraseña debe tener al menos 6 caracteres.')).toBeInTheDocument();
  });
});
