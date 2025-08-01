


"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, Edit3, Eye } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import axios from "axios";
import { getCookie } from "cookies-next";
import { api } from "@/lib/api";

interface Post {
  _id: string;
  title?: string;
  desc?: string;
  image?: string; 
  createdAt?: string;
}

interface ImageGalleryProps {
  onSelectPost?: (post: Post) => void;
  onEditPost?: (post: Post) => void;
  refreshTrigger?: number;
}

export const UserPostsGallery: React.FC<ImageGalleryProps> = ({
  onSelectPost,
  onEditPost,
  refreshTrigger,
}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";


  const loadPosts = async (page = 1) => {
    try {
      setLoading(true);
      const token = getCookie("access_token");
  
      
      const response = await axios.get(`${baseURL}/posts/my-posts`, {
        params: { page, limit: 12 },
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
  
      console.log("API response data:", response.data);
      console.log("Posts array:", response.data.images);
  
      setPosts(response.data.images || []);
      setTotalPages(response.data.totalPages || 1);
      setCurrentPage(page);
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to load posts";
      toast.error(message);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    loadPosts(currentPage);
  }, [refreshTrigger]);




  const handleDownload = (url: string, filename = "image.jpg") => {
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const token = getCookie("access_token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      await axios.delete(`${baseURL}/posts/${id}`, { headers });
      
      toast.success("Post deleted successfully");
      await loadPosts(currentPage);
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to delete post";
      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  };
  
  
  if (loading && posts.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <Card className="glass">
        <CardContent className="text-center py-12">
          <h3 className="text-lg font-medium text-muted-foreground">
            No posts found
          </h3>
          <p className="text-sm text-muted-foreground mt-2">
            Create your first post to get started
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {posts.map((post) => (
          <Card
            key={post._id}
            className="glass overflow-hidden group hover:glow transition-all"
          >
            <CardContent className="p-4">
              <h3 className="font-medium truncate mb-2">{post.title || "Image Processing Service "}</h3>
              <p className="text-sm text-muted-foreground mb-2">
                {post.createdAt ? new Date(post.createdAt).toLocaleString() : ""}
              </p>
              <p className="text-sm">{post.desc || ""}</p>
              {post.image && (
                <img
                  src={post.image} 
                  alt={post.title || "Post image"}
                  className="mt-2 rounded-md max-h-40 object-cover w-full"
                />
                
              )}

              <div className="flex space-x-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onSelectPost?.(post)}
                  className="glass"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
  size="sm"
  variant="outline"
  onClick={() =>
    post.image && handleDownload(post.image, `${post.title || "image"}.jpg`)
  }
  className="glass"
>
  📥
</Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEditPost?.(post)}
                  className="glass"
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="glass text-destructive hover:text-destructive"
                      disabled={deletingId === post._id}
                    >
                      {deletingId === post._id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="glass">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Post</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete &quot;{post.title}&quot;? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(post._id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <Button
            variant="outline"
            onClick={() => loadPosts(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="glass"
          >
            Previous
          </Button>
          <span className="flex items-center px-4 text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => loadPosts(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
            className="glass"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};
