import React from 'react';

interface OceanWaveBrandProps {
  name?: string;
  badge?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

export const OceanWaveBrand: React.FC<OceanWaveBrandProps> = ({
  name = 'VELORIX',
  badge,
  size = 'xl',
  className = ''
}) => {
  const letters = name.split('');

  // Sizing with '2xl' and 'xl' making VELORIX prominent, bold, and impactful
  const sizeClasses = {
    sm: 'text-sm tracking-tight',
    md: 'text-lg sm:text-xl tracking-tight',
    lg: 'text-2xl sm:text-3xl tracking-tight',
    xl: 'text-3xl sm:text-4xl md:text-5xl tracking-normal',
    '2xl': 'text-4xl sm:text-5xl md:text-6xl tracking-tight font-black'
  }[size];

  const badgeSize = {
    sm: 'text-[8px] px-1.5 py-0.2',
    md: 'text-[9px] px-2 py-0.5',
    lg: 'text-[10px] px-2.5 py-0.5',
    xl: 'text-[11px] px-3 py-0.5 font-black',
    '2xl': 'text-xs px-3.5 py-1 font-black'
  }[size];

  // Colorful sparkle coordinates around the text for vivid colorful highlights
  const sparkles = [
    { top: '-15%', left: '4%', color: '#10B981', size: 'w-2 h-2', delay: '0s' },     // Emerald Green
    { top: '-20%', left: '50%', color: '#06B6D4', size: 'w-2.5 h-2.5', delay: '0.5s' }, // Cyan
    { top: '-10%', right: '6%', color: '#3B82F6', size: 'w-2 h-2', delay: '1.1s' },     // Electric Blue
    { bottom: '-15%', left: '18%', color: '#F43F5E', size: 'w-2 h-2', delay: '0.3s' },  // Neon Rose
    { bottom: '-18%', right: '22%', color: '#EAB308', size: 'w-2.5 h-2.5', delay: '0.8s' }, // Vivid Amber Gold
    { top: '45%', right: '-8%', color: '#A855F7', size: 'w-2 h-2', delay: '1.4s' },    // Purple
    { top: '35%', left: '-8%', color: '#00FF94', size: 'w-2 h-2', delay: '0.2s' },     // Neon Green
  ];

  return (
    <div className={`relative inline-flex items-center justify-center select-none ${className}`}>
      {/* Dynamic Colorful Shimmering Sprinkles */}
      {size !== 'sm' && sparkles.map((s, idx) => (
        <span
          key={idx}
          className={`absolute pointer-events-none rounded-full animate-sprinkle-twinkle ${s.size}`}
          style={{
            top: s.top,
            left: s.left,
            right: (s as any).right,
            bottom: (s as any).bottom,
            backgroundColor: s.color,
            boxShadow: `0 0 12px ${s.color}, 0 0 24px ${s.color}`,
            animationDelay: s.delay,
          }}
        />
      ))}

      {/* Ocean Wave Letter Stack: 2 Distinct Tones: Vivid Neon Emerald Green + Ultra-Vibrant Electric Cyan Blue */}
      <h1 className={`font-black font-display uppercase flex items-center justify-center gap-0.5 sm:gap-1 ${sizeClasses}`}>
        {letters.map((char, index) => {
          // Calculate phase delay for rhythmic wave motion like ocean swells
          const delaySeconds = index * 0.18;
          return (
            <span
              key={index}
              className="inline-block animate-ocean-wave font-black bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-[length:200%_200%] bg-clip-text text-transparent animate-gradient-flow filter drop-shadow-[0_4px_18px_rgba(16,185,129,0.45)]"
              style={{
                animationDelay: `${delaySeconds}s`,
              }}
            >
              {char}
            </span>
          );
        })}

        {badge && (
          <span className={`ml-2.5 inline-flex items-center rounded-full font-bold tracking-widest uppercase border border-emerald-400/40 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.35)] animate-pulse ${badgeSize}`}>
            {badge}
          </span>
        )}
      </h1>
    </div>
  );
};

export default OceanWaveBrand;
