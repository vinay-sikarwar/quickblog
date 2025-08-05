import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase/config";

export const commentService = {
  // Add comment to a blog
  async addComment(blogId, commentData) {
    try {
      const commentsRef = collection(db, "blogs", blogId, "comments");
      const docRef = await addDoc(commentsRef, {
        ...commentData,
        timestamp: serverTimestamp(),
        createdAt: new Date().toISOString(),
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error("Error adding comment:", error);
      return { success: false, error: error.message };
    }
  }, // Get comments for a blog

  async getComments(blogId) {
    try {
      const commentsRef = collection(db, "blogs", blogId, "comments"); // Corrected query to use 'createdAt'
      const q = query(commentsRef, orderBy("createdAt", "asc"));
      const querySnapshot = await getDocs(q);
      const comments = [];
      querySnapshot.forEach((doc) => {
        comments.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, comments };
    } catch (error) {
      console.error("Error fetching comments:", error);
      return { success: false, error: error.message };
    }
  }, // Subscribe to real-time comments

  subscribeToCommentsRealtime(blogId, callback) {
    const commentsRef = collection(db, "blogs", blogId, "comments"); // Corrected query to use 'createdAt'
    const q = query(commentsRef, orderBy("createdAt", "asc"));
    return onSnapshot(q, (querySnapshot) => {
      const comments = [];
      querySnapshot.forEach((doc) => {
        comments.push({ id: doc.id, ...doc.data() });
      });
      callback(comments);
    });
  },
};
