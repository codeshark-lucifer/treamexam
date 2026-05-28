import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";

import { auth } from "@/lib/firebase-client";

const provider = new GoogleAuthProvider();

async function createSession(token: string) {
  const response = await fetch("/api/auth/session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create session");
  }
}

export async function login(
  email: string,
  password: string
) {
  const credential =
    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

  const token =
    await credential.user.getIdToken();

  await createSession(token);

  return credential.user;
}

export async function loginGoogle() {
  const credential =
    await signInWithPopup(
      auth,
      provider
    );

  const token =
    await credential.user.getIdToken();

  const response = await fetch(
    "/api/auth/google",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        token,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to create user profile"
    );
  }

  // Refresh token to get custom claims
  const refreshedToken =
    await credential.user.getIdToken(
      true
    );

  await createSession(
    refreshedToken
  );

  return credential.user;
}

export async function logout() {
  await signOut(auth);

  await fetch(
    "/api/auth/logout",
    {
      method: "POST",
    }
  );
}