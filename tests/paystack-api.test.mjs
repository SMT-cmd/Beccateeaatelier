import test from 'node:test';
import assert from 'node:assert/strict';
import {
  jsonResponse,
  validateInitializeInput,
  buildPaystackInitializePayload,
} from '../api/paystack/shared.mjs';

test('validateInitializeInput rejects incomplete payloads', () => {
  assert.throws(
    () =>
      validateInitializeInput({
        email: '',
        amount: 0,
      }),
    /valid email/i
  );
});

test('buildPaystackInitializePayload maps checkout fields for paystack', () => {
  const payload = buildPaystackInitializePayload({
    email: 'client@example.com',
    amount: 150000,
    reference: 'FH-123',
    callbackUrl: 'https://fashionhub.example/callback',
    metadata: { channel: 'website' },
  });

  assert.deepEqual(payload, {
    email: 'client@example.com',
    amount: 15000000,
    reference: 'FH-123',
    callback_url: 'https://fashionhub.example/callback',
    metadata: { channel: 'website' },
  });
});

test('jsonResponse returns serializable response envelopes', async () => {
  const response = jsonResponse(
    {
      ok: true,
      message: 'ready',
    },
    201
  );

  assert.equal(response.status, 201);
  assert.equal(response.headers.get('content-type'), 'application/json');
  assert.deepEqual(await response.json(), {
    ok: true,
    message: 'ready',
  });
});
