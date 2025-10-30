// File: mergeTradeOSBranches.ts
// 🔁 TradeOS Branch Merge Orchestrator

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

interface BranchConfig {
  name: string;
  priority: number;
  autoMerge: boolean;
}

const BRANCHES: BranchConfig[] = [
  { name: 'main', priority: 1, autoMerge: false },
  { name: 'dev', priority: 2, autoMerge: true },
  { name: 'feature/ui-updates', priority: 3, autoMerge: true },
  { name: 'feature/backend-api', priority: 4, autoMerge: true },
  { name: 'feature/contracts', priority: 5, autoMerge: true },
];

function executeCommand(command: string): string {
  try {
    return execSync(command, { encoding: 'utf-8', stdio: 'pipe' });
  } catch (error: any) {
    console.error(`❌ Command failed: ${command}`);
    console.error(error.message);
    return '';
  }
}

function getCurrentBranch(): string {
  const result = executeCommand('git rev-parse --abbrev-ref HEAD');
  return result.trim();
}

function branchExists(branchName: string): boolean {
  const result = executeCommand('git branch --list');
  return result.includes(branchName);
}

function mergeBranch(sourceBranch: string, targetBranch: string): boolean {
  console.log(`\n🔄 Merging ${sourceBranch} into ${targetBranch}...`);
  
  // Checkout target branch
  executeCommand(`git checkout ${targetBranch}`);
  
  // Try to merge
  const mergeOutput = executeCommand(`git merge ${sourceBranch} --no-edit`);
  
  if (mergeOutput.includes('CONFLICT') || mergeOutput.includes('conflict')) {
    console.log(`⚠️  Merge conflict detected for ${sourceBranch}`);
    console.log(`   Please resolve manually and continue`);
    return false;
  }
  
  console.log(`✅ Successfully merged ${sourceBranch} into ${targetBranch}`);
  return true;
}

function main() {
  console.log('🚀 TradeOS Branch Merge Orchestrator\n');
  
  // Get current branch
  const currentBranch = getCurrentBranch();
  console.log(`📍 Current branch: ${currentBranch}\n`);
  
  // Check if we're in a git repository
  const isGitRepo = fs.existsSync(path.join(process.cwd(), '.git'));
  if (!isGitRepo) {
    console.log('❌ Not a git repository. Skipping merge...');
    return;
  }
  
  // Fetch latest changes
  console.log('📥 Fetching latest changes...');
  executeCommand('git fetch --all');
  
  // Check for local changes
  const status = executeCommand('git status --porcelain');
  if (status.trim()) {
    console.log('⚠️  Uncommitted changes detected:');
    console.log(status);
    console.log('   Stashing changes...');
    executeCommand('git stash');
  }
  
  // Sort branches by priority
  const sortedBranches = BRANCHES.sort((a, b) => a.priority - b.priority);
  
  // Process merges
  let mergeCount = 0;
  for (let i = 0; i < sortedBranches.length - 1; i++) {
    const targetBranch = sortedBranches[i];
    
    if (!targetBranch.autoMerge) {
      console.log(`⏭️  Skipping ${targetBranch.name} (auto-merge disabled)`);
      continue;
    }
    
    // Check if branch exists
    if (!branchExists(targetBranch.name)) {
      console.log(`⚠️  Branch ${targetBranch.name} does not exist locally`);
      continue;
    }
    
    // Find branches to merge into this one
    for (let j = i + 1; j < sortedBranches.length; j++) {
      const sourceBranch = sortedBranches[j];
      
      if (branchExists(sourceBranch.name)) {
        if (mergeBranch(sourceBranch.name, targetBranch.name)) {
          mergeCount++;
        }
      }
    }
  }
  
  // Return to original branch
  executeCommand(`git checkout ${currentBranch}`);
  
  // Pop stash if we stashed earlier
  if (status.trim()) {
    console.log('\n🔄 Restoring stashed changes...');
    executeCommand('git stash pop');
  }
  
  console.log(`\n✅ Merge orchestration complete!`);
  console.log(`   Merged ${mergeCount} branch(es)`);
  console.log(`   Returned to: ${currentBranch}`);
}

// Execute if run directly
if (require.main === module) {
  main();
}

export { main as mergeTradeOSBranches };
