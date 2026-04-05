interface LogoProps {
  size?: "sm" | "md" | "lg";
  iconOnly?: boolean;
}

const sizeMap = {
  sm: { height: 24, fontSize: 16, iconSize: 24 },
  md: { height: 32, fontSize: 22, iconSize: 32 },
  lg: { height: 40, fontSize: 28, iconSize: 40 },
};

export function Logo({ size = "md", iconOnly = false }: LogoProps) {
  const { height, fontSize, iconSize } = sizeMap[size];

  const icon = (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Dark background with rounded corners */}
      <rect width="40" height="40" rx="10" fill="#1A1A24" />
      {/* Outer halo glow ring */}
      <circle
        cx="20"
        cy="18"
        r="13"
        stroke="#F5A623"
        strokeWidth="2"
        strokeOpacity="0.3"
        fill="none"
      />
      {/* Inner halo ring */}
      <circle
        cx="20"
        cy="18"
        r="9"
        stroke="#F5A623"
        strokeWidth="2.5"
        fill="none"
      />
      {/* Glow dot at top of halo */}
      <circle cx="20" cy="9" r="2.5" fill="#F5A623" />
      {/* Small person silhouette */}
      <circle cx="20" cy="20" r="3" fill="white" />
      <path
        d="M14 32C14 27.5817 16.6863 24 20 24C23.3137 24 26 27.5817 26 32"
        fill="white"
      />
    </svg>
  );

  if (iconOnly) {
    return icon;
  }

  return (
    <div className="flex items-center gap-2" style={{ height }}>
      {icon}
      <span
        className="font-bold tracking-tight text-foreground"
        style={{ fontSize }}
      >
        Halo
        <span className="text-amber-500">Shot</span>
      </span>
    </div>
  );
}
