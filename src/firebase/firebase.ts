import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager, doc, setDoc, getDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
    prompt: 'select_account'
});

const db = initializeFirestore(app, {
    localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager()
    })
});

export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            await setDoc(userRef, {
                uid: user.uid,
                email: user.email,
                name: user.displayName,
                photoURL: user.photoURL,
                createdAt: new Date(),
                budgetData: {
                    salary: 0,
                    categories: [
                        { id: '1', name: 'Rent', allocation: 0, expenses: [] },
                        { id: '2', name: 'Home', allocation: 0, expenses: [] },
                        { id: '3', name: 'Food Order', allocation: 0, expenses: [] },
                        { id: '4', name: 'Grocery', allocation: 0, expenses: [] },
                        { id: '5', name: 'Shopping', allocation: 0, expenses: [] },
                        { id: '6', name: 'Subscription', allocation: 0, expenses: [] },
                        { id: '7', name: 'Misc', allocation: 0, expenses: [] },
                    ],
                },
            });
        }
        return user;
    } catch (error) {
        console.error("Google Sign-in Error:", error);
        throw error;
    }
};

export const logout = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Logout Error:", error);
        throw error;
    }
};

export const authStateListener = (callback) => {
    return onAuthStateChanged(auth, callback);
};

export { auth, db };
