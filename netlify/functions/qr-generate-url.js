const QRCode = require('qrcode');

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
      
      const url = new URL('data:application/json');
      url.searchParams.set('provider', data.provider);
      url.searchParams.set('account_number', data.account_number);
      url.searchParams.set('account_name', data.account_name);
      
      const qrCodeDataUrl = await QRCode.toDataURL(url.toString(), {
        margin: 1,
        color: { dark: '#000000', light: '#FFFFFF' },
        width: 256,
      });

      return {
        statusCode: 200,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          qrCode: qrCodeDataUrl,
          url: url.toString(),
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
        error: 'Failed to generate QR code from URL',
        message: error.message,
      }),
    };
  }
};