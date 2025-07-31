import axios from "axios";
import { getCookie } from "cookies-next";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  timeout: 30000,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = getCookie("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  age: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ImageMetadata {
  id: string;
  filename: string;
  originalName: string;
  size: number;
  width: number;
  height: number;
  format: string;
  s3Url: string;
  thumbnailUrl?: string;
  uploadedAt: string;
  userId: string;
}

export interface TransformationOptions {
  resize?: {
    width?: number;
    height?: number;
    fit?: "cover" | "contain" | "fill" | "inside" | "outside";
  };
  crop?: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
  rotate?: number;
  flip?: "horizontal" | "vertical" | "both";
  format?: "jpeg" | "png" | "webp" | "tiff";
  quality?: number;
  filters?: {
    blur?: number;
    sharpen?: number;
    brightness?: number;
    contrast?: number;
    saturation?: number;
    hue?: number;
    grayscale?: boolean;
    sepia?: boolean;
  };
  watermark?: {
    text?: string;
    image?: string;
    position?:
      | "top-left"
      | "top-right"
      | "bottom-left"
      | "bottom-right"
      | "center";
    opacity?: number;
  };
}

export interface ProcessedImage {
  id: string;
  originalImageId: string;
  s3Url: string;
  transformations: TransformationOptions;
  processedAt: string;
}

export const authAPI = {
  login: (data: LoginRequest) => api.post<AuthResponse>("/auth/sign-in", data),

  register: (data: RegisterRequest) =>
    api.post<AuthResponse>("/auth/sign-up", data),

  me: () => api.get<User>("/users"),

  verifyEmail: (email: string, otpCode: string) =>
    api.post<AuthResponse>("/auth/verify-email", { email, otpCode }),

  resendOTP: (email: string) =>
    api.post("/auth/resend-verification-code", { email }),
};

export const imagesAPI = {
  upload: (file: File, onProgress?: (progress: number) => void) => {
    const formData = new FormData();
    formData.append("file", file);

    return api.post<ImageMetadata>("/posts", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(progress);
        }
      },
    });
  },

  getImages: (page = 1, limit = 12) =>
    api.get<{ images: ImageMetadata[]; total: number; totalPages: number }>(
      `/posts`,
      {
        params: { page, limit },
      }
    ),

  getImage: (id: string) => api.get<ImageMetadata>(`/posts/${id}`),

  deleteImage: (id: string) => api.delete(`/posts/${id}`),

  transformImage: (id: string, transformations: TransformationOptions) =>
    api.post<ProcessedImage>(`/posts/${id}/transform`, { transformations }),

  downloadImage: (id: string, processed = false) =>
    api.get(`/posts/${id}/download${processed ? "?processed=true" : ""}`, {
      responseType: "blob",
    }),
};

export const uploadImage = async (file: File): Promise<ImageMetadata> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post<ImageMetadata>("/posts", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
