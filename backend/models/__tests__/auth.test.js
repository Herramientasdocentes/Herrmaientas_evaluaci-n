const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const User = require('../../models/User');

jest.mock('../../models/User', () => ({
  // Mock the constructor
  __esModule: true,
  default: jest.fn(() => ({
    save: jest.fn().mockResolvedValue(true),
  })),
  // Mock static methods
  create: jest.fn(),
  findOne: jest.fn(),
}));
const authRoutes = require('../../routes/auth');

// Mock mongoose to prevent actual database connection
jest.mock('mongoose', () => {
  const mongoose = jest.requireActual('mongoose');
  return {
    ...mongoose,
    connect: jest.fn().mockResolvedValue(true),
    connection: {
      db: {
        dropDatabase: jest.fn().mockResolvedValue(true),
      },
      close: jest.fn().mockResolvedValue(true),
    },
  };
});

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth API', () => {
  it('debe registrar un usuario nuevo', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ nombre: 'Test', email: 'test@email.com', password: '123456' });
    expect(res.statusCode).toBe(201);
    expect(res.body.msg).toBe('Usuario registrado correctamente.');
  });

  it('no debe registrar usuario con email repetido', async () => {
    await User.create({ nombre: 'Test', email: 'test@email.com', password: '123456' });
    const res = await request(app)
      .post('/api/auth/register')
      .send({ nombre: 'Test', email: 'test@email.com', password: '123456' });
    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe('El usuario ya existe.');
  });

  it('no debe registrar usuario con datos inválidos', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ nombre: '', email: 'bademail', password: '123' });
    expect(res.statusCode).toBe(400);
    expect(res.body.errores).toBeDefined();
  });
});
