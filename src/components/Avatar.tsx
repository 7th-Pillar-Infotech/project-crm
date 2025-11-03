import React from 'react';

interface AvatarProps {
  name: string;
  email?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const getColorFromName = (name: string): string => {
  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-cyan-500',
  ];

  const hash = name.split('').reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0);
  }, 0);

  return colors[Math.abs(hash) % colors.length];
};

const sizeClasses = {
  sm: 'w-6 h-6 text-xs',
  md: 'w-8 h-8 text-sm',
  lg: 'w-10 h-10 text-base',
};

export const Avatar: React.FC<AvatarProps> = ({
  name,
  email,
  size = 'md',
  className = ''
}) => {
  const initials = getInitials(name);
  const bgColor = getColorFromName(name);

  return (
    <div
      className={`
        ${sizeClasses[size]}
        ${bgColor}
        rounded-full
        flex
        items-center
        justify-center
        text-white
        font-semibold
        flex-shrink-0
        ${className}
      `}
      title={email ? `${name} (${email})` : name}
    >
      {initials}
    </div>
  );
};
