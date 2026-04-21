# 🧪 TradeOS Test Suite

This directory contains the comprehensive test suite for TradeOS.

## Directory Structure

```
tests/
├── unit/           # Unit tests for individual components
├── integration/    # Integration tests for system components
└── e2e/           # End-to-end tests for full workflows
```

## Running Tests

### All Tests
```bash
npm test
```

### Unit Tests Only
```bash
npm test -- tests/unit
```

### Integration Tests Only
```bash
npm test -- tests/integration
```

### With Coverage
```bash
npm test -- --coverage
```

## Test Files

### Unit Tests
- `mxm.test.js` - Tests for Model eXecution Manager (MXM)
- `mqm.test.js` - Tests for Model Queue Manager (MQM)

### Integration Tests
- `system.test.js` - Tests for complete system integration

## Writing Tests

Tests use Jest as the test framework. Follow these conventions:

```javascript
describe('Feature Name', () => {
  test('should do something specific', () => {
    // Arrange
    const input = 'test';
    
    // Act
    const result = someFunction(input);
    
    // Assert
    expect(result).toBe('expected');
  });
});
```

## Test Coverage Goals

- Unit Tests: 80%+ coverage
- Integration Tests: Key workflows covered
- E2E Tests: Critical user paths

## CI/CD Integration

Tests are automatically run:
- On every commit
- Before deployment
- On pull requests

## Dynamic Test Patching

The test suite includes dynamic patching capabilities:
- Auto-detects new modules
- Generates test stubs for new functions
- Validates model integrity

## Debugging Tests

Run tests in debug mode:
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

Then attach your debugger to the Node process.
