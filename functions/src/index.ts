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

