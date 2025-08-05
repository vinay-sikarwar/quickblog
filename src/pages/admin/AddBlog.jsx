import React, { useEffect, useRef, useState } from "react";
import { assets } from "../../assets/assets";
import { useAuth } from "../../context/AuthContext";
import { blogService } from "../../services/blogService";
import toast from "react-hot-toast";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const AddBlog = () => {
  const { user } = useAuth();

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  // Correctly declared state variables
  const [imageURL, setImageURL] = useState("");
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [category, setCategory] = useState("Technology");
  const [isPublished, setIsPublished] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const blogCategories = [
    "Technology",
    "Startup",
    "Lifestyle",
    "Finance",
    "Health",
    "Travel",
  ];

  

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!title || !subTitle || !imageURL || !category) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!quillRef.current) {
      toast.error("Please add blog content");
      return;
    }

    const content = quillRef.current.root.innerHTML;
    if (
      content.trim() === "<p><br></p>" ||
      content.trim() === "" ||
      content.trim() === "<p>Write your blog content here...</p>"
    ) {
      toast.error("Please add blog content");
      return;
    }

    // Check if the user is logged in
    if (!user) {
      toast.error("You must be logged in to create a blog.");
      return;
    }

    setIsLoading(true);

    const blogData = {
      title,
      subTitle,
      description: content,
      category,
      imageURL,
      isPublished,
      author: user.email, // 👈 Add this line
    };


    // Corrected call: Pass blogData and the user.uid
    const result = await blogService.createBlog(blogData, user.uid);

    if (result.success) {
      toast.success("Blog created successfully!");
      setTitle("");
      setSubTitle("");
      setImageURL("");
      setCategory("Technology");
      setIsPublished(true);
      if (quillRef.current) {
        quillRef.current.setText("");
      }
    } else {
      toast.error(result.error || "Failed to create blog");
    }

    setIsLoading(false);
  };

  const generateContent = async () => {
    // 1. Input validation for the prompt
    if (!title || !subTitle) {
      toast.error("Please add a blog title and subtitle to generate content.");
      return;
    }

    if (!quillRef.current) {
      toast.error("Editor not ready.");
      return;
    }

    const loadingToast = toast.loading("Generating content with AI...");
    setIsLoading(true);

    try {
      // 2. Construct the prompt for the Gemini API
      // We are now asking the AI to *only* provide the body content.
      const prompt = `Write a comprehensive blog post based on the following title and subtitle.
      The content should be in rich text format (HTML) and structured with paragraphs and headings. Do not include <html> or <body> tags.
      
      Title: ${title}
      Subtitle: ${subTitle}`;

      // 3. Get the API key from the environment variable
      const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

      // 4. Make the API call to Google's Gemini API
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
          }),
        }
      );

      // 5. Handle the API response
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error.message || "Failed to generate content from AI."
        );
      }

      // 6. Extract the generated text from the response
      const generatedText = data.candidates[0].content.parts[0].text;

      // 7. Use the correct Quill method to insert the HTML content
      // We use dangerouslyPasteHTML to insert the HTML string directly.
      const range = quillRef.current.getSelection();
      const index = range ? range.index : 0;
      quillRef.current.clipboard.dangerouslyPasteHTML(index, generatedText);

      toast.dismiss(loadingToast);
      toast.success("Content generated successfully!");
    } catch (error) {
      console.error("Gemini API Error:", error);
      toast.dismiss(loadingToast);
      toast.error(error.message || "Failed to generate AI content.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["blockquote", "code-block"],
            ["link"],
            ["clean"],
          ],
        },
        placeholder: "Write your blog content here...",
      });
    }
  }, []);

  return (
    <div className="flex-1 bg-blue-50/50 text-gray-600 h-full overflow-auto">
      <div className="bg-white w-full max-w-4xl p-4 md:p-10 sm:m-10 shadow rounded">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Create New Blog
        </h1>

        <form onSubmit={onSubmitHandler} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blog Image URL
            </label>
            <input
              type="url"
              placeholder="Paste image URL (e.g., from Pexels)"
              required
              className="w-full max-w-lg p-3 border border-gray-300 outline-none rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              onChange={(e) => setImageURL(e.target.value)}
              value={imageURL}
            />
            {imageURL && (
              <img
                src={imageURL}
                alt="Preview"
                className="mt-3 h-32 w-48 object-cover rounded-md border"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blog Title
            </label>
            <input
              type="text"
              placeholder="Enter blog title"
              required
              className="w-full max-w-lg p-3 border border-gray-300 outline-none rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sub Title
            </label>
            <input
              type="text"
              placeholder="Enter blog subtitle"
              required
              className="w-full max-w-lg p-3 border border-gray-300 outline-none rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              onChange={(e) => setSubTitle(e.target.value)}
              value={subTitle}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blog Category
            </label>
            <select
              name="category"
              className="p-3 border border-gray-300 outline-none rounded-md focus:ring-2 focus:ring-primary focus:border-transparent text-gray-700"
              onChange={(e) => setCategory(e.target.value)}
              value={category}
            >
              {blogCategories.map((item, index) => (
                <option value={item} key={index}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blog Content
            </label>
            <div className="relative">
              <div
                ref={editorRef}
                className="bg-white border border-gray-300 rounded-md"
                style={{ minHeight: "300px" }}
              ></div>
              <button
                type="button"
                onClick={generateContent} // This now calls the API
                disabled={isLoading}
                className="absolute bottom-3 right-3 text-xs text-white bg-black/70 px-4 py-2 rounded hover:bg-black/80 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Generating..." : "Generate with AI"}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="publish"
              checked={isPublished}
              className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary cursor-pointer"
              onChange={(e) => setIsPublished(e.target.checked)}
            />
            <label
              htmlFor="publish"
              className="text-sm font-medium text-gray-700 cursor-pointer"
            >
              Publish Now
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full max-w-xs bg-primary text-white py-3 px-6 rounded-md cursor-pointer text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating..." : "Create Blog"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBlog;
