const mongoose = require('mongoose');
const User = require('../User');
describe('User Model', () => {
  it('should require nombre, email y password', async () => {
    const user = new User({});
    let err;
    try {
      await user.validate();
    } catch (error) {
      err = error;
    }
    expect(err.errors.nombre).toBeDefined();
    expect(err.errors.email).toBeDefined();
    expect(err.errors.password).toBeDefined();
  });
  it('should validate email format', async () => {
    const user = new User({ nombre: 'Test', email: 'invalid', password: '123456' });
    let err;
    try {
      await user.validate();
    } catch (error) {
      err = error;
    }
    expect(err.errors.email).toBeDefined();
  });
  it('should require password length >= 6', async () => {
    const user = new User({ nombre: 'Test', email: 'test@email.com', password: '123' });
    let err;
    try {
      await user.validate();
    } catch (error) {
      err = error;
    }
    expect(err.errors.password).toBeDefined();
  });
});
