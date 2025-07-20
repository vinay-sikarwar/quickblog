import React, { useState, useEffect } from 'react'
import { motion } from "motion/react"
import BlogCard from './BlogCard'
import { blogService } from '../services/blogService'
import { BlogCardSkeleton } from './SkeletonLoader'

const BlogList = () => {
    const [menu,setMenu] = useState('All')
    const [blogs, setBlogs] = useState([])
    const [loading, setLoading] = useState(true)
    
    const blogCategories = ['All', 'Technology', 'Startup', 'Lifestyle', 'Finance', 'Health', 'Travel']

    useEffect(() => {
        // Subscribe to real-time blog updates
        const unsubscribe = blogService.subscribeToBlogsRealtime((blogsData) => {
            // Filter only published blogs
            const publishedBlogs = blogsData.filter(blog => blog.isPublished);
            setBlogs(publishedBlogs);
            setLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    return (
    <>
        <div>
            <div className='flex justify-center gap-4 sm:gap-8 my-10 relative'>
                {blogCategories.map((item)=>(
                    <div key={item} className='relative'>
                        <button className={`cursor-pointer text-gray-500 ${menu === item && 'text-white px-4 pt-0.5'}`} onClick={()=>setMenu(item)}>
                            {item}
                            {menu === item && (
                                <motion.div 
                                    layoutId='underline' 
                                    transition={{type: 'spring', stiffness: 500, damping: 30}} 
                                    className='absolute left-0 right-0 top-0 h-7 -z-1 bg-primary rounded-full'
                                ></motion.div>
                            )}
                        </button>
                    </div>
                ))}
            </div>
            
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 mb-24 mx-8 sm:mx-16 xl:mx-40'>
                {loading ? (
                    // Show skeleton loaders while loading
                    Array(8).fill(0).map((_, index) => (
                        <BlogCardSkeleton key={index} />
                    ))
                ) : (
                    blogs
                        .filter((blog) => menu === "All" ? true : blog.category === menu)
                        .map((blog) => <BlogCard key={blog.id} blog={blog} />)
                )}
            </div>
            
            {!loading && blogs.length === 0 && (
                <div className='text-center py-20'>
                    <p className='text-gray-500 text-lg'>No blogs found. Check back later!</p>
                </div>
            )}
        </div>
    </>
)
}

export default BlogList