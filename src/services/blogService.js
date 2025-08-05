import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase/config"; // 'auth' is no longer needed here

export const blogService = {
  // Create a new blog
  async createBlog(blogData, userId) {
    try {
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const docRef = await addDoc(collection(db, "blogs"), {
        ...blogData,
        userId: userId, // 🔐 Required for ownership and Firestore rules
        timestamp: serverTimestamp(),
        createdAt: new Date().toISOString(),
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error("Error creating blog:", error);
      return { success: false, error: error.message };
    }
  },

  // Get blogs for a specific user
  async getUserBlogs(userId) {
    try {
      if (!userId) {
        return { success: false, error: "User ID is required to fetch blogs" };
      }

      const q = query(
        collection(db, "blogs"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc") // Corrected: removed the trailing space
      );
      const querySnapshot = await getDocs(q);
      const blogs = [];
      querySnapshot.forEach((doc) => {
        blogs.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, blogs };
    } catch (error) {
      console.error("Error fetching user blogs:", error);
      return { success: false, error: error.message };
    }
  },

  // Get all blogs (for public viewing or admin)
  async getAllBlogs() {
    try {
      const q = query(
        collection(db, "blogs"),
        orderBy("createdAt", "desc") // Corrected: removed the trailing space
      );
      const querySnapshot = await getDocs(q);
      const blogs = [];
      querySnapshot.forEach((doc) => {
        blogs.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, blogs };
    } catch (error) {
      console.error("Error fetching all blogs:", error);
      return { success: false, error: error.message };
    }
  },

  // Get blogs with real-time updates (e.g., for public-facing home page)
  subscribeToBlogsRealtime(callback) {
    const q = query(
      collection(db, "blogs"),
      orderBy("createdAt", "desc") // Corrected: removed the trailing space
    );
    return onSnapshot(q, (querySnapshot) => {
      const blogs = [];
      querySnapshot.forEach((doc) => {
        blogs.push({ id: doc.id, ...doc.data() });
      });
      callback(blogs);
    });
  },

  // Get a single blog by ID
  async getBlogById(id) {
    try {
      const docRef = doc(db, "blogs", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { success: true, blog: { id: docSnap.id, ...docSnap.data() } };
      } else {
        return { success: false, error: "Blog not found" };
      }
    } catch (error) {
      console.error("Error fetching blog:", error);
      return { success: false, error: error.message };
    }
  },

  // Delete blog
  async deleteBlog(id) {
    try {
      await deleteDoc(doc(db, "blogs", id));
      return { success: true };
    } catch (error) {
      console.error("Error deleting blog:", error);
      return { success: false, error: error.message };
    }
  },

  // Update blog
  async updateBlog(id, blogData) {
    try {
      const docRef = doc(db, "blogs", id);
      await updateDoc(docRef, {
        ...blogData,
        updatedAt: serverTimestamp(),
      });
      return { success: true };
    } catch (error) {
      console.error("Error updating blog:", error);
      return { success: false, error: error.message };
    }
  },
};
