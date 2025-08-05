import React from "react";

const NewsLetter = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-2 px-4 sm:px-6 md:px-0 my-20 sm:my-28">
      {/* Heading */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
        Never Miss a Blog!
      </h1>

      {/* Subtext */}
      <p className="text-sm sm:text-base md:text-lg text-gray-500/80 max-w-xl">
        Subscribe to get the latest blogs, tech updates, and exclusive news.
      </p>

      {/* Subscription Form */}
      <form className="flex flex-col sm:flex-row items-center w-full max-w-2xl mt-6 gap-3 sm:gap-0">
        <input
          type="email"
          placeholder="Enter your email"
          required
          className="w-full sm:w-[70%] h-12 px-4 text-sm border border-gray-300 rounded-md sm:rounded-r-none outline-none text-gray-700"
        />
        <button
          type="submit"
          className="w-full sm:w-auto h-12 px-8 sm:px-12 text-sm text-white bg-primary hover:bg-primary/90 transition-all rounded-md sm:rounded-l-none"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
};

export default NewsLetter;
