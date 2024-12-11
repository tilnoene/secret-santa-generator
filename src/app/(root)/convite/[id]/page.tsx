import { headers } from "next/headers";

type Match = {
  giver: string;
  receiver: string;
};

export default async function Invitation({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const matchId = (await params).id;

  const host = (await headers()).get("host");
  const protocol = process?.env.NODE_ENV === "development" ? "http" : "https";

  const res = await fetch(`${protocol}://${host}/api/v1/matches/${matchId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const match: Match = (await res.json()).match;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center">
      <p className="text-lg mb-0">{match.receiver},</p>
      <p>seu amigo secreto é:</p>
      <h1 className="text-4xl mt-2 text-blue-500">{match.giver}</h1>
    </div>
  );
}
