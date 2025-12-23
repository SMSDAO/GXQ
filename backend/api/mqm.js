// File: backend/api/mqm.js
// 📋 MQM API Endpoints

const express = require('express');
const router = express.Router();
const { mqmInstance } = require('../models/MQM');

// Enqueue a job
router.post('/enqueue', async (req, res) => {
  try {
    const { queueName, modelType, input, priority } = req.body;
    
    if (!queueName || !modelType || !input) {
      return res.status(400).json({ 
        error: 'Missing required fields: queueName, modelType, input' 
      });
    }
    
    const job = await mqmInstance.enqueue(queueName, modelType, input, priority);
    
    res.status(201).json({
      success: true,
      job: {
        jobId: job.jobId,
        queueName,
        modelType: job.modelType,
        status: job.status
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: error.message 
    });
  }
});

// Get queue status
router.get('/queues/:queueName/status', async (req, res) => {
  try {
    const { queueName } = req.params;
    const status = await mqmInstance.getQueueStatus(queueName);
    
    res.json({
      success: true,
      status
    });
  } catch (error) {
    res.status(404).json({ 
      error: error.message 
    });
  }
});

// Get all queue statuses
router.get('/queues/status/all', async (req, res) => {
  try {
    const statuses = await mqmInstance.getAllQueueStatuses();
    
    res.json({
      success: true,
      count: statuses.length,
      queues: statuses
    });
  } catch (error) {
    res.status(500).json({ 
      error: error.message 
    });
  }
});

// Start queue processor
router.post('/processor/start', async (req, res) => {
  try {
    const { intervalMs } = req.body;
    mqmInstance.startProcessor(intervalMs || 10000);
    
    res.json({
      success: true,
      message: 'Queue processor started',
      interval: intervalMs || 10000
    });
  } catch (error) {
    res.status(500).json({ 
      error: error.message 
    });
  }
});

// Stop queue processor
router.post('/processor/stop', async (req, res) => {
  try {
    mqmInstance.stopProcessor();
    
    res.json({
      success: true,
      message: 'Queue processor stopped'
    });
  } catch (error) {
    res.status(500).json({ 
      error: error.message 
    });
  }
});

// Update queue configuration
router.patch('/queues/:queueName/config', async (req, res) => {
  try {
    const { queueName } = req.params;
    const updates = req.body;
    
    const queue = await mqmInstance.updateQueueConfig(queueName, updates);
    
    res.json({
      success: true,
      queue
    });
  } catch (error) {
    res.status(500).json({ 
      error: error.message 
    });
  }
});

// Pause queue
router.post('/queues/:queueName/pause', async (req, res) => {
  try {
    const { queueName } = req.params;
    await mqmInstance.pauseQueue(queueName);
    
    res.json({
      success: true,
      message: `Queue ${queueName} paused`
    });
  } catch (error) {
    res.status(500).json({ 
      error: error.message 
    });
  }
});

// Resume queue
router.post('/queues/:queueName/resume', async (req, res) => {
  try {
    const { queueName } = req.params;
    await mqmInstance.resumeQueue(queueName);
    
    res.json({
      success: true,
      message: `Queue ${queueName} resumed`
    });
  } catch (error) {
    res.status(500).json({ 
      error: error.message 
    });
  }
});

// Clear queue
router.post('/queues/:queueName/clear', async (req, res) => {
  try {
    const { queueName } = req.params;
    const result = await mqmInstance.clearQueue(queueName);
    
    res.json({
      success: true,
      message: `Queue ${queueName} cleared`,
      cancelledJobs: result.modifiedCount
    });
  } catch (error) {
    res.status(500).json({ 
      error: error.message 
    });
  }
});

// Get historical statistics
router.get('/queues/:queueName/stats', async (req, res) => {
  try {
    const { queueName } = req.params;
    const { days } = req.query;
    
    const stats = await mqmInstance.getHistoricalStats(
      queueName, 
      parseInt(days) || 7
    );
    
    res.json({
      success: true,
      queueName,
      days: parseInt(days) || 7,
      stats
    });
  } catch (error) {
    res.status(500).json({ 
      error: error.message 
    });
  }
});

module.exports = router;
