// Auto-generated: Aura Mapping Utility
// Generated on: 2025-10-06T08:07:53.458Z

export interface AuraProfile {
  userId: string;
  role: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  glowColor: string;
  intensity: number;
  achievements: string[];
  rippleEffect?: string;
}

export const AURA_COLORS = {
  bronze: '#cd7f32',
  silver: '#c0c0c0',
  gold: '#ffd700',
  platinum: '#e5e4e2',
};

export const AURA_MAPPINGS = [
  {
    "role": "admin",
    "tier": "platinum",
    "glowColor": "#e5e4e2",
    "intensity": 1,
    "rippleEffect": "admin-ripple"
  },
  {
    "role": "contributor",
    "tier": "gold",
    "glowColor": "#ffd700",
    "intensity": 0.8,
    "rippleEffect": "contrib-ripple"
  },
  {
    "role": "investor",
    "tier": "silver",
    "glowColor": "#c0c0c0",
    "intensity": 0.6,
    "rippleEffect": "investor-ripple"
  },
  {
    "role": "user",
    "tier": "bronze",
    "glowColor": "#cd7f32",
    "intensity": 0.4,
    "rippleEffect": "user-ripple"
  }
];

export function getAuraProfile(userId: string, role: string = 'user'): AuraProfile {
  const mapping = AURA_MAPPINGS.find(m => m.role === role) || AURA_MAPPINGS[AURA_MAPPINGS.length - 1];
  
  return {
    userId,
    role,
    tier: mapping.tier as 'bronze' | 'silver' | 'gold' | 'platinum',
    glowColor: mapping.glowColor,
    intensity: mapping.intensity,
    achievements: [],
    rippleEffect: mapping.rippleEffect
  };
}

export function calculateAuraIntensity(achievements: string[]): number {
  const baseIntensity = 0.3;
  const achievementBonus = achievements.length * 0.05;
  return Math.min(baseIntensity + achievementBonus, 1.0);
}

export function updateAuraEffect(profile: AuraProfile): void {
  if (typeof document !== 'undefined') {
    document.body.style.setProperty('--aura-color', profile.glowColor);
    document.body.style.setProperty('--aura-intensity', profile.intensity.toString());
    
    if (profile.rippleEffect) {
      document.body.classList.add(profile.rippleEffect);
    }
  }
}

export function getAuraByTier(tier: 'bronze' | 'silver' | 'gold' | 'platinum'): string {
  return AURA_COLORS[tier];
}

export function applyRoleBasedAura(role: string): void {
  const mapping = AURA_MAPPINGS.find(m => m.role === role);
  
  if (mapping && typeof document !== 'undefined') {
    document.body.style.setProperty('--role-aura-color', mapping.glowColor);
    document.body.style.setProperty('--role-aura-intensity', mapping.intensity.toString());
    document.body.classList.add(mapping.rippleEffect);
  }
}
