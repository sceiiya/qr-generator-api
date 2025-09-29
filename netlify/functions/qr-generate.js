// Simple QR Code API using external service
exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    if (event.httpMethod === 'GET') {
      const { type, provider, account_number, account_name } = event.queryStringParameters || {};

      if (!type || !provider || !account_number || !account_name) {
        return {
          statusCode: 400,
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            error: 'Missing required parameters: type, provider, account_number, account_name',
          }),
        };
      }

      if (!['json', 'url'].includes(type)) {
        return {
          statusCode: 400,
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            error: 'Invalid type parameter. Must be either "json" or "url"',
          }),
        };
      }

      const data = { provider, account_number, account_name };
      let qrData;

      if (type === 'json') {
        qrData = JSON.stringify(data);
      } else {
        const url = new URL('data:application/json');
        url.searchParams.set('provider', data.provider);
        url.searchParams.set('account_number', data.account_number);
        url.searchParams.set('account_name', data.account_name);
        qrData = url.toString();
      }

      // Use external QR code service
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(qrData)}`;
      
      // Redirect to QR code service
      return {
        statusCode: 302,
        headers: {
          ...headers,
          'Location': qrCodeUrl,
          'Cache-Control': 'public, max-age=3600',
        },
        body: '',
      };
    }

    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const { provider, account_number, account_name } = body;

      if (!provider || !account_number || !account_name) {
        return {
          statusCode: 400,
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            error: 'Missing required fields: provider, account_number, account_name',
          }),
        };
      }

      const data = { provider, account_number, account_name };
      const qrData = JSON.stringify(data);
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(qrData)}`;

      return {
        statusCode: 200,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          qrCode: qrCodeUrl, 
          data: data,
          note: 'QR code generated using external service'
        }),
      };
    }

    return {
      statusCode: 405,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Failed to generate QR code',
        message: error.message,
      }),
    };
  }
};