const candidateIds = [
  '53JnMOThtF0',
  'LStcJEyoNnE',
  'LHrzTcpn-hU',
  'xDW27mic2xQ',
  'Y3gQ_vKA7eA',
  'DvOswbq89wU',
  'wIHf0tzrLdg',
  'Sx8kq1Ywn4Q',
  'flEciT2sn-A',
  'xibvQ8nOjEw',
  'vGsyfOSz4vo',
  'r5lnVqzYra8'
];

async function verifyCandidates() {
  for (const id of candidateIds) {
    const url = `https://www.youtube.com/watch?v=${id}`;
    const res = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);
    if (res.ok) {
      const j = await res.json();
      console.log(`[${id}] "${j.title}" by ${j.author_name} (${j.author_url})`);
    } else {
      console.log(`[${id}] ERROR: HTTP ${res.status}`);
    }
  }
}

verifyCandidates().catch(console.error);

