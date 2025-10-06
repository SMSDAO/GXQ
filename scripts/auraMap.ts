// File: scripts/auraMap.ts
// 🌟 Aura Map Generator for TradeOS
// Generates visual aura mappings for user profiles

import * as fs from 'fs';
import * as path from 'path';

interface AuraMapping {
  role: string;
  tier: string;
  glowColor: string;
  intensity: number;
  rippleEffect: string;
}

const AURA_MAPPINGS: AuraMapping[] = [
  {
    role: 'admin',
    tier: 'platinum',
    glowColor: '#e5e4e2',
    intensity: 1.0,
    rippleEffect: 'admin-ripple'
  },
  {
    role: 'contributor',
    tier: 'gold',
    glowColor: '#ffd700',
    intensity: 0.8,
    rippleEffect: 'contrib-ripple'
  },
  {
    role: 'investor',
    tier: 'silver',
    glowColor: '#c0c0c0',
    intensity: 0.6,
    rippleEffect: 'investor-ripple'
  },
  {
    role: 'user',
    tier: 'bronze',
    glowColor: '#cd7f32',
    intensity: 0.4,
    rippleEffect: 'user-ripple'
  }
];

function generateAuraMapFile(): void {
  const outputContent = `// Auto-generated: Aura Mapping Utility
// Generated on: ${new Date().toISOString()}

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

export const AURA_MAPPINGS = ${JSON.stringify(AURA_MAPPINGS, null, 2)};

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
`;

  const outputPath = path.join(process.cwd(), 'frontend', 'utils', 'auraMap.ts');
  const outputDir = path.dirname(outputPath);
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, outputContent);
  console.log(`✅ Generated auraMap.ts at: ${outputPath}`);
}

function main() {
  console.log('🌟 Generating Aura Map...\n');
  generateAuraMapFile();
  console.log('\n✅ Aura Map generation complete!');
}

// Execute if run directly
if (require.main === module) {
  main();
}

export { generateAuraMapFile };
