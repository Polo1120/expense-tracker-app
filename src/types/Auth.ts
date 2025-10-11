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
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
};
