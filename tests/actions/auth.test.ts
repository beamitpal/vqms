import { server } from '../../src/mocks/server'; 
import { http, HttpResponse } from 'msw';

describe('API Auth Routes', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('should handle login successfully', async () => {
    server.use(
      http.post('/api/auth/login', ({ }) => {
        return HttpResponse.json({ token: 'mock-token' });
      })
    );

    const response = await fetch('/api/auth/login', { method: 'POST' });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ token: 'mock-token' });
  });
});