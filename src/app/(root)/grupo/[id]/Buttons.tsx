'use client';

import { FiShare2 } from 'react-icons/fi';
import { FiCopy } from 'react-icons/fi';

export default function Buttons({
  matchId,
  baseUrl,
}: {
  matchId: string;
  baseUrl: string;
}) {
  const getCustomMessage = (matchId: string) => {
    return `${baseUrl}/convite/${matchId}`;
  };

  const getShareData = (matchId: string) => {
    return {
      title: 'Descubra quem você tirou no amigo secreto!',
      url: getCustomMessage(matchId),
    };
  };

  const handleShare = async (matchId: string) => {
    try {
      if (navigator.share) {
        await navigator.share(getShareData(matchId));
        console.log('Link shared successfully!');
      } else {
        // TODO:
      }
    } catch (error) {
      // TODO:
      console.error(error);
    }
  };

  const handleCopy = (matchId: string) => {
    navigator.clipboard
      .writeText(getCustomMessage(matchId))
      .then(() => {
        console.log('Link copiado para a área de trabalho'); // TODO:
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
        // TODO: error
      });
  };

  return (
    <div className="flex gap-2.5">
      <FiCopy className="cursor-pointer" onClick={() => handleCopy(matchId)} />

      <FiShare2
        className="cursor-pointer"
        onClick={() => handleShare(matchId)}
      />
    </div>
  );
}
