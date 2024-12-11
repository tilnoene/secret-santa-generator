import { doc, getDoc } from "firebase/firestore";

import { db } from "@/firebase";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const groupId = (await params).id;
    const group = await getDoc(doc(db, "groups", groupId));

    if (group.exists()) {
      const matchesPromises = group
        .data()
        .matches_id.map((matchId: string) =>
          getDoc(doc(db, "matches", matchId)),
        );

      const matches = (await Promise.all(matchesPromises)).map((match) => {
        return {
          ...match.data(),
          id: match.id,
        };
      });

      return Response.json({ matches: matches });
    } else {
      return Response.json({ error: "Group not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
