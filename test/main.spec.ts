import nock from 'nock';
import {
  sendOneMessage,
  sendSequentialRequests,
  sendConcurrentRequests,
  sendRequestsInBatches,
} from '../src/main';
import {generateSequence} from '../src/util';
import crypto from 'crypto';
import logger from '../src/logger';

describe('verify', () => {
  let body: {
    topic: string;
    message: string;
  };
  beforeEach(() => {
    body = {topic: 'test', message: '123'};
  });
  afterEach(() => {
    expect(nock.isDone()).toBe(true);
    nock.cleanAll();
    process.env.USE_MOCK = 'false';
  });

  describe('sendOneMessage', () => {
    it('should only log if use_mock is true', async () => {
      process.env.USE_MOCK = 'true';
      logger.info = jest.fn();
      const response = await sendOneMessage(body.message);
      expect(response).toBe('okay');
      expect(logger.info).toHaveBeenCalledWith('sent 123');
    });

    it('should send a message to base_url/publish', async () => {
      nock('https://test.com').post('/publish', body).reply(200, {});

      const response = await sendOneMessage(body.message);
      expect(response).toBe('okay');
    });

    it('should send a randomly-generated message to base_url/publish', async () => {
      body.message = 'random';
      crypto.randomUUID = jest.fn(
        () =>
          body.message as `${string}-${string}-${string}-${string}-${string}`
      );
      nock('https://test.com').post('/publish', body).reply(200, {});

      const response = await sendOneMessage();
      expect(response).toBe('okay');
    });

    it('should return status code and error message for non-200 status code', async () => {
      nock('https://test.com')
        .post('/publish', body)
        .reply(400, {error: 'Bad Request'});

      const response = await sendOneMessage(body.message);
      expect(response).toBe('400: {"error":"Bad Request"}');
    });
  });

  it('sendSequentialRequests should send 5 messages sequentially', async () => {
    nock('https://test.com').post('/publish', body).times(5).reply(200, {});
    const start = Date.now();
    const responses = await sendSequentialRequests(5, body.message);
    const end = Date.now();
    expect(end - start).toBeGreaterThan(500);
    expect(responses).toEqual(generateSequence(5).map(i => `${i}:okay`));
  });

  it('sendConcurrentRequests should send 6 messages concurrently', async () => {
    nock('https://test.com').post('/publish', body).times(6).reply(200, {});
    const start = Date.now();
    const responses = await sendConcurrentRequests(6, body.message);
    const end = Date.now();
    expect(end - start).toBeLessThan(200);
    expect(responses).toEqual(generateSequence(6).map(i => `${i}:okay`));
  });

  it('sendRequestsInBatches should send 6 messages in 2 batches', async () => {
    nock('https://test.com').post('/publish', body).times(6).reply(200, {});
    const start = Date.now();
    const responses = await sendRequestsInBatches(6, 2, body.message);
    const end = Date.now();
    expect(end - start).toBeLessThan(400);
    expect(responses).toEqual([
      '0:okay',
      '2:okay',
      '4:okay',
      '1:okay',
      '3:okay',
      '5:okay',
    ]);
  });
});
