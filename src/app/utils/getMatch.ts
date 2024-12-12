import { getBaseUrl } from './getBaseUrl';

export async function getMatch(id: string): Promise<Match | null> {
  const baseUrl = await getBaseUrl();

  const res = await fetch(`${baseUrl}/api/v1/matches/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });

  if (res.status !== 200) {
    return null;
  }

  const match: Match = await res.json();

  return match;
}
