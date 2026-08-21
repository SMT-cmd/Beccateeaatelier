const jsonHeaders = {
  'content-type': 'application/json',
};

export function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: jsonHeaders,
  });
}

export function normalizeAmountToKobo(amount) {
  return Math.round(Number(amount || 0) * 100);
}

export function validateInitializeInput({ email, amount }) {
  if (!email || !String(email).includes('@')) {
    throw new Error('A valid email address is required.');
  }

  if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) {
    throw new Error('A valid payment amount is required.');
  }
}

export function buildPaystackInitializePayload({
  email,
  amount,
  reference,
  callbackUrl,
  metadata = {},
}) {
  validateInitializeInput({ email, amount });

  const payload = {
    email,
    amount: normalizeAmountToKobo(amount),
    reference,
    metadata,
  };

  if (callbackUrl) {
    payload.callback_url = callbackUrl;
  }

  return payload;
}

export function getPaystackSecretKey(env = process.env) {
  return env.PAYSTACK_SECRET_KEY || '';
}

export function getPaystackPublicKey(env = process.env) {
  return env.PAYSTACK_PUBLIC_KEY || '';
}

export async function readRequestJson(request) {
  try {
    return await request.json();
  } catch {
    throw new Error('Invalid JSON payload.');
  }
}
