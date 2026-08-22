/**
 * Mock Auth Implementation for GlobeTrotter
 * Used because Supabase environment variables were not provided.
 */

// We export a dummy supabase object just in case any component imports it directly
export const supabase = {
  auth: {
    getSession: async () => {
      if (typeof window === 'undefined') return { data: { session: null } };
      const token = localStorage.getItem('gt_mock_token');
      return { data: { session: token ? { access_token: token } : null } };
    },
    getUser: async () => {
      if (typeof window === 'undefined') return { data: { user: null } };
      const userStr = localStorage.getItem('gt_mock_user');
      return { data: { user: userStr ? JSON.parse(userStr) : null } };
    },
    signOut: async () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('gt_mock_token');
        localStorage.removeItem('gt_mock_user');
      }
    }
  }
};

export async function getAccessToken() {
  const { data } = await supabase.auth.getSession();
  return data?.session?.access_token || null;
}

export async function signIn(email, password) {
  // Mock login logic
  if (password === 'wrongpassword') {
    throw new Error('Invalid login credentials');
  }
  
  const mockUser = {
    id: 'mock-user-123',
    email: email,
    user_metadata: { name: 'Demo User' }
  };
  
  if (typeof window !== 'undefined') {
    localStorage.setItem('gt_mock_token', 'mock-jwt-token-xyz');
    localStorage.setItem('gt_mock_user', JSON.stringify(mockUser));
  }
  
  return { user: mockUser, session: { access_token: 'mock-jwt-token-xyz' } };
}

export async function signUp(email, password, metadata = {}) {
  // Mock registration
  if (email === 'existing@example.com') {
    throw new Error('User already registered');
  }

  const mockUser = {
    id: 'mock-user-123',
    email: email,
    user_metadata: metadata
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem('gt_mock_token', 'mock-jwt-token-xyz');
    localStorage.setItem('gt_mock_user', JSON.stringify(mockUser));
  }

  return { user: mockUser, session: { access_token: 'mock-jwt-token-xyz' } };
}

export async function signOut() {
  await supabase.auth.signOut();
}

export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return data?.user || null;
}
