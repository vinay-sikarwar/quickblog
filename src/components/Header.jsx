import React, { useState, useEffect, useRef } from "react";
import { assets } from "../assets/assets";
import { blogService } from "../services/blogService";
import toast from "react-hot-toast";

const Header = ({ setSearchQuery }) => {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [allBlogs, setAllBlogs] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const debounceTimeout = useRef(null);

  // Fetch blogs on mount
  useEffect(() => {
    const fetchAllBlogs = async () => {
      const response = await blogService.getAllBlogs();
      if (response.success) {
        const publishedBlogs = response.blogs.filter(blog => blog.isPublished);
        setAllBlogs(publishedBlogs);
      } else {
        toast.error("Failed to load blogs for search.");
      }
    };
    fetchAllBlogs();
  }, []);

  // Debounce logic
  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      if (input.trim() === "") {
        setSuggestions([]);
        return;
      }

      setIsSearching(true);
      const filtered = allBlogs
        .filter(blog => blog.title.toLowerCase().includes(input.toLowerCase()))
        .slice(0, 5);

      setSuggestions(filtered);
      setIsSearching(false);
    }, 300);

    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [input, allBlogs]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(input);
    setSuggestions([]);
  };

  const handleSuggestionClick = (title) => {
    setInput(title);
    setSearchQuery(title);
    setSuggestions([]);
  };

  return (
    <div className="relative px-4 sm:px-8 xl:px-24 overflow-hidden">
      <div className="text-center mt-20 mb-8 relative z-10">
        {/* Notification */}
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 border border-primary/40 bg-primary/10 rounded-full text-xs sm:text-sm text-primary whitespace-nowrap">
          <p>New: AI feature integrated</p>
          <img src={assets.star_icon} alt="" className="w-3" />
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-5xl md:text-6xl font-semibold text-gray-700 leading-tight sm:leading-[4.2rem]">
          Your own <span className="text-primary">blogging</span>
          <br />
          platform.
        </h1>

        {/* Description */}
        <p className="my-5 sm:my-8 max-w-sm sm:max-w-md md:max-w-xl lg:max-w-2xl mx-auto text-gray-500 text-sm sm:text-base text-center">
          This is your space to think out loud, to share what matters, and to
          write without filters. Whether it’s one word or a thousand. Your story
          starts right here.
        </p>

        {/* Search */}
        <form
          onSubmit={handleSubmit}
          className="relative max-w-lg mx-auto max-sm:scale-90"
        >
          <div className="flex border border-gray-300 bg-white rounded overflow-hidden">
            <input
              type="text"
              placeholder="Search for blogs"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full pl-4 py-2 text-sm sm:text-base outline-none"
            />
            <button
              type="submit"
              className="bg-primary text-white px-5 py-2 sm:px-6 hover:scale-105 transition-all"
            >
              Search
            </button>
          </div>

          {/* Dropdown */}
          {(suggestions.length > 0 || isSearching) && (
            <ul className="absolute left-0 right-0 z-20 bg-white border border-gray-200 rounded shadow-md mt-1 text-left max-h-48 overflow-y-auto text-sm">
              {isSearching ? (
                <li className="px-4 py-2 text-center text-gray-500">
                  Searching...
                </li>
              ) : suggestions.length > 0 ? (
                suggestions.map((blog) => (
                  <li
                    key={blog.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSuggestionClick(blog.title)}
                  >
                    {blog.title}
                  </li>
                ))
              ) : (
                <li className="px-4 py-2 text-center text-gray-500">
                  No suggestions found.
                </li>
              )}
            </ul>
          )}
        </form>
      </div>

      {/* Gradient Background */}
      <img
        src={assets.gradientBackground}
        alt=""
        className="absolute top-0 left-0 w-full h-auto max-w-[1000px] -z-10 opacity-40 pointer-events-none"
      />
    </div>
  );
};

export default Header;
