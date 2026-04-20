/**
 * ============================================================================
 * TradeOS Branch Merge Automation
 * Auto-merges development branches into main
 * ============================================================================
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

interface BranchConfig {
  name: string;
  priority: number;
  autoMerge: boolean;
}

// Configuration for branches to merge
const branches: BranchConfig[] = [
  { name: 'develop', priority: 1, autoMerge: false },
  { name: 'feature/widgets', priority: 2, autoMerge: false },
  { name: 'feature/contracts', priority: 3, autoMerge: false },
  { name: 'hotfix/*', priority: 0, autoMerge: false },
];

/**
 * Execute git command safely
 */
function execGit(command: string): string {
  try {
    return execSync(command, { encoding: 'utf8', stdio: 'pipe' }).trim();
  } catch (error: any) {
    console.error(`❌ Git command failed: ${command}`);
    console.error(error.stderr || error.message);
    return '';
  }
}

/**
 * Check if branch exists
 */
function branchExists(branchName: string): boolean {
  const branches = execGit('git branch -a');
  return branches.includes(branchName);
}

/**
 * Get current branch
 */
function getCurrentBranch(): string {
  return execGit('git branch --show-current');
}

/**
 * Main merge orchestration
 */
async function mergeBranches(): Promise<void> {
  console.log('🔁 TradeOS Branch Merge Automation');
  console.log('==================================\n');

  const currentBranch = getCurrentBranch();
  console.log(`📍 Current branch: ${currentBranch}\n`);

  // Fetch latest changes
  console.log('📥 Fetching latest changes...');
  execGit('git fetch origin');

  // Check for uncommitted changes
  const status = execGit('git status --porcelain');
  if (status) {
    console.log('⚠️  Warning: You have uncommitted changes');
    console.log('Please commit or stash them before merging\n');
    return;
  }

  // Sort branches by priority
  const sortedBranches = branches.sort((a, b) => a.priority - b.priority);

  for (const branchConfig of sortedBranches) {
    const branchName = branchConfig.name;
    
    // Skip wildcard branches for now (can be enhanced)
    if (branchName.includes('*')) {
      console.log(`⏭️  Skipping wildcard pattern: ${branchName}`);
      continue;
    }

    console.log(`\n🔍 Checking branch: ${branchName}`);
    
    if (!branchExists(branchName)) {
      console.log(`  ⚠️  Branch not found, skipping...`);
      continue;
    }

    // Check if branch has changes
    const diff = execGit(`git log main..origin/${branchName} --oneline`);
    
    if (!diff) {
      console.log(`  ✅ No new changes in ${branchName}`);
      continue;
    }

    console.log(`  📊 Found ${diff.split('\n').length} commit(s) to merge`);
    
    if (branchConfig.autoMerge) {
      console.log(`  🔄 Auto-merging ${branchName}...`);
      const mergeResult = execGit(`git merge origin/${branchName} --no-ff -m "Auto-merge ${branchName} into main"`);
      
      if (mergeResult.includes('CONFLICT')) {
        console.log(`  ❌ Merge conflict detected in ${branchName}`);
        console.log(`  🔧 Please resolve conflicts manually`);
        execGit('git merge --abort');
      } else {
        console.log(`  ✅ Successfully merged ${branchName}`);
      }
    } else {
      console.log(`  ℹ️  Manual merge required for ${branchName}`);
    }
  }

  console.log('\n✨ Branch merge check complete!');
  console.log('==================================\n');
}

// Run the script
mergeBranches().catch((error) => {
  console.error('❌ Error during merge process:', error);
  process.exit(1);
});
