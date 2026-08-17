const SUPABASE_URL = 'https://ntriwwwryekrmaixhiko.supabase.co';
const SUPABASE_KEY = 'sb_publishable_vvpTUIf9SZI83bak-LH9qw_UZalJAss';

self.addEventListener('install', event => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

async function sendRandomReminder() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/weight_tracker?id=eq.1&select=payload`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
      cache: 'no-store'
    });
    const rows = await res.json();
    const messages = rows?.[0]?.payload?.['notification-messages'] || [];
    const active = messages.filter(m => m && m.active && m.text);
    if (!active.length) return;
    const message = active[Math.floor(Math.random() * active.length)];
    await self.registration.showNotification('Sujit’s Weight Loss journey', {
      body: message.text,
      tag: 'weight-tracker-reminder',
      
    });
  } catch (e) {
    console.warn('Weight Tracker notification failed', e);
  }
}

self.addEventListener('periodicsync', event => {
  if (event.tag === 'weight-tracker-notifications') {
    event.waitUntil(sendRandomReminder());
  }
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    for (const client of list) {
      if ('focus' in client) return client.focus();
    }
    if (clients.openWindow) return clients.openWindow('./');
  }));
});
