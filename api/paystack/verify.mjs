import { getPaystackSecretKey, jsonResponse } from './shared.mjs';

export async function GET(request, { fetchImpl = fetch, env = process.env } = {}) {
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

  const url = new URL(request.url);
  const reference = url.searchParams.get('reference');

  if (!reference) {
    return jsonResponse(
      {
        ok: false,
        message: 'Payment reference is required.',
      },
      400
    );
  }

  try {
    const response = await fetchImpl(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${secretKey}`,
      },
    });

    const body = await response.json();
    return jsonResponse(body, response.status);
  } catch (error) {
    return jsonResponse(
      {
        ok: false,
        message: error instanceof Error ? error.message : 'Unable to verify payment.',
      },
      500
    );
  }
}
