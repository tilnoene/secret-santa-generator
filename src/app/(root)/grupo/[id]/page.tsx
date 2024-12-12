import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

import Buttons from "./Buttons";

async function getBaseUrl() {
  const host = (await headers()).get("host");
  const protocol = process?.env.NODE_ENV === "development" ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;
  return baseUrl;
}

async function getGroup(id: string): Promise<Group | null> {
  const baseUrl = await getBaseUrl();

  const res = await fetch(`${baseUrl}/api/v1/groups/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (res.status !== 200) {
    return null;
  }

  const group: Group = (await res.json()).group;

  return group;
}

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const groupId = (await params).id;
  const group = await getGroup(groupId);

  return {
    title: group ? group.name : "Erro",
    description: group
      ? `Gerencie o grupo de amigo secreto "${group.name}"`
      : "Ocorreu um erro ao carregar o grupo.",
  };
}

export default async function Group({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const groupId = (await params).id;
  const group = await getGroup(groupId);

  if (!group) {
    redirect("/"); // TODO:
  }

  const baseUrl = await getBaseUrl();

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
        {group.matches.map((match, index) => (
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
