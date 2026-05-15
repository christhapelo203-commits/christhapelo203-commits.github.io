import { 
  OperationType, 
  handleFirestoreError 
} from '../lib/errorHandlers';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  onSnapshot, 
  where,
  serverTimestamp,
  type DocumentData,
  type QueryConstraint
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export async function createDocument<T extends DocumentData>(
  collectionName: string, 
  data: Omit<T, 'id'>
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, collectionName);
    throw error;
  }
}

export async function setDocument<T extends DocumentData>(
  collectionName: string, 
  id: string, 
  data: T
): Promise<void> {
  try {
    await setDoc(doc(db, collectionName, id), {
      ...data,
      createdAt: data.createdAt || serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${collectionName}/${id}`);
    throw error;
  }
}

export async function getDocument<T>(collectionName: string, id: string): Promise<T | null> {
  try {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as T : null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `${collectionName}/${id}`);
    throw error;
  }
}

export async function listDocuments<T>(
  collectionName: string, 
  constraints: QueryConstraint[] = []
): Promise<T[]> {
  try {
    const q = query(collection(db, collectionName), ...constraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, collectionName);
    throw error;
  }
}

export function subscribeToDocuments<T>(
  collectionName: string, 
  constraints: QueryConstraint[], 
  callback: (data: T[]) => void
) {
  const q = query(collection(db, collectionName), ...constraints);
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
    callback(data);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, collectionName);
  });
}
