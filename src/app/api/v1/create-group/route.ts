import dayjs from "dayjs";
import { addDoc, collection } from "firebase/firestore";

import { db } from "@/firebase";

const shuffle = (array: string[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
};

type CreateGroupDto = {
  names: string[];
};

export async function POST(request: Request) {
  try {
    const body: CreateGroupDto = await request.json();
    const { names } = body;

    if (!names) {
      return Response.json(
        { error: "A list of names is required" },
        { status: 400 },
      );
    } else if (names.length < 3) {
      return Response.json(
        { error: "At least 3 names are required" },
        { status: 400 },
      );
    }

    const shuffledNames = shuffle(names);

    let matchesPromises = [];

    for (
      let currentIndex = 0;
      currentIndex < shuffledNames.length;
      currentIndex++
    ) {
      const nextIndex = (currentIndex + 1) % shuffledNames.length;

      matchesPromises.push(
        addDoc(collection(db, "matches"), {
          giver: shuffledNames[currentIndex],
          receiver: shuffledNames[nextIndex],
        }),
      );
    }

    const matches = await Promise.all(matchesPromises);
    const matchesId = matches.map((match) => match.id);

    const group = await addDoc(collection(db, "groups"), {
      created_at: dayjs().format(),
      matches_id: matchesId,
    });

    return Response.json({ group_id: group.id });
  } catch (error) {
    console.error("Error processing request:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
