// File: backend/models/MQM.js
// 📋 Model Queue Manager (MQM)
// Queue management and job scheduling system for TradeOS

const mongoose = require('mongoose');
const { mxmInstance } = require('./MXM');

// Queue Configuration Schema
const QueueConfigSchema = new mongoose.Schema({
  queueName: { type: String, required: true, unique: true },
  maxConcurrent: { type: Number, default: 5 },
  maxQueueSize: { type: Number, default: 1000 },
  retryDelay: { type: Number, default: 5000 }, // milliseconds
  enabled: { type: Boolean, default: true },
  priority: { type: Number, default: 5 }, // Queue priority
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const QueueConfig = mongoose.model('QueueConfig', QueueConfigSchema);

// Queue Statistics Schema
const QueueStatsSchema = new mongoose.Schema({
  queueName: { type: String, required: true },
  date: { type: Date, default: Date.now },
  jobsProcessed: { type: Number, default: 0 },
  jobsSucceeded: { type: Number, default: 0 },
  jobsFailed: { type: Number, default: 0 },
  averageExecutionTime: { type: Number, default: 0 },
  totalGasUsed: { type: String, default: '0' }
});

const QueueStats = mongoose.model('QueueStats', QueueStatsSchema);

// MQM Core Class
class MQM {
  constructor() {
    this.queues = new Map();
    this.processors = new Map();
    this.isProcessing = false;
    this.processingInterval = null;
    this.initializeDefaultQueues();
  }

  // Initialize default queue configurations
  async initializeDefaultQueues() {
    const defaultQueues = [
      { queueName: 'high-priority', maxConcurrent: 10, priority: 10 },
      { queueName: 'arbitrage', maxConcurrent: 8, priority: 9 },
      { queueName: 'flashloan', maxConcurrent: 5, priority: 8 },
      { queueName: 'swap', maxConcurrent: 15, priority: 7 },
      { queueName: 'liquidity', maxConcurrent: 5, priority: 6 },
      { queueName: 'nft', maxConcurrent: 3, priority: 5 },
      { queueName: 'low-priority', maxConcurrent: 5, priority: 3 }
    ];

    for (const queueDef of defaultQueues) {
      try {
        let queue = await QueueConfig.findOne({ queueName: queueDef.queueName });
        if (!queue) {
          queue = new QueueConfig(queueDef);
          await queue.save();
          console.log(`✅ Created queue: ${queueDef.queueName}`);
        }
        this.queues.set(queueDef.queueName, queue);
      } catch (error) {
        console.error(`Error initializing queue ${queueDef.queueName}:`, error);
      }
    }
  }

  // Add job to queue
  async enqueue(queueName, modelType, input, priority = 5) {
    const queue = await QueueConfig.findOne({ queueName });
    
    if (!queue) {
      throw new Error(`Queue not found: ${queueName}`);
    }

    if (!queue.enabled) {
      throw new Error(`Queue is disabled: ${queueName}`);
    }

    // Create job using MXM
    const job = await mxmInstance.createJob(modelType, input, priority);
    
    console.log(`📥 Enqueued job ${job.jobId} to queue: ${queueName}`);
    return job;
  }

  // Dequeue and process jobs
  async dequeue(queueName) {
    const queue = await QueueConfig.findOne({ queueName });
    
    if (!queue || !queue.enabled) {
      return null;
    }

    // Get pending jobs for this queue type
    const pendingJobs = await mxmInstance.getPendingJobs();
    
    if (pendingJobs.length === 0) {
      return null;
    }

    // Process up to maxConcurrent jobs
    const jobsToProcess = pendingJobs.slice(0, queue.maxConcurrent);
    
    const results = await Promise.allSettled(
      jobsToProcess.map(job => mxmInstance.executeJob(job.jobId))
    );

    // Update queue statistics
    await this.updateQueueStats(queueName, results);

    return results;
  }

  // Update queue statistics
  async updateQueueStats(queueName, results) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let stats = await QueueStats.findOne({ queueName, date: today });
    
    if (!stats) {
      stats = new QueueStats({ queueName, date: today });
    }

    let succeeded = 0;
    let failed = 0;
    
    results.forEach(result => {
      if (result.status === 'fulfilled') {
        succeeded++;
      } else {
        failed++;
      }
    });

    stats.jobsProcessed += results.length;
    stats.jobsSucceeded += succeeded;
    stats.jobsFailed += failed;

    await stats.save();
  }

  // Start queue processor
  startProcessor(intervalMs = 10000) {
    if (this.isProcessing) {
      console.log('⚠️  Queue processor already running');
      return;
    }

    console.log('🚀 Starting queue processor...');
    this.isProcessing = true;

    this.processingInterval = setInterval(async () => {
      try {
        await this.processAllQueues();
      } catch (error) {
        console.error('Error in queue processor:', error);
      }
    }, intervalMs);

    console.log(`✅ Queue processor started (interval: ${intervalMs}ms)`);
  }

  // Stop queue processor
  stopProcessor() {
    if (!this.isProcessing) {
      console.log('⚠️  Queue processor not running');
      return;
    }

    console.log('🛑 Stopping queue processor...');
    
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
    }

    this.isProcessing = false;
    console.log('✅ Queue processor stopped');
  }

  // Process all queues
  async processAllQueues() {
    const queues = await QueueConfig.find({ enabled: true })
      .sort({ priority: -1 });

    for (const queue of queues) {
      try {
        await this.dequeue(queue.queueName);
      } catch (error) {
        console.error(`Error processing queue ${queue.queueName}:`, error);
      }
    }
  }

  // Get queue status
  async getQueueStatus(queueName) {
    const queue = await QueueConfig.findOne({ queueName });
    
    if (!queue) {
      throw new Error(`Queue not found: ${queueName}`);
    }

    const pendingJobs = await mxmInstance.getPendingJobs();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const stats = await QueueStats.findOne({ queueName, date: today });

    return {
      queue,
      pendingJobs: pendingJobs.length,
      stats: stats || {
        jobsProcessed: 0,
        jobsSucceeded: 0,
        jobsFailed: 0
      }
    };
  }

  // Get all queue statuses
  async getAllQueueStatuses() {
    const queues = await QueueConfig.find();
    const statuses = [];

    for (const queue of queues) {
      const status = await this.getQueueStatus(queue.queueName);
      statuses.push(status);
    }

    return statuses;
  }

  // Update queue configuration
  async updateQueueConfig(queueName, updates) {
    const queue = await QueueConfig.findOne({ queueName });
    
    if (!queue) {
      throw new Error(`Queue not found: ${queueName}`);
    }

    Object.assign(queue, updates);
    queue.updatedAt = new Date();
    await queue.save();

    console.log(`✅ Updated queue config: ${queueName}`);
    return queue;
  }

  // Pause queue
  async pauseQueue(queueName) {
    return await this.updateQueueConfig(queueName, { enabled: false });
  }

  // Resume queue
  async resumeQueue(queueName) {
    return await this.updateQueueConfig(queueName, { enabled: true });
  }

  // Clear queue (cancel all pending jobs)
  async clearQueue(queueName) {
    const { ExecutionJob } = require('./MXM');
    
    const result = await ExecutionJob.updateMany(
      { status: 'pending' },
      { $set: { status: 'cancelled' } }
    );

    console.log(`🧹 Cleared queue ${queueName}: ${result.modifiedCount} jobs cancelled`);
    return result;
  }

  // Get historical statistics
  async getHistoricalStats(queueName, days = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const stats = await QueueStats.find({
      queueName,
      date: { $gte: startDate }
    }).sort({ date: 1 });

    return stats;
  }
}

// Export singleton instance
const mqmInstance = new MQM();

module.exports = {
  MQM,
  mqmInstance,
  QueueConfig,
  QueueStats
};
