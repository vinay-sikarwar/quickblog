import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { assets } from '../assets/assets';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { BlogDetailSkeleton, CommentSkeleton } from '../components/SkeletonLoader';
import { blogService } from '../services/blogService';
import { commentService } from '../services/commentService';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Moment from 'moment';

const BlogDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    
    const [blog, setBlog] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [commentsLoading, setCommentsLoading] = useState(true);
    const [commentText, setCommentText] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);

    useEffect(() => {
        const fetchBlog = async () => {
            const result = await blogService.getBlogById(id);
            if (result.success) {
                setBlog(result.blog);
            } else {
                toast.error('Blog not found');
            }
            setLoading(false);
        };

        fetchBlog();
    }, [id]);

    useEffect(() => {
        if (id) {
            // Subscribe to real-time comments
            const unsubscribe = commentService.subscribeToCommentsRealtime(id, (commentsData) => {
                setComments(commentsData);
                setCommentsLoading(false);
            });

            return () => unsubscribe();
        }
    }, [id]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        
        if (!user) {
            toast.error('Please login to comment');
            return;
        }

        if (!commentText.trim()) {
            toast.error('Please enter a comment');
            return;
        }

        setSubmittingComment(true);

        const commentData = {
            text: commentText,
            userId: user.uid,
            userEmail: user.email
        };

        const result = await commentService.addComment(id, commentData);
        
        if (result.success) {
            setCommentText('');
            toast.success('Comment added successfully!');
        } else {
            toast.error(result.error || 'Failed to add comment');
        }

        setSubmittingComment(false);
    };

    if (loading) {
        return (
            <div className='relative'>
                <img src={assets.gradientBackground} alt="" className='absolute -top-50 -z-1 opacity-50' />
                <Navbar />
                <BlogDetailSkeleton />
                <Footer />
            </div>
        );
    }

    if (!blog) {
        return (
            <div className='relative'>
                <Navbar />
                <div className='flex justify-center items-center h-96'>
                    <p className='text-xl text-gray-500'>Blog not found</p>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className='relative'>
            <img src={assets.gradientBackground} alt="" className='absolute -top-50 -z-1 opacity-50' />
            <Navbar />
            
            <div className='text-center mt-20 text-gray-600'>
                <p className='text-primary py-4 font-medium'>
                    Published on {Moment(blog.createdAt).format('MMMM Do, YYYY')}
                </p>
                <h1 className='text-2xl sm:text-5xl font-semibold max-w-2xl mx-auto text-gray-800'>
                    {blog.title}
                </h1>
                <h2 className='my-5 max-w-lg mx-auto text-gray-600'>
                    {blog.subTitle}
                </h2>
                <p className='inline-block py-1 px-4 rounded-full mb-6 border text-sm border-primary/35 bg-primary/5 font-medium text-primary'>
                    {blog.author}
                </p>
            </div>
            
            <div className='mx-5 max-w-5xl md:mx-auto my-10 mt-6'>
                <img src={blog.imageURL} alt={blog.title} className='rounded-3xl mb-5 w-full object-cover' />
                <div 
                    dangerouslySetInnerHTML={{ '__html': blog.description }} 
                    className='rich-text max-w-3xl mx-auto'
                ></div>
                
                {/* Comments Section */}
                <div className='mt-14 mb-10 max-w-3xl mx-auto'>
                    <p className='font-semibold mb-4'>Comments ({comments.length})</p>
                    
                    {commentsLoading ? (
                        <div className='flex flex-col gap-4'>
                            {Array(3).fill(0).map((_, index) => (
                                <CommentSkeleton key={index} />
                            ))}
                        </div>
                    ) : (
                        <div className='flex flex-col gap-4'>
                            {comments.map((comment) => (
                                <div key={comment.id} className='relative bg-primary/2 border border-primary/5 max-w-xl rounded p-4 text-gray-600'>
                                    <div className='flex items-center gap-2 mb-2'>
                                        <img src={assets.user_icon} alt="" className='w-6' />
                                        <p className='font-medium'>{comment.userEmail}</p>
                                    </div>
                                    <p className='text-sm max-w-md ml-8'>{comment.text}</p>
                                    <div className='absolute right-4 bottom-3 flex items-center gap-2 text-xs'>
                                        {Moment(comment.createdAt).fromNow()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                
                {/* Add Comment Form */}
                <div className='max-w-3xl mx-auto'>
                    <p className='font-semibold mb-4'>Add your comment</p>
                    {user ? (
                        <form onSubmit={handleCommentSubmit} className='flex flex-col items-start gap-4 max-w-lg'>
                            <textarea 
                                placeholder='Write your comment...' 
                                required 
                                className='w-full p-2 border border-gray-300 rounded outline-none h-32' 
                                onChange={(e) => setCommentText(e.target.value)} 
                                value={commentText}
                            ></textarea>
                            <button 
                                type="submit" 
                                disabled={submittingComment}
                                className='bg-primary text-white rounded p-2 px-3 hover:scale-102 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                {submittingComment ? 'Submitting...' : 'Submit Comment'}
                            </button>
                        </form>
                    ) : (
                        <div className='bg-gray-100 p-4 rounded-lg max-w-lg'>
                            <p className='text-gray-600 mb-2'>Please login to add a comment</p>
                            <button 
                                onClick={() => window.location.href = '/login'}
                                className='bg-primary text-white rounded p-2 px-4 hover:bg-primary/90 transition-all'
                            >
                                Login
                            </button>
                        </div>
                    )}
                </div>
                
                {/* Share Section */}
                <div className='my-24 max-w-3xl mx-auto'>
                    <p className='font-semibold my-4'>Share this article on social media</p>
                    <div className='flex'>
                        <img src={assets.facebook_icon} alt="" width={50} className='cursor-pointer hover:scale-110 transition-all' />
                        <img src={assets.twitter_icon} alt="" width={50} className='cursor-pointer hover:scale-110 transition-all' />
                        <img src={assets.googleplus_icon} alt="" width={50} className='cursor-pointer hover:scale-110 transition-all' />
                    </div>
                </div>
            </div>
            
            <Footer />
        </div>
    );
};

export default BlogDetail;