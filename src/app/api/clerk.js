// User roles
export const USER_ROLES = {
  CONTRIBUTOR: 'contributor',
  OWNER: 'owner',
};

// Helper function to get current user role
export const getUserRole = (user) => {
  if (!user || !user.publicMetadata) return null;
  return user.publicMetadata.role || null;
};

// Helper function to set user role
export const setUserRole = async (role) => {
  try {
    
    const response = await fetch('/api/update-role', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important for auth cookies
      body: JSON.stringify({ role }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update role');
    }

    // Verify the role was actually updated
    if (data.role !== role) {
      throw new Error('Role update verification failed');
    }

    return {
      success: true,
      role: data.role
    };
  } catch (error) {
    throw error; // Re-throw to let caller handle the error
  }
};

// Helper function to check if user is a contributor
export const isContributor = (user) => {
  const role = getUserRole(user);
  return role === USER_ROLES.CONTRIBUTOR;
};

// Helper function to check if user is an owner
export const isOwner = (user) => {
  const role = getUserRole(user);
  return role === USER_ROLES.OWNER;
}; 