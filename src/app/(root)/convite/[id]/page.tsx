import type { Metadata, ResolvingMetadata } from "next";
import { headers } from "next/headers";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function getMatch(id: string): Promise<Match> {
  const host = (await headers()).get("host");
  const protocol = process?.env.NODE_ENV === "development" ? "http" : "https";

  const res = await fetch(`${protocol}://${host}/api/v1/matches/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const match: Match = (await res.json()).match;

  return match;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const matchId = (await params).id;
  const match = await getMatch(matchId);

  return {
    title: "Grupo da Família",
    description: `${match.giver}, descubra quem você tirou no amigo secreto!`,
  };
}

export default async function Invitation({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const matchId = (await params).id;
  const match = await getMatch(matchId);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center">
      <p className="text-lg mb-0">{match.giver},</p>
      <p>seu amigo secreto é:</p>
      <h1 className="text-4xl mt-2 text-blue-500">{match.receiver}</h1>
    </div>
  );
}
