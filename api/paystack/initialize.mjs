import {
  buildPaystackInitializePayload,
  getPaystackSecretKey,
  jsonResponse,
  readRequestJson,
} from './shared.mjs';

export async function POST(request, { fetchImpl = fetch, env = process.env } = {}) {
  const secretKey = getPaystackSecretKey(env);

  if (!secretKey) {
    return jsonResponse(
      {
        ok: false,
        message: 'Missing PAYSTACK_SECRET_KEY server configuration.',
      },
      500
    );
  }

  try {
    const payload = await readRequestJson(request);
    const paystackPayload = buildPaystackInitializePayload(payload);

    const response = await fetchImpl('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paystackPayload),
    });

    const body = await response.json();
    return jsonResponse(body, response.status);
  } catch (error) {
    return jsonResponse(
      {
        ok: false,
        message: error instanceof Error ? error.message : 'Unable to initialize payment.',
      },
      400
    );
  }
}
