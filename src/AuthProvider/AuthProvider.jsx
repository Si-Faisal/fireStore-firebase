import { createContext, useEffect, useState } from "react";
import { GoogleAuthProvider, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import { getFirestore, collection, addDoc, doc, setDoc , getDoc,updateDoc, serverTimestamp, getDocs, initializeFirestore, query, onSnapshot} from 'firebase/firestore'; 
import 'firebase/analytics'; 

// Required for side-effects
import "firebase/firestore";


import {app} from '../Firebase/Firebase.config';

const db = getFirestore(app);



export const AuthContext = createContext(null);


//   project id
// firebase-adminsdk-bmvkm@my-firebase-project-6aa3a.iam.gserviceaccount.com
const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [taskFromDB , setTaskDB] = useState([]);
    const [dbUsers, setDbUser] = useState([]);
    const googleProvider = new GoogleAuthProvider();

    const auth = getAuth(app);



    
  
    // Authentication start..........
    const createUser = async (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password) 

    }

    const googleSignIn = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider);
    }

    const signIn = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    }

    const logOut = () => {
        setLoading(true);
        setUser(null);
        return signOut(auth);
    }

    const updateUserProfile = (name, photo) => {
        return updateProfile(auth.currentUser, {
            displayName: name, photoURL: photo
        });
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, currentUser => {
            setUser(currentUser);
            console.log('current user', currentUser);
            setLoading(false);
        });
        return () => {
            return unsubscribe();
        }
    }, [])


    // authentication end....

    //  FireStore Db Start......

    //  database  start
    
  
      console.log(dbUsers);
    useEffect(()=>{
        const unscribe = onSnapshot(collection(db, "users"), (snapshot)=>{
          const DatabaseUsers = snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }));
          setDbUser(DatabaseUsers);

       })
 
       const unscribetask = onSnapshot(collection(db, "task"), (snapshot)=>{
         const DBTask = snapshot.docs.map((doc) =>  ({ id: doc.id, data: doc.data() }))
         setTaskDB(DBTask)
       });
 
       return unscribe;
     },[])
     

    


    //  FireStore Db End......

    const AuthDetails = {
        user,
        loading,
        createUser,
        googleSignIn,
        signIn,
        logOut,
        updateUserProfile,
        setUser,
        taskFromDB,
        dbUsers
    }

    return (
        <AuthContext.Provider value={AuthDetails}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;