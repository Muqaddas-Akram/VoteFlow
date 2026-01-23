interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const Logo = ({ size = "lg", showText = true }: LogoProps) => {
  const iconSizes = {
    sm: "w-12 h-12",
    md: "w-20 h-20",
    lg: "w-32 h-32", 
  };

  const textSizes = {
    sm: "text-xl",
    md: "text-3xl",
    lg: "text-5xl",
  };

  return (
    <div className="flex items-center gap-2">
      {/* Image from public folder */}
      <img
        src="/logo.png"
        alt="VoteFlow Logo"
        className={`${iconSizes[size]}`} 
      />
      {showText && (
        <span className={`${textSizes[size]} font-bold text-foreground tracking-tight`}>
          Vote<span className="text-primary">Flow</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
