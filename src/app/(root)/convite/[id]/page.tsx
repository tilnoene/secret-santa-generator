import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { getGroup } from '@/app/utils/getGroup';
import { getMatch } from '@/app/utils/getMatch';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const matchId = (await params).id;
  const match = await getMatch(matchId);
  const group = match ? await getGroup(match.groupId) : null;

  return {
    title: match && group ? `${match.giver} | ${group.name}` : 'Erro',
    description: match
      ? `${match.giver}, descubra quem você tirou no amigo secreto!`
      : 'Erro ao carregar o grupo',
  };
}

export default async function Invitation({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const matchId = (await params).id;
  const match = await getMatch(matchId);

  if (!match) {
    redirect('/'); // TODO:
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center">
      <p className="text-lg mb-0">{match.giver},</p>
      <p>seu amigo secreto é:</p>
      <h1 className="text-4xl mt-2 text-blue-500">{match.receiver}</h1>
    </div>
  );
}
