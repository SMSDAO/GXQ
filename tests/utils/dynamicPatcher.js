// File: tests/utils/dynamicPatcher.js
// 🔧 Dynamic Test Patcher
// Automatically patches and updates tests based on code changes

const fs = require('fs');
const path = require('path');

class DynamicPatcher {
  constructor() {
    this.patchHistory = [];
    this.patchedModules = new Set();
  }

  /**
   * Scan a module and generate test stubs for untested functions
   */
  scanModule(modulePath) {
    try {
      const moduleContent = fs.readFileSync(modulePath, 'utf-8');
      const functions = this.extractFunctions(moduleContent);
      
      return {
        path: modulePath,
        functions,
        testable: functions.filter(f => !f.name.startsWith('_'))
      };
    } catch (error) {
      console.error(`Error scanning module ${modulePath}:`, error.message);
      return null;
    }
  }

  /**
   * Extract function definitions from code
   */
  extractFunctions(code) {
    const functions = [];
    const seen = new Set();
    
    // Match named function declarations: function name() / async function name()
    const namedFuncRegex = /(async\s+)?function\s+(\w+)\s*\(/g;
    let match;
    while ((match = namedFuncRegex.exec(code)) !== null) {
      const isAsync = Boolean(match[1]);
      const name = match[2];
      if (name && !seen.has(name) && name !== 'require' && name !== 'module') {
        seen.add(name);
        functions.push({ name, type: isAsync ? 'async' : 'sync' });
      }
    }

    // Match arrow/function expressions: const name = (async) (...) => ...
    // Requires => to avoid matching plain const declarations like `const foo = bar(`
    const arrowFuncRegex = /(?:const|let|var)\s+(\w+)\s*=\s*(async\s*)?\([^)]*\)\s*=>/g;
    while ((match = arrowFuncRegex.exec(code)) !== null) {
      const name = match[1];
      const isAsync = Boolean(match[2]);
      if (name && !seen.has(name) && name !== 'require' && name !== 'module') {
        seen.add(name);
        functions.push({ name, type: isAsync ? 'async' : 'sync' });
      }
    }
    
    // Match class methods: (async) methodName(...) {
    const methodRegex = /^\s+(async\s+)?(\w+)\s*\([^)]*\)\s*\{/gm;
    while ((match = methodRegex.exec(code)) !== null) {
      const isAsync = Boolean(match[1]);
      const name = match[2];
      if (name && !seen.has(name) &&
          name !== 'constructor' &&
          !['if', 'for', 'while', 'switch', 'catch'].includes(name)) {
        seen.add(name);
        functions.push({ name, type: isAsync ? 'async' : 'sync' });
      }
    }
    
    return functions;
  }

  /**
   * Generate test stub for a function
   */
  generateTestStub(functionName, isAsync) {
    const asyncKeyword = isAsync ? 'async ' : '';
    
    return `
  test('should test ${functionName}', ${asyncKeyword}() => {
    // TODO: Implement test for ${functionName}
    ${isAsync ? '// This is an async function' : '// This is a sync function'}
    expect(true).toBe(true); // Placeholder
  });`;
  }

  /**
   * Check if a function is tested
   */
  isFunctionTested(testContent, functionName) {
    const testPattern = new RegExp(`test\\([^)]*${functionName}[^)]*\\)`, 'i');
    return testPattern.test(testContent);
  }

  /**
   * Generate patch report
   */
  generateReport() {
    console.log('\n📊 Dynamic Patch Report');
    console.log('═══════════════════════════════════════');
    console.log(`Total patches applied: ${this.patchHistory.length}`);
    
    if (this.patchHistory.length > 0) {
      console.log('\nRecent patches:');
      this.patchHistory.slice(-5).forEach((patch, index) => {
        console.log(`  ${index + 1}. ${path.basename(patch.testFile)}`);
        console.log(`     Module: ${path.basename(patch.module)}`);
        console.log(`     Tests added: ${patch.addedTests}`);
        console.log(`     Time: ${patch.timestamp.toISOString()}`);
      });
    }
  }
}

// Export for use in tests
module.exports = DynamicPatcher;
