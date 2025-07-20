import React from 'react';

export const BlogCardSkeleton = () => {
  return (
    <div className="w-full rounded-lg overflow-hidden shadow animate-pulse">
      <div className="aspect-video bg-gray-300"></div>
      <div className="p-5">
        <div className="h-4 bg-gray-300 rounded w-20 mb-4"></div>
        <div className="h-6 bg-gray-300 rounded mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-3"></div>
        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
      </div>
    </div>
  );
};

export const BlogDetailSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="text-center mt-20">
        <div className="h-4 bg-gray-300 rounded w-32 mx-auto mb-4"></div>
        <div className="h-12 bg-gray-300 rounded w-3/4 mx-auto mb-4"></div>
        <div className="h-6 bg-gray-300 rounded w-1/2 mx-auto mb-6"></div>
        <div className="h-8 bg-gray-300 rounded w-40 mx-auto"></div>
      </div>
      <div className="mx-5 max-w-5xl md:mx-auto my-10">
        <div className="aspect-video bg-gray-300 rounded-3xl mb-5"></div>
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="h-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          <div className="h-4 bg-gray-300 rounded w-4/6"></div>
          <div className="h-4 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export const CommentSkeleton = () => {
  return (
    <div className="bg-primary/2 border border-primary/5 max-w-xl rounded p-4 animate-pulse">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
        <div className="h-4 bg-gray-300 rounded w-24"></div>
      </div>
      <div className="ml-8 space-y-2">
        <div className="h-3 bg-gray-300 rounded"></div>
        <div className="h-3 bg-gray-300 rounded w-3/4"></div>
      </div>
    </div>
  );
};