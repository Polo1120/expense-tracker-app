export type AuthContextType = {
  user: {
    avatar: string;
    id: string;
    email: string;
    name: string;
    created: string;
    updated: string;
  } | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
};
