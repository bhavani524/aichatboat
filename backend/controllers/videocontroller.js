const Video = require('../models/video');
const { generateVideoFromPrompt } = require('../services/videoservice');

exports.generateVideo = async (req, res, next) => {
  try {
    const { prompt } = req.body;
    const userId = req.user.id;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Save pending video record
    const videoDoc = await Video.create({
      userId,
      prompt,
      status: 'pending',
    });

    // Call video service
    const result = await generateVideoFromPrompt(prompt);

    if (!result.success) {
      videoDoc.status = 'failed';
      await videoDoc.save();
      return res.status(500).json({ error: 'Video generation failed' });
    }

    videoDoc.videoUrl = result.videoUrl;
    videoDoc.status = 'completed';
    await videoDoc.save();

    res.json({
      status: 'success',
      video: videoDoc,
    });
  } catch (err) {
    next(err);
  }
};

exports.getMyVideos = async (req, res, next) => {
  try {
    const videos = await Video.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ status: 'success', videos });
  } catch (err) {
    next(err);
  }
};