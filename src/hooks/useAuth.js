import { useAuth as useAuthContext } from '../context/AuthContext';

// Custom hook for easier access to auth context
export const useAuth = () => {
  return useAuthContext();
};