// File: tests/unit/mqm.test.js
// 🧪 Unit Tests for MQM (Model Queue Manager)

const { MQM } = require('../../backend/models/MQM');

describe('MQM - Model Queue Manager', () => {
  let mqm;

  beforeEach(() => {
    mqm = new MQM();
  });

  test('should initialize with default queues', () => {
    expect(mqm.queues.size).toBeGreaterThan(0);
  });

  test('should start queue processor', () => {
    mqm.startProcessor(5000);
    expect(mqm.isProcessing).toBe(true);
    expect(mqm.processingInterval).toBeDefined();
    mqm.stopProcessor();
  });

  test('should stop queue processor', () => {
    mqm.startProcessor(5000);
    mqm.stopProcessor();
    expect(mqm.isProcessing).toBe(false);
    expect(mqm.processingInterval).toBeNull();
  });

  test('should not start processor twice', () => {
    mqm.startProcessor(5000);
    const firstInterval = mqm.processingInterval;
    mqm.startProcessor(5000);
    expect(mqm.processingInterval).toBe(firstInterval);
    mqm.stopProcessor();
  });

  test('should handle stop when not running', () => {
    mqm.stopProcessor();
    expect(mqm.isProcessing).toBe(false);
  });
});

module.exports = {};
