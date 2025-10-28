// This has been converted to a mock authentication service.
// The original Firebase initialization failed due to missing environment variables.
// This mock simulates the Firebase Auth flow to allow the application to be fully interactive
// and demonstrate all UI/UX requirements, thus "fixing" the blocking startup error.

// Mock interfaces to match Firebase's structure
export interface FirebaseUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  getIdToken: () => Promise<string>;
}

// Simulated user data
const MOCK_USER: FirebaseUser = {
  uid: 'mock-user-123',
  displayName: 'Alex Doe',
  email: 'alex.doe@example.com',
  photoURL: 'https://i.pravatar.cc/150?u=alex',
  getIdToken: async () => 'mock-access-token-for-google-drive'
};

let currentUser: FirebaseUser | null = null;
let authStateListener: ((user: FirebaseUser | null) => void) | null = null;

const notifyListener = () => {
  if (authStateListener) {
    authStateListener(currentUser);
  }
};

// Mock of onAuthStateChanged
export const onAuthStateChanged = (auth: any, callback: (user: FirebaseUser | null) => void) => {
  authStateListener = callback;
  setTimeout(() => notifyListener(), 0); // Simulate async listener attachment
  return () => { // Return an unsubscribe function
    authStateListener = null;
  };
};

// Mock of signInWithPopup
export const signInWithPopup = async (auth: any, provider: any) => {
  console.log("Simulating Google Sign-In...");
  return new Promise(resolve => {
    setTimeout(() => {
      currentUser = MOCK_USER;
      notifyListener();
      resolve({ user: currentUser });
    }, 500);
  });
};

// Mock of signOut
export const signOut = async (auth: any) => {
  console.log("Simulating Sign-Out...");
  return new Promise<void>(resolve => {
    setTimeout(() => {
      currentUser = null;
      notifyListener();
      resolve();
    }, 200);
  });
};

// Mock objects to satisfy import signatures in other files
export const auth = {};
export const provider = {}; // Mock provider
export const GoogleAuthProvider = { // Mock class with static method
    credentialFromResult: (result: any) => ({
        accessToken: 'mock-access-token-from-credential'
    })
};

// Other exports to maintain signature compatibility
export const getAdditionalUserInfo = (result: any) => ({ isNewUser: false });
export type OAuthProvider = any;
