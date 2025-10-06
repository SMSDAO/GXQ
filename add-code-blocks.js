#!/usr/bin/env node

/**
 * ============================================================================
 * Auto Code Block Header Injector
 * Adds standardized header comments to all source files
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');

const headers = {
  '.sol': `// ============================================================================
// TradeOS Smart Contract
// Auto-generated header by add-code-blocks.js
// Part of the TradeOS V1.1 Full Stack Platform
// ============================================================================\n\n`,
  
  '.js': `/**
 * ============================================================================
 * TradeOS JavaScript Module
 * Auto-generated header by add-code-blocks.js
 * Part of the TradeOS V1.1 Full Stack Platform
 * ============================================================================
 */\n\n`,
  
  '.ts': `/**
 * ============================================================================
 * TradeOS TypeScript Module
 * Auto-generated header by add-code-blocks.js
 * Part of the TradeOS V1.1 Full Stack Platform
 * ============================================================================
 */\n\n`,
  
  '.tsx': `/**
 * ============================================================================
 * TradeOS React Component
 * Auto-generated header by add-code-blocks.js
 * Part of the TradeOS V1.1 Full Stack Platform
 * ============================================================================
 */\n\n`,
  
  '.jsx': `/**
 * ============================================================================
 * TradeOS React Component
 * Auto-generated header by add-code-blocks.js
 * Part of the TradeOS V1.1 Full Stack Platform
 * ============================================================================
 */\n\n`,
};

const skipDirs = [
  'node_modules',
  '.git',
  'dist',
  'out',
  '.next',
  'docs',
  '.vs',
  '..bfg-report',
];

const skipFiles = [
  'add-code-blocks.js',
  'package.json',
  'package-lock.json',
  'tsconfig.json',
];

function shouldSkip(filePath) {
  const relativePath = path.relative(process.cwd(), filePath);
  
  // Skip directories
  for (const dir of skipDirs) {
    if (relativePath.includes(dir)) {
      return true;
    }
  }
  
  // Skip specific files
  const basename = path.basename(filePath);
  if (skipFiles.includes(basename)) {
    return true;
  }
  
  return false;
}

function hasHeader(content, ext) {
  const header = headers[ext];
  if (!header) return true; // Skip if no header defined for this extension
  
  // Check if file already has any header comment
  const lines = content.split('\n').slice(0, 5);
  const hasComment = lines.some(line => 
    line.includes('============') ||
    line.includes('Auto-generated') ||
    line.includes('TradeOS')
  );
  
  return hasComment;
}

function addHeaderToFile(filePath) {
  const ext = path.extname(filePath);
  
  if (!headers[ext]) {
    return; // No header defined for this extension
  }
  
  if (shouldSkip(filePath)) {
    return;
  }
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    if (hasHeader(content, ext)) {
      console.log(`⏭️  Skipped (has header): ${path.relative(process.cwd(), filePath)}`);
      return;
    }
    
    // For Solidity files, preserve SPDX license
    if (ext === '.sol') {
      const spdxMatch = content.match(/^\/\/ SPDX-License-Identifier:.*$/m);
      if (spdxMatch) {
        content = content.replace(spdxMatch[0], spdxMatch[0] + '\n' + headers[ext]);
      } else {
        content = headers[ext] + content;
      }
    } else {
      content = headers[ext] + content;
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Added header: ${path.relative(process.cwd(), filePath)}`);
  } catch (error) {
    console.error(`❌ Error processing ${filePath}: ${error.message}`);
  }
}

function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (shouldSkip(fullPath)) {
      continue;
    }
    
    if (entry.isDirectory()) {
      processDirectory(fullPath);
    } else if (entry.isFile()) {
      addHeaderToFile(fullPath);
    }
  }
}

console.log('📝 TradeOS Code Block Header Injector');
console.log('=====================================\n');

const rootDir = process.cwd();
processDirectory(rootDir);

console.log('\n✨ Header injection complete!');
console.log('=====================================\n');
