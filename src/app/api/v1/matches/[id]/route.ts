import { doc, getDoc } from "firebase/firestore";

import { db } from "@/firebase";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const matchId = (await params).id;
    const match = await getDoc(doc(db, "matches", matchId));

    if (match.exists()) {
      return Response.json({ match: match.data() });
    } else {
      return Response.json({ error: "Match not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
