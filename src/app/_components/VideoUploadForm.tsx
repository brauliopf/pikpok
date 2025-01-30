import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { CloudUpload } from "lucide-react";
import { uploadVideoToS3 } from "../actions/upload";

const VideoUploadForm: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "video/mp4") {
      setSelectedFile(file);
    } else {
      alert("Please select an MP4 video file");
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedFile) {
      alert("Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("video", selectedFile);

    try {
      const response = await uploadVideoToS3(formData);

      if (response.success) {
        alert("Video uploaded successfully");
        setSelectedFile(null);
      } else {
        alert("Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed");
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <SidebarMenuItem key="dialog" className="">
          <SidebarMenuButton asChild>
            <a href="#" className="flex justify-center hover:bg-zinc-200">
              <CloudUpload />
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>File Upload</DialogTitle>
          <DialogDescription>Select Video to Upload (.mp4)</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <input type="file" accept=".mp4" onChange={handleFileChange} />
          <Button type="submit">Upload Video</Button>
        </form>

        <div>
          <h3>Selected File Details</h3>
          <p>
            <strong>Title:</strong>{" "}
            {selectedFile ? selectedFile.name : "No file selected"}
          </p>
          <p>
            <strong>Size:</strong>{" "}
            {selectedFile
              ? `${(selectedFile.size / 10 ** 6).toFixed(2)} MB`
              : "––"}
          </p>
          <label htmlFor="notes">Notes:</label>
          <textarea
            id="notes"
            placeholder="Add notes about the video..."
          ></textarea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoUploadForm;
