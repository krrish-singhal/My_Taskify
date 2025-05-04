import React from 'react';

const UserAvatar = ({ user, size = 'md' }) => {
  // Size classes
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl'
  };

  // Get initials from name
  const getInitials = () => {
    if (!user || !user.name) return '?';
    return user.name.charAt(0).toUpperCase();
  };

  // Generate a color based on the user's name
  const getColorClass = () => {
    if (!user || !user.name) return 'bg-gray-400';
    
    const colors = [
      'bg-red-500',
      'bg-yellow-500',
      'bg-green-500',
      'bg-blue-500',
      'bg-indigo-500',
      'bg-purple-500',
      'bg-pink-500'
    ];
    
    const hash = user.name.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + acc;
    }, 0);
    
    return colors[hash % colors.length];
  };

  // If user has a profile picture, show it
  if (user && user.profilePicture) {
    return (
      <img
        className={`${sizeClasses[size]} rounded-full object-cover border-2 border-white dark:border-gray-800`}
        src={user.profilePicture || "/placeholder.svg"}
        alt={user.name || 'User'}
      />
    );
  }

  // Otherwise show initials
  return (
    <div
      className={`${sizeClasses[size]} ${getColorClass()} rounded-full flex items-center justify-center text-white font-medium border-2 border-white dark:border-gray-800`}
    >
      {getInitials()}
    </div>
  );
};

export default UserAvatar;
