import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

export async function uploadImageToStorage(
  blob: Blob,
  filename: string,
  folder: string = 'blog-images'
): Promise<string> {
  try {
    const storageRef = ref(storage, `${folder}/${filename}`);
    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading to Firebase Storage:', error);
    throw error;
  }
}
