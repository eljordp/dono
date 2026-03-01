export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, phone, address, bill } = req.body;

  if (!name || !phone || !address) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Solar Leads <onboarding@resend.dev>',
        to: 'donovan.neu@currentenergy.com',
        subject: `New Solar Lead: ${name}`,
        html: `
          <h2>New Solar Lead</h2>
          <table style="border-collapse:collapse;width:100%;max-width:500px;">
            <tr style="border-bottom:1px solid #eee;">
              <td style="padding:12px;font-weight:bold;color:#555;">Name</td>
              <td style="padding:12px;">${name}</td>
            </tr>
            <tr style="border-bottom:1px solid #eee;">
              <td style="padding:12px;font-weight:bold;color:#555;">Phone</td>
              <td style="padding:12px;"><a href="tel:${phone}">${phone}</a></td>
            </tr>
            <tr style="border-bottom:1px solid #eee;">
              <td style="padding:12px;font-weight:bold;color:#555;">Address</td>
              <td style="padding:12px;">${address}</td>
            </tr>
            <tr>
              <td style="padding:12px;font-weight:bold;color:#555;">Monthly Bill</td>
              <td style="padding:12px;">${bill || 'Not provided'}</td>
            </tr>
          </table>
          <p style="margin-top:20px;color:#999;font-size:13px;">Lead from SoCal Solar Savings website</p>
        `,
      }),
    });

    if (response.ok) {
      return res.status(200).json({ success: true });
    } else {
      const error = await response.json();
      return res.status(500).json({ error: error.message });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
