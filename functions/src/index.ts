import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { setGlobalOptions } from "firebase-functions";

// Initialize Firebase Admin
admin.initializeApp();

// Set global options for all functions (v2 API only)
setGlobalOptions({ maxInstances: 10 });

interface NewUserRequest {
  name: string;
  email: string;
  password: string;
  role: string;
  image?: string;
  status: string;
  joined: string;
}

interface NewTreeRequest {
  city: string;
  barangay: string;
  diameter: number;
  dateTracked: string;
  fruitStatus: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  image?: string;
  status: string;
  trackedBy: string; 
}

export const createNewUser = functions.https.onCall(
  async (request: functions.https.CallableRequest<NewUserRequest>, context) => {
    const data = request.data;

  try {
    const db = admin.firestore();
    const userRecord = await admin.auth().createUser({
      email: data.email,
      password: data.password,
      displayName: data.name,
    });

    await admin.auth().setCustomUserClaims(userRecord.uid, { role: data.role });

    const userData = {
      uid: userRecord.uid,
      name: data.name,
      email: data.email,
      role: data.role,
      status: data.status,
      image: data.image,
      joined: new Date().toISOString(),
    };

    await db.collection("users").doc(userRecord.uid).set(userData);

    return { success: true, uid: userRecord.uid };
  } catch (error: any) {
    console.error("Error creating user:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});

export const deleteUser = functions.https.onCall(
  async (request: functions.https.CallableRequest<{ uid: string }>, context) => {
  const { uid } = request.data;

  if (!uid) {
    throw new functions.https.HttpsError('invalid-argument', 'UID is required.');
  }

  try {
    const db = admin.firestore();
    await db.collection('users').doc(uid).delete();
    await admin.auth().deleteUser(uid);

    return { success: true };
  } catch (error: any) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});

export const addNewTree = functions.https.onCall(
  async (request: functions.https.CallableRequest<NewTreeRequest>, context) => {
  const data = request.data;

  const year = new Date().getFullYear();
  const prefix = `BFT-${year}`;

  const db = admin.firestore();
  const treeCollection = db.collection("trees");

  const querySnapshot = await treeCollection
    .where("treeID", ">=", prefix)
    .where("treeID", "<=", `${prefix}-999999`)
    .orderBy("treeID", "desc")
    .limit(1)
    .get();

  let newSequence = 1;
  if (!querySnapshot.empty) {
    const lastTreeID = querySnapshot.docs[0].data().treeID;
    const lastSeq = parseInt(lastTreeID.split("-")[2], 10);
    newSequence = lastSeq + 1;
  }

  if (newSequence > 999999) {
    throw new functions.https.HttpsError("resource-exhausted", "Maximum ID limit reached for the year.");
  }

  const treeID = `${prefix}-${newSequence.toString().padStart(6, "0")}`;

  const treeData = {
    treeID: treeID,
    city: data.city,
    barangay: data.barangay,
    diameter: data.diameter,
    dateTracked: data.dateTracked,
    fruitStatus: data.fruitStatus,
    coordinates: {
      latitude: data.coordinates.latitude,
      longitude: data.coordinates.longitude,
    },
    image: data.image,
    status: data.status,
    trackedBy: data.trackedBy,
  };

  try {
    await treeCollection.doc(treeID).set(treeData);
    return { success: true, treeID };
  } catch (error) {
    console.error("Error adding tree:", error);
    throw new functions.https.HttpsError("internal", "Failed to add tree");
  }
});