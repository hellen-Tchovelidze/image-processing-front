

import React from "react";
import ImageEditor from "@/components/ImageEditor";
import { UserPostsGallery } from "@/components/gallery/ImageGallery";
import { Header } from "@/components/layout/Header";




export default function DashboardPage() {
  return (
    <div>
    
        
     <Header />
      <div className=" min-h-screen">
        <ImageEditor />
        <UserPostsGallery />
        
      </div>
     
    </div>
  );
}
