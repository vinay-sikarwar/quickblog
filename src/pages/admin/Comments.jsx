import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase/config";
import { assets } from "../../assets/assets";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext"; // 1. Import useAuth hook
import { blogService } from "../../services/blogService"; // Import blogService to get user-specific blogs

const Comments = () => {
  const { user } = useAuth(); // 2. Get the current user
  const [allComments, setAllComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    try {
      // 3. If there is no user, stop and show a message
      if (!user) {
        setLoading(false);
        toast.error("Please log in to view your comments.");
        return;
      }

      // 4. Get only the blogs created by the current user
      const blogsResult = await blogService.getUserBlogs(user.uid);
      if (!blogsResult.success) {
        toast.error(blogsResult.error);
        setLoading(false);
        return;
      }

      const allComments = [];

      // 5. For each of the user's blogs, get its comments
      for (const blog of blogsResult.blogs) {
        const commentsRef = collection(db, "blogs", blog.id, "comments");
        const commentsQuery = query(commentsRef, orderBy("createdAt", "desc")); // Corrected orderBy field
        const commentsSnapshot = await getDocs(commentsQuery);

        commentsSnapshot.forEach((commentDoc) => {
          allComments.push({
            id: commentDoc.id,
            blogId: blog.id,
            blogTitle: blog.title,
            ...commentDoc.data(),
          });
        });
      }

      setAllComments(allComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to fetch comments");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchComments();
  }, [user]); // Add user to the dependency array

  return (
    <>
      <div className="flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 bg-blue-50/50">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">My Comments</h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-primary border-gray-200"></div>
          </div>
        ) : allComments.length > 0 ? (
          <div className="relative max-w-6xl overflow-x-auto mt-4 bg-white shadow rounded-lg scrollbar-hide">
            <table className="w-full text-sm text-gray-500">
              <thead className="text-xs text-gray-700 text-left uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    #
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Blog Title
                  </th>
                  <th scope="col" className="px-6 py-3">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Comment
                  </th>
                  <th scope="col" className="px-6 py-3 max-sm:hidden">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {allComments.map((comment, index) => (
                  <tr
                    key={comment.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {comment.blogTitle}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <img
                          src={assets.user_icon}
                          alt=""
                          className="w-6 h-6"
                        />
                        <span className="text-sm">{comment.userEmail}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <p className="text-sm text-gray-600 truncate">
                        {comment.text}
                      </p>
                    </td>
                    <td className="px-6 py-4 max-sm:hidden text-xs">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">No comments yet.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Comments;
