import '@testing-library/jest-dom';
import { server } from '../src/mocks/server';

// Start and close mock server for API tests
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
