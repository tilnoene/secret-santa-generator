'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { FaPlus } from 'react-icons/fa6';
import { X, Loader2 } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  const [groupName, setGroupName] = useState<string>('');
  const [memberName, setMemberName] = useState<string>('');
  const [memberNames, setMemberNames] = useState<string[]>([]);
  const [loadingCreatingGroup, setLoadingCreatingGroup] =
    useState<boolean>(false);

  const handleCreateGroup = async () => {
    if (groupName.length === 0) {
      return; // TODO:
    }

    if (memberNames.length < 3) {
      //toast.error("Insira pelo menos três nomes");
      return; // TODO:
    }

    setLoadingCreatingGroup(true);

    try {
      const res = await fetch('/api/v1/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: groupName, memberNames: memberNames }),
        cache: 'no-store',
      });

      const data: { groupId: string } = await res.json();

      router.push(`/grupo/${data.groupId}`);
    } catch (error) {
      console.error(error);
      //toast.error("Ocorreu um erro! Atualize a página e tente novamente."); // TODO: toast
    }

    setLoadingCreatingGroup(false);
  };

  const handleAddName = () => {
    if (memberName.length === 0) {
      //toast.error("O nome não pode estar vazio.");
      return;
    }

    setMemberNames([memberName, ...memberNames]);
    setMemberName('');
  };

  const handleRemoveName = (index: number) => {
    setMemberNames(
      memberNames.filter((_, currentIndex) => currentIndex !== index)
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddName();
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center">
      <h1 className="mb-7">Gerador de Amigo Secreto</h1>

      <Input
        placeholder="Nome do grupo"
        size={24}
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <div className="flex gap-2 mb-8 w-72 mt-4">
        <Input
          placeholder="Nome"
          size={24}
          value={memberName}
          onChange={(e) => setMemberName(e.target.value)}
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
        {memberNames.length === 0 ? (
          <p>Digite um nome e clique no botão para começar!</p>
        ) : (
          <div className="flex flex-col gap-2.5">
            <h1 className="mb-4">Participantes</h1>

            {memberNames.map((name, index) => (
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
