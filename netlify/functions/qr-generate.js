const QRCode = require('qrcode');

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    if (event.httpMethod === 'GET') {
      // Handle GET request with query parameters
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

      const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
        width: 256,
      });

      const base64Data = qrCodeDataUrl.split(',')[1];
      const buffer = Buffer.from(base64Data, 'base64');

      return {
        statusCode: 200,
        headers: {
          ...headers,
          'Content-Type': 'image/png',
          'Content-Length': buffer.length.toString(),
          'Cache-Control': 'public, max-age=3600',
        },
        body: buffer.toString('base64'),
        isBase64Encoded: true,
      };
    }

    if (event.httpMethod === 'POST') {
      // Handle POST request with JSON body
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
      const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
        width: 256,
      });

      return {
        statusCode: 200,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          qrCode: qrCodeDataUrl,
          data: data,
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
