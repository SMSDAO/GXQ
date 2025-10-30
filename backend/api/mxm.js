// File: backend/api/mxm.js
// 🧠 MXM API Endpoints

const express = require('express');
const router = express.Router();
const { mxmInstance, ExecutionJob } = require('../models/MXM');

// Create a new execution job
router.post('/jobs', async (req, res) => {
  try {
    const { modelType, input, priority } = req.body;
    
    if (!modelType || !input) {
      return res.status(400).json({ 
        error: 'Missing required fields: modelType, input' 
      });
    }
    
    const job = await mxmInstance.createJob(modelType, input, priority);
    
    res.status(201).json({
      success: true,
      job: {
        jobId: job.jobId,
        modelType: job.modelType,
        status: job.status,
        createdAt: job.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: error.message 
    });
  }
});

// Execute a job
router.post('/jobs/:jobId/execute', async (req, res) => {
  try {
    const { jobId } = req.params;
    const result = await mxmInstance.executeJob(jobId);
    
    res.json({
      success: true,
      result
    });
  } catch (error) {
    res.status(500).json({ 
      error: error.message 
    });
  }
});

// Get job status
router.get('/jobs/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await mxmInstance.getJobStatus(jobId);
    
    res.json({
      success: true,
      job
    });
  } catch (error) {
    res.status(404).json({ 
      error: error.message 
    });
  }
});

// Get all pending jobs
router.get('/jobs/pending/list', async (req, res) => {
  try {
    const jobs = await mxmInstance.getPendingJobs();
    
    res.json({
      success: true,
      count: jobs.length,
      jobs
    });
  } catch (error) {
    res.status(500).json({ 
      error: error.message 
    });
  }
});

// Process queue
router.post('/process-queue', async (req, res) => {
  try {
    const { maxConcurrent } = req.body;
    await mxmInstance.processQueue(maxConcurrent || 5);
    
    res.json({
      success: true,
      message: 'Queue processing initiated'
    });
  } catch (error) {
    res.status(500).json({ 
      error: error.message 
    });
  }
});

// Get all jobs with filters
router.get('/jobs', async (req, res) => {
  try {
    const { status, modelType, limit } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (modelType) query.modelType = modelType;
    
    const jobs = await ExecutionJob
      .find(query)
      .limit(parseInt(limit) || 100)
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: jobs.length,
      jobs
    });
  } catch (error) {
    res.status(500).json({ 
      error: error.message 
    });
  }
});

module.exports = router;
