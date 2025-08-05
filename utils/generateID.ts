import {
  collection,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  where
} from "firebase/firestore";

export default async function generateTreeID(): Promise<string> {
  const db = getFirestore();
  const year = new Date().getFullYear();
  const prefix = `BFT-${year}`;

  const q = query(
    collection(db, "trees"),
    where("treeID", ">=", prefix),
    where("treeID", "<=", `${prefix}-999999`),
    orderBy("treeID", "desc"),
    limit(1)
  );

  const snapshot = await getDocs(q);

  let newSequence = 1;
  if (!snapshot.empty) {
    const lastId = snapshot.docs[0].data().treeID;
    const lastSeq = parseInt(lastId.split("-")[2], 10);
    newSequence = lastSeq + 1;
  }

  return `${prefix}-${newSequence.toString().padStart(6, "0")}`;
}
