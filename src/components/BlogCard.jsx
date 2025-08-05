import React from 'react'
import { useNavigate } from 'react-router-dom'

const BlogCard = ({blog}) => {

    const {title, description, category, imageURL, id, subTitle} = blog
    const navigate = useNavigate()

    // Function to strip HTML tags and get plain text
    const getPlainText = (html) => {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.textContent || div.innerText || '';
    };

    return (
      <>
        <div
          onClick={() => navigate(`/blogs/${id}`)}
          className="w-full rounded-lg overflow-hidden shadow hover:scale-102 hover:shadow-primary/25 duration-300 cursor-pointer"
        >
          <img
            src={imageURL}
            alt={title}
            className="aspect-video object-cover w-full h-40 sm:h-auto"
          />
          <span className="ml-4 sm:ml-5 mt-3 sm:mt-4 px-2.5 sm:px-3 py-0.5 sm:py-1 inline-block bg-primary/20 rounded-full text-primary text-[10px] sm:text-xs">
            {category}
          </span>
          <div className="p-4 sm:p-5">
            <h5 className="mb-1.5 sm:mb-2 font-medium text-gray-900 text-sm sm:text-base line-clamp-2">
              {title}
            </h5>
            <p className="mb-2 sm:mb-3 text-[11px] sm:text-xs text-gray-600 line-clamp-3">
              {subTitle || getPlainText(description).slice(0, 100)}...
            </p>
          </div>
        </div>
      </>
    );
}

export default BlogCard