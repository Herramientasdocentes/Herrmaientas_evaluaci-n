const request = require('supertest');
const express = require('express');
const assessmentController = require('../assessmentController');
const authMiddleware = require('../../middleware/auth');
const { google } = require('googleapis'); // Import google to mock it

// Mock de dependencias
jest.mock('../../models/Assessment');
jest.mock('../../models/Question');
jest.mock('../../utils/googleAuth');
jest.mock('googleapis'); // Mock googleapis

const Assessment = require('../../models/Assessment');
const Question = require('../../models/Question');
const { getAuthenticatedClient } = require('../../utils/googleAuth');

// Crear una app de express falsa para las pruebas
const app = express();
app.use(express.json());

// Simular el middleware de autenticación
app.use((req, res, next) => {
  req.user = { id: 'testUserId', googleAccessToken: 'testToken' };
  next();
});

app.post('/assessments', assessmentController.createAssessment);
app.get('/assessments', assessmentController.getAssessments);

describe('Assessment Controller', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createAssessment', () => {
    it('should return 400 if required fields are missing', async () => {
      const res = await request(app)
        .post('/assessments')
        .send({});
      expect(res.statusCode).toEqual(400);
      expect(res.body.msg).toBe('Faltan datos para crear la evaluación.');
    });

    it('should create an assessment successfully', async () => {
      // Mocks
      Question.find.mockResolvedValue([
        { _id: 'q1', pregunta: 'P1', opcionA: 'A', opcionB: 'B', opcionC: 'C', opcionD: 'D' },
      ]);

      const mockDocsCreate = jest.fn().mockResolvedValue({ data: { documentId: 'docId' } });
      const mockDocsBatchUpdate = jest.fn().mockResolvedValue({});
      const mockFormsCreate = jest.fn().mockResolvedValue({ data: { formId: 'formId' } });
      const mockFormsBatchUpdate = jest.fn().mockResolvedValue({});

      // Mock the oAuth2Client that getAuthenticatedClient returns
      const mockOAuth2Client = {
        request: jest.fn(), // Mock the request method
      };
      getAuthenticatedClient.mockResolvedValue(mockOAuth2Client);

      // Mock google.docs and google.forms directly
      google.docs.mockReturnValue({
        documents: { create: mockDocsCreate, batchUpdate: mockDocsBatchUpdate },
      });
      google.forms.mockReturnValue({
        forms: { create: mockFormsCreate, batchUpdate: mockFormsBatchUpdate },
      });

      Assessment.prototype.save = jest.fn().mockResolvedValue({});

      const res = await request(app)
        .post('/assessments')
        .send({ nombreEvaluacion: 'Test', objetivo: 'Test Obj', questionIds: ['q1'] });

      expect(res.statusCode).toEqual(201);
      expect(getAuthenticatedClient).toHaveBeenCalled();
      expect(mockDocsCreate).toHaveBeenCalled();
      expect(mockFormsCreate).toHaveBeenCalled();
      expect(Assessment.prototype.save).toHaveBeenCalled();
      expect(res.body.enlaceDoc).toContain('docId');
      expect(res.body.enlaceForm).toContain('formId');
    });
  });

  describe('getAssessments', () => {
    it('should return user assessments', async () => {
      Assessment.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue([{ nombreEvaluacion: 'Test' }])
      });

      const res = await request(app).get('/assessments');

      expect(res.statusCode).toEqual(200);
      expect(res.body[0].nombreEvaluacion).toBe('Test');
      expect(Assessment.find).toHaveBeenCalledWith({ creador: 'testUserId' });
    });
  });
});
