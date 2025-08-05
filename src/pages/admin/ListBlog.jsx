import React, { useEffect, useState, useCallback } from "react";
import { blogService } from "../../services/blogService";
import toast from "react-hot-toast";
import { assets } from "../../assets/assets";
import { useAuth } from "../../context/AuthContext";

const ListBlog = () => {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = useCallback(async () => {
    try {
      if (!user) {
        setLoading(false);
        return;
      }

      const result = await blogService.getUserBlogs(user.uid);

      if (result.success) {
        setBlogs(result.blogs);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("An error occurred while fetching blogs");
    } finally {
      setLoading(false);
    }
  }, [user]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      const result = await blogService.deleteBlog(id);
      if (result.success) {
        toast.success("Blog deleted successfully");
        fetchBlogs();
      } else {
        toast.error(result.error || "Failed to delete blog");
      }
    }
  };

  const handleTogglePublish = async (id, currentStatus) => {
    const result = await blogService.updateBlog(id, {
      isPublished: !currentStatus,
    });
    if (result.success) {
      toast.success(
        `Blog ${!currentStatus ? "published" : "unpublished"} successfully`
      );
      fetchBlogs();
    } else {
      toast.error(result.error || "Failed to update blog status");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  return (
    <div className="flex-1 pt-6 px-4 sm:px-6 md:px-10 bg-blue-50/50 min-h-[calc(100vh-70px)]">
      <h1 className="text-xl font-semibold text-gray-700 mb-4">My Blogs</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-primary border-gray-200"></div>
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">
            No blogs found. Create your first blog!
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md shadow bg-white">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-100 text-xs uppercase text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Image</th>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left hidden sm:table-cell">
                  Date
                </th>
                <th className="px-4 py-3 text-left hidden sm:table-cell">
                  Status
                </th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog, index) => (
                <tr
                  key={blog.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-4 py-4">{index + 1}</td>
                  <td className="px-4 py-4">
                    <img
                      src={blog.imageURL}
                      alt={blog.title}
                      className="w-16 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="px-4 py-4 max-w-xs">
                    <div className="font-medium text-gray-900 truncate">
                      {blog.title}
                    </div>
                    <div className="text-gray-500 text-xs truncate">
                      {blog.subTitle}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      {blog.category}
                    </span>
                  </td>
                  <td className="px-4 py-4 hidden sm:table-cell text-xs">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4 hidden sm:table-cell">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        blog.isPublished
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {blog.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() =>
                          handleTogglePublish(blog.id, blog.isPublished)
                        }
                        className="text-xs px-3 py-1 border rounded hover:bg-gray-50 transition-all"
                      >
                        {blog.isPublished ? "Unpublish" : "Publish"}
                      </button>
                      <button
                        onClick={() => handleDelete(blog.id)}
                        className="text-red-600 hover:text-red-800 transition-all"
                      >
                        <img
                          src={assets.cross_icon}
                          alt="Delete"
                          className="w-4 h-4"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ListBlog;
