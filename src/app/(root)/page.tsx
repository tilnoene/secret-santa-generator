"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { FaPlus } from "react-icons/fa6";
import { X, Loader2 } from "lucide-react";

export default function Home() {
  const router = useRouter();

  const [name, setName] = useState<string>("");
  const [names, setNames] = useState<string[]>([
    //"Victor",
    //"Nathália",
    //"Daniel",
  ]);
  const [loadingCreatingGroup, setLoadingCreatingGroup] =
    useState<boolean>(false);

  const handleCreateGroup = async () => {
    if (names.length < 3) {
      //toast.error("Insira pelo menos três nomes");
      return;
    }

    setLoadingCreatingGroup(true);

    try {
      const res = await fetch("/api/v1/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ names: names }),
      });

      const data: { group_id: string } = await res.json();

      router.push(`/grupo/${data.group_id}`);
    } catch (error) {
      console.error(error);
      //toast.error("Ocorreu um erro! Atualize a página e tente novamente."); // TODO: toast
    }

    setLoadingCreatingGroup(false);
  };

  const handleAddName = () => {
    if (name.length === 0) {
      //toast.error("O nome não pode estar vazio.");
      return;
    }

    setNames([...names, name]);
    setName("");
  };

  const handleRemoveName = (index: number) => {
    setNames(names.filter((_, currentIndex) => currentIndex !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13) {
      handleAddName();
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center">
      <h1 className="mb-7">Gerador de Amigo Secreto</h1>

      <div className="flex gap-2 mb-8 w-72">
        <Input
          placeholder="Nome"
          size={24}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <Button
          onClick={() => handleAddName()}
          disabled={loadingCreatingGroup}
          type="submit"
          className="p-2.5 bg-blue-500 hover:bg-blue-600"
        >
          <FaPlus />
        </Button>
      </div>

      <div className="w-72 flex flex-col">
        {names.length === 0 ? (
          <p>Digite um nome e clique no botão para começar!</p>
        ) : (
          <div className="flex flex-col gap-2.5">
            <h1 className="mb-4">Participantes</h1>

            {names.map((name, index) => (
              <div
                key={index}
                className="rounded-md border px-3 py-2 shadow-sm flex items-center justify-between"
              >
                <p className="ml-1 text-sm">{name}</p>

                <X
                  className="cursor-pointer text-zinc-600"
                  onClick={() => handleRemoveName(index)}
                />
              </div>
            ))}

            {loadingCreatingGroup ? (
              <Button disabled>
                <Loader2 className="animate-spin mt-3" />
                Please wait
              </Button>
            ) : (
              <Button
                className=" bg-blue-500 hover:bg-blue-600 mt-3"
                onClick={() => handleCreateGroup()}
              >
                Criar Amigo Secreto
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
