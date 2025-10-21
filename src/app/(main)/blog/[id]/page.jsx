"use client";

import { useParams, useRouter } from "next/navigation";
import { Clock, Calendar, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import {
  useGetAllBlogsQuery,
  useGetSingleBlogQuery,
} from "@/redux/features/Blog/Blog.api";
import BlogCard from "../_components/BlogCard";
import DynamicMetaTags from "@/components/shared/DynamicMetaTags";
import SocialShare from "@/components/shared/SocialShare";

export default function BlogDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: blog, isLoading, isError } = useGetSingleBlogQuery(id);
  const { data: allBlogs = [] } = useGetAllBlogsQuery();
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  useEffect(() => {
    if (allBlogs?.length > 0) {
      const filtered = allBlogs.filter((b) => b._id !== id && b.isApproved);
      const shuffled = [...filtered].sort(() => 0.5 - Math.random());
      setRelatedBlogs(shuffled.slice(0, 6));
    }
  }, [allBlogs, id]);
  const handleBack = () => {
    router.back();
  };

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Blog Not Found</h2>
        <p className="text-gray-600 mb-6">
          The blog you're looking for doesn't exist or may have been removed.
        </p>
        <Button onClick={handleBack}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-[1200px]">
      {/* Dynamic Meta Tags */}
      {blog && <DynamicMetaTags course={blog} />}

      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={handleBack}
        className="mb-6 flex items-center gap-2 border border-yellow-200 bg-yellow-50 hover:bg-yellow-200"
      >
        <ArrowLeft size={18} />
        Back to Blogs
      </Button>

      {/* Main Blog Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Blog Article */}
        <article className="lg:col-span-2">
          {isLoading ? (
            <>
              <Skeleton className="h-8 w-3/4 mb-4" />
              <Skeleton className="h-6 w-1/2 mb-6" />
              <Skeleton className="h-96 w-full mb-6" />
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
            </>
          ) : blog ? (
            <>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {blog.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-8">
                <div className="flex items-center gap-2">
                  <User size={16} />
                  <span>{blog.mentor?.fullName || "DE JURE ACADEMY"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {new Date(blog.createdAt).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>
                    {Math.ceil(blog.description?.length / 1000)} min read
                  </span>
                </div>
              </div>

              {/* Featured Image */}
              <div className="relative w-full h-auto rounded-xl overflow-hidden mb-8 border flex items-center justify-center">
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL}/${blog.thumbnail}`}
                  alt={blog.title}
                  height={800}
                  width={800}
                  unoptimized
                  className="object-contain"
                />
              </div>

              <div className="prose-quill max-w-none">
                <div dangerouslySetInnerHTML={{ __html: blog.description }} />
              </div>

              {/* Social Share Section */}
              <div className="mt-8">
                <SocialShare
                  url={`${window.location.origin}/blog/${blog._id}`}
                  title={blog.title}
                  description={
                    blog.description
                      ?.replace(/<[^>]*>/g, "")
                      .substring(0, 160) || ""
                  }
                />
              </div>
            </>
          ) : null}
        </article>

        {/* Sidebar with Related Blogs */}
        <aside className="lg:col-span-1">
          <h2 className="text-2xl font-bold mb-6">More Blogs</h2>
          <div className="space-y-6">
            {relatedBlogs.length > 0
              ? relatedBlogs.map((blog) => (
                  <BlogCard
                    key={blog._id}
                    blog={blog}
                    variant="horizontal"
                    className="border p-4 rounded-lg"
                  />
                ))
              : [...Array(4)].map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="h-20 w-20 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                ))}
          </div>
        </aside>
      </div>

      {/* More Related Blogs Section (Mobile) */}
      <section className="mt-16 lg:hidden">
        <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {relatedBlogs.length > 0
            ? relatedBlogs
                .slice(0, 4)
                .map((blog) => <BlogCard key={blog._id} blog={blog} />)
            : [...Array(4)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-48 w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
        </div>
      </section>
    </div>
  );
}
