export const LogoIcon = () => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-8 h-8"
    >
      {/* Background circle gradient */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>

      {/* Main background circle */}
      <circle cx="16" cy="16" r="15" fill="url(#logoGradient)" />

      {/* Customer/Contact nodes */}
      {/* Top left node */}
      <circle cx="10" cy="10" r="2.5" fill="white" opacity="0.9" />
      {/* Top right node */}
      <circle cx="22" cy="10" r="2.5" fill="white" opacity="0.9" />
      {/* Bottom left node */}
      <circle cx="10" cy="22" r="2.5" fill="white" opacity="0.9" />
      {/* Bottom right node */}
      <circle cx="22" cy="22" r="2.5" fill="white" opacity="0.9" />

      {/* Center hub node */}
      <circle cx="16" cy="16" r="3" fill="white" />

      {/* Connection lines from center to nodes */}
      {/* Top left line */}
      <line x1="16" y1="16" x2="10" y2="10" stroke="white" strokeWidth="1.5" opacity="0.7" />
      {/* Top right line */}
      <line x1="16" y1="16" x2="22" y2="10" stroke="white" strokeWidth="1.5" opacity="0.7" />
      {/* Bottom left line */}
      <line x1="16" y1="16" x2="10" y2="22" stroke="white" strokeWidth="1.5" opacity="0.7" />
      {/* Bottom right line */}
      <line x1="16" y1="16" x2="22" y2="22" stroke="white" strokeWidth="1.5" opacity="0.7" />

      {/* Connection lines between outer nodes (subtle network effect) */}
      <line x1="10" y1="10" x2="22" y2="10" stroke="white" strokeWidth="1" opacity="0.4" />
      <line x1="10" y1="22" x2="22" y2="22" stroke="white" strokeWidth="1" opacity="0.4" />
    </svg>
  );
};
