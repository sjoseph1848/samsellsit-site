/**
 * Fires automatically on every Netlify form submission.
 * Sends a push notification to Sam's phone via ntfy.sh.
 *
 * The topic name is the ONLY thing protecting these leads, so it lives in an
 * environment variable (Netlify UI > Site configuration > Environment variables),
 * never in this repo. The repo is public.
 */
exports.handler = async (event) => {
  const TOPIC = process.env.NTFY_TOPIC;

  try {
    if (!TOPIC) {
      console.error('NTFY_TOPIC is not set. Skipping push.');
      return { statusCode: 200, body: 'no topic configured' };
    }

    const body = JSON.parse(event.body || '{}');
    const p = body.payload || {};
    const d = p.data || {};
    const formName = p.form_name || '';
    const isRenter = formName.indexOf('renter') !== -1;

    const name  = (d.name  || 'Someone').trim();
    const phone = (d.phone || '').trim();

    const lines = [];
    if (isRenter) {
      if (d.move)   lines.push('Move: '   + d.move);
      if (d.budget) lines.push('Budget: ' + d.budget);
      if (d.beds)   lines.push('Beds: '   + d.beds);
      if (d.area)   lines.push('Near: '   + d.area);
    } else {
      if (d.stage) lines.push('Stage: '      + d.stage);
      if (d.rent)  lines.push('Rent now: '   + d.rent);
      if (d.first) lines.push('First home: ' + d.first);
      if (d.lease) lines.push('Lease ends: ' + d.lease);
      if (d.area)  lines.push('Areas: '      + d.area);
    }
    if (d.notes) lines.push('Notes: ' + d.notes);
    if (phone)   lines.push('');
    if (phone)   lines.push('Call/text: ' + phone);

    const message = lines.join('\n') || 'New submission. Check your email.';

    // ntfy headers must be plain ASCII, so strip anything else out of the title.
    const safeName = name.replace(/[^\x20-\x7E]/g, '').slice(0, 40) || 'Someone';
    const title = (isRenter ? 'RENTER: ' : 'BUYER: ') + safeName;

    const headers = {
      'Content-Type': 'text/plain; charset=utf-8',
      'Title': title,
      'Priority': 'high',
      'Tags': isRenter ? 'house' : 'key'
    };

    // Tapping the notification calls them back. One tap, no copying numbers.
    if (/^[\d\s()+\-.]{7,}$/.test(phone)) {
      headers['Actions'] = 'view, Call ' + safeName + ', tel:' + phone.replace(/[^\d+]/g, '');
    }

    const res = await fetch('https://ntfy.sh/' + TOPIC, {
      method: 'POST',
      headers: headers,
      body: message
    });

    if (!res.ok) console.error('ntfy responded ' + res.status);
    return { statusCode: 200, body: 'ok' };

  } catch (err) {
    // Never let a push failure interfere with capturing the lead.
    console.error('push failed:', err && err.message);
    return { statusCode: 200, body: 'error handled' };
  }
};
