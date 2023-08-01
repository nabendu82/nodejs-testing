const { authRegisterConroller } = require('../controllers/auth');
const User = require('../models/User');
const CryptoJS = require("crypto-js");

// Mock the required dependencies
jest.mock('../models/User');
jest.mock('crypto-js', () => ({
    AES: {
        encrypt: jest.fn().mockReturnValue('encrypted_password'),
    },
}));

describe('authRegisterConroller', () => {
    test('should create a new user and return it', async () => {
        const req = {
            body: {
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'testpassword',
            },
        };
        const saveMock = jest.fn().mockResolvedValue({
            _id: 'user_id',
            username: req.body.username,
            email: req.body.email,
        });
        User.mockReturnValue({ save: saveMock });

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await authRegisterConroller(req, res);

        expect(User).toHaveBeenCalledTimes(1);
        expect(User).toHaveBeenCalledWith({
            username: req.body.username,
            email: req.body.email,
            password: 'encrypted_password'
        });
        expect(saveMock).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            _id: 'user_id',
            username: req.body.username,
            email: req.body.email
        });
    })

    test('should return a 500 error if saving user fails', async () => {
        const req = {
            body: {
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'testpassword',
            },
        };
        User.mockReturnValue({ save: jest.fn().mockRejectedValue(new Error('Save error')) });

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await authRegisterConroller(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Save error' });
    });
})
