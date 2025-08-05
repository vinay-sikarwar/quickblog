import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import BlogCard from "./BlogCard";
import { blogService } from "../services/blogService";
import { BlogCardSkeleton } from "./SkeletonLoader";

const BlogList = ({ searchQuery }) => {
  const [menu, setMenu] = useState("All");
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 6;

  const blogCategories = [
    "All",
    "Technology",
    "Startup",
    "Lifestyle",
    "Finance",
    "Health",
    "Travel",
  ];

  useEffect(() => {
    const unsubscribe = blogService.subscribeToBlogsRealtime((blogsData) => {
      const publishedBlogs = blogsData.filter((blog) => blog.isPublished);
      setBlogs(publishedBlogs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredBlogs = blogs
    .filter((blog) =>
      blog.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((blog) => (menu === "All" ? true : blog.category === menu));

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="w-full">
      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-3 sm:gap-5 px-4 sm:px-0 my-8 sm:my-10 overflow-x-auto scrollbar-hide">
        {blogCategories.map((item) => (
          <div key={item} className="relative">
            <button
              className={`cursor-pointer text-sm sm:text-base text-gray-500 font-medium relative px-2 sm:px-3 py-1 rounded-full transition-all ${
                menu === item && "text-white bg-primary"
              }`}
              onClick={() => {
                setMenu(item);
                setCurrentPage(1);
              }}
            >
              {item}
              {menu === item && (
                <motion.div
                  layoutId="underline"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="absolute inset-0 -z-10 bg-primary rounded-full"
                />
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-3 sm:px-8 xl:px-32 mb-12">
        {loading
          ? Array(6)
              .fill(0)
              .map((_, index) => <BlogCardSkeleton key={index} />)
          : currentBlogs.map((blog) => <BlogCard key={blog.id} blog={blog} />)}
      </div>

      {/* Pagination */}
      {!loading && filteredBlogs.length > 0 && (
        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 mb-20 px-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-primary text-white px-3 py-1.5 rounded-full text-sm disabled:opacity-50"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1.5 rounded-full text-sm ${
                currentPage === page
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="bg-primary text-white px-3 py-1.5 rounded-full text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* No Results */}
      {!loading && filteredBlogs.length === 0 && (
        <div className="text-center py-16 sm:py-24">
          <p className="text-gray-500 text-lg">No blogs found.</p>
          <p className="text-gray-400 text-sm">
            Try a different search or category.
          </p>
        </div>
      )}
    </div>
  );
};

export default BlogList;
