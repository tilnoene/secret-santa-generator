import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Buttons from "./Buttons";

type Match = {
  id: string;
  giver: string;
  receiver: string;
};

export default async function Group({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const groupId = (await params).id;

  const host = (await headers()).get("host");
  const protocol = process?.env.NODE_ENV === "development" ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  const res = await fetch(`${baseUrl}/api/v1/groups/${groupId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (res.status !== 200) {
    redirect("/");
  }

  const matches: Match[] = (await res.json()).matches;

  return (
    <div className="min-h-screen w-full flex flex-col justify-center">
      <div className="mb-4">
        <h1 className="font-blue-500">Quase lá!</h1>
        <h2>
          Agora basta compartilhar o link personalizado com cada um dos
          integrantes!
        </h2>
      </div>

      <div className="flex flex-col gap-2.5">
        {matches.map((match, index) => (
          <div
            key={index}
            className="rounded-md border px-3 py-2 shadow-sm flex items-center justify-between w-full max-w-72"
          >
            <p className="ml-1 text-sm">{match.giver}</p>

            <Buttons matchId={match.id} baseUrl={baseUrl} />
          </div>
        ))}
      </div>
    </div>
  );
}
