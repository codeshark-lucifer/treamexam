import admin from "firebase-admin";

function getPrivateKey() {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (!privateKey) {
        return null;
    }

    try {
        return privateKey
            .replace(/^"|"$/g, "")
            .replace(/\\n/g, "\n");
    } catch (e) {
        return null;
    }
}

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = getPrivateKey();

if (!admin.apps.length && projectId && clientEmail && privateKey) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId,
                clientEmail,
                privateKey,
            }),
        });
    } catch (error) {
        console.error("Firebase admin initialization error:", error);
    }
}

export const adminAuth = (admin.apps.length ? admin.auth() : null) as unknown as admin.auth.Auth;
export const adminFirestore = (admin.apps.length ? admin.firestore() : null) as unknown as admin.firestore.Firestore;
export const adminFieldValue = admin.firestore.FieldValue;
