const API_BASE = "/api";

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("auth_token");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }

  return res.json();
}

// ─── Auth ───────────────────────────────────────────
export interface AuthResponse {
  token: string;
  user: { id: string; name: string; email: string; avatar: string; verified: boolean };
}

export const api = {
  auth: {
    signup: (name: string, email: string, password: string) =>
      request<AuthResponse>("/auth/signup", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      }),
    login: (email: string, password: string) =>
      request<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    me: () => request<{ user: AuthResponse["user"] }>("/auth/me"),
  },

  // ─── Projects ───────────────────────────────────────
  projects: {
    list: () => request<{ projects: any[] }>("/projects"),
    get: (id: string) => request<{ project: any }>(`/projects/${id}`),
    create: (data: { title: string; artist: string; format?: string; duration?: string; lyrics?: string[]; style?: any }) =>
      request<{ project: any }>("/projects", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Record<string, any>) =>
      request<{ project: any }>(`/projects/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<{ message: string }>(`/projects/${id}`, { method: "DELETE" }),
    stats: () =>
      request<{ stats: { totalProjects: number; completedVideos: number; creditsRemaining: number; thisMonth: number } }>("/projects/stats"),
  },

  // ─── Feed ──────────────────────────────────────────
  feed: {
    list: () => request<{ posts: any[] }>("/feed"),
    get: (id: string) => request<{ post: any }>(`/feed/${id}`),
    like: (id: string) => request<{ likes: number }>(`/feed/${id}/like`, { method: "POST" }),
    unlike: (id: string) => request<{ likes: number }>(`/feed/${id}/unlike`, { method: "POST" }),
    comment: (id: string, text: string, userName: string) =>
      request<{ comment: any }>(`/feed/${id}/comments`, {
        method: "POST",
        body: JSON.stringify({ text, userName }),
      }),
    share: (id: string) => request<{ shares: number }>(`/feed/${id}/share`, { method: "POST" }),
  },

  // ─── Health ─────────────────────────────────────────
  health: () => request<{ status: string; timestamp: string }>("/health"),
};
