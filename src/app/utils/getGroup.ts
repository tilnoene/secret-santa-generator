import { getBaseUrl } from './getBaseUrl';

export async function getGroup(id: string): Promise<Group | null> {
  const baseUrl = await getBaseUrl();

  const res = await fetch(`${baseUrl}/api/v1/groups/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });

  if (res.status !== 200) {
    return null;
  }

  const group: Group = await res.json();

  return group;
}
