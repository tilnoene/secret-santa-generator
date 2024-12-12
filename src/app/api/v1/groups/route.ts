import dayjs from 'dayjs';
import { addDoc, updateDoc, collection, doc } from 'firebase/firestore';

import { db } from '@/firebase';

const shuffle = (array: string[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
};

type CreateGroupDto = {
  name: string;
  memberNames: string[];
};

export async function POST(request: Request) {
  try {
    const body: CreateGroupDto = await request.json();
    const { name, memberNames } = body;

    if (!memberNames) {
      return Response.json(
        { error: 'A list of names is required' },
        { status: 400 }
      );
    } else if (memberNames.length < 3) {
      return Response.json(
        { error: 'At least 3 names are required' },
        { status: 400 }
      );
    } else if (!name) {
      return Response.json(
        { error: 'The group should have a name' },
        { status: 400 }
      );
    }

    const shuffledMemberNames = shuffle(memberNames);

    const matchesPromises = [];

    for (
      let currentIndex = 0;
      currentIndex < shuffledMemberNames.length;
      currentIndex++
    ) {
      const nextIndex = (currentIndex + 1) % shuffledMemberNames.length;

      matchesPromises.push(
        addDoc(collection(db, 'matches'), {
          giver: shuffledMemberNames[currentIndex],
          receiver: shuffledMemberNames[nextIndex],
        })
      );
    }

    const matches = await Promise.all(matchesPromises);
    const matchesId = matches.map((match) => match.id);

    const group = await addDoc(collection(db, 'groups'), {
      name: name,
      created_at: dayjs().format(),
      matches_id: matchesId,
    });

    // add group_id to all matches
    matchesId.forEach(async (matchId) => {
      const docRef = doc(db, 'matches', matchId);
      await updateDoc(docRef, { group_id: group.id });
    });

    return Response.json({ groupId: group.id });
  } catch (error) {
    console.error('Error processing request:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
