const API_URL = "https://script.google.com/macros/s/AKfycbwWkqslWS9LxKJQ-9e84NmGZ0LxrKuFGOb5yFYFCwzlcY3oBbHXtAhOD6kStPe59cjc/exec";

export interface User {
  userId: string;
  displayName: string;
  photoUrl?: string;
  folderId?: string;
  folderName?: string;
}

export interface MediaItem {
  id: string;
  name: string;
  type: "folder" | "file" | "video";
  mimeType: string;
  sizeBytes: number;
  sizeHuman: string;
  createdAt: string;
  modifiedAt: string;
  thumbnail: string;
  previewUrl: string;
  url: string;
  downloadUrl: string;
  likedByMe: boolean;
  likeCount: number;
  commentCount: number;
  preset: string;
}

export interface BreadcrumbItem {
  id: string;
  name: string;
}

export interface ListResponse {
  ok: boolean;
  breadcrumb: BreadcrumbItem[];
  folderId: string;
  sort: string;
  items: MediaItem[];
  counts: {
    totalLikes: number;
    totalComments: number;
  };
  error?: string;
}

export interface LoginResponse {
  ok: boolean;
  token?: string;
  user?: User;
  expiresAt?: string;
  error?: string;
}

const apiCall = async (params: Record<string, any>) => {
  const url = new URL(API_URL);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value));
    }
  });

  const response = await fetch(url.toString());
  return response.json();
};

export const api = {
  login: async (userId: string, password: string): Promise<LoginResponse> => {
    return apiCall({ action: "login", userId, password });
  },

  me: async (token: string): Promise<{ ok: boolean; user?: User; error?: string }> => {
    return apiCall({ action: "me", token });
  },

  list: async (
    token: string,
    folderId: string = "root",
    sort: string = "name_asc"
  ): Promise<ListResponse> => {
    return apiCall({ action: "list", token, folderId, sort });
  },

  like: async (token: string, folderId: string, fileId: string, liked: boolean) => {
    return apiCall({ action: "like", token, folderId, fileId, liked: liked ? "true" : "false" });
  },

  comment: async (token: string, folderId: string, fileId: string, text: string) => {
    return apiCall({ action: "comment", token, folderId, fileId, text });
  },

  setPreset: async (token: string, folderId: string, fileId: string, preset: string) => {
    return apiCall({ action: "setpreset", token, folderId, fileId, preset });
  },

  submitSelected: async (token: string, folderId: string, fileIds: string[]) => {
    return apiCall({
      action: "submitselected",
      token,
      folderId,
      fileIds: fileIds.join(","),
      submit: "true",
    });
  },

  search: async (token: string, folderId: string, query: string, scope: "this" | "all" = "this") => {
    return apiCall({ action: "search", token, folderId, q: query, scope });
  },

  zip: async (token: string, folderId: string, fileIds: string[]) => {
    return apiCall({
      action: "zip",
      token,
      folderId,
      fileIds: fileIds.join(","),
    });
  },

  logout: async (token: string) => {
    return apiCall({ action: "logout", token });
  },
};
