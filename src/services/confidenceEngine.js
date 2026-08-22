import { FaceLandmarker, PoseLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

/**
 * @typedef {Object} ConfidenceMetrics
 * @property {number} eyeContact   - 0-100, measures iris centering
 * @property {number} posture      - 0-100, measures shoulder tilt
 * @property {number} stability    - 0-100, measures head movement variance
 * @property {number} total        - Weighted composite: eyes 45%, posture 35%, stability 20%
 */

class ConfidenceEngine {
  constructor() {
    this.faceLandmarker = null;
    this.poseLandmarker = null;
    this.noseHistory = [];
    this.HISTORY_LIMIT = 30;
    this.initialized = false;
    this.initializing = false;
  }

  /** Initialise the MediaPipe Face + Pose Landmarkers (downloads WASM + model once, cached by browser). */
  async initialize() {
    if (this.initialized || this.initializing) return;
    this.initializing = true;

    try {
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/wasm'
      );

      this.faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
        },
        runningMode: 'VIDEO',
        numFaces: 1,
      });

      this.poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
        },
        runningMode: 'VIDEO',
        numPoses: 1,
      });

      this.initialized = true;
      console.log('[ConfidenceEngine] Initialized');
    } catch (error) {
      console.error('[ConfidenceEngine] Failed to initialize:', error);
      this.initializing = false;
      throw error;
    }
  }

  /** Eye contact score (45% of total): measures pupil centering relative to eye corners. */
  calculateEyeContact(landmarks) {
    // Iris landmarks 468-471 = left iris center
    const irisPoints = [468, 469, 470, 471].map((i) => landmarks[i]);
    const iris = {
      x: irisPoints.reduce((s, p) => s + p.x, 0) / irisPoints.length,
      y: irisPoints.reduce((s, p) => s + p.y, 0) / irisPoints.length,
    };
    const innerCorner = landmarks[133]; // inner corner of left eye
    const outerCorner = landmarks[33];  // outer corner of left eye

    const ratio = (iris.x - innerCorner.x) / (outerCorner.x - innerCorner.x);
    const deviation = Math.abs(ratio - 0.5);
    return Math.max(0, 100 - deviation * 300);
  }

  /** Posture score (35% of total): measures shoulder horizontal tilt. */
  calculatePosture(landmarks) {
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const tilt = Math.abs(leftShoulder.y - rightShoulder.y);
    return Math.max(0, 100 - tilt * 500);
  }

  /** Stability score (20% of total): measures nose tip movement variance over last 30 frames. */
  calculateStability(noseLandmark) {
    this.noseHistory.push({ x: noseLandmark.x, y: noseLandmark.y });
    if (this.noseHistory.length > this.HISTORY_LIMIT) this.noseHistory.shift();
    if (this.noseHistory.length < 2) return 100;

    const variance = (arr) => {
      const avg = arr.reduce((s, v) => s + v, 0) / arr.length;
      return arr.reduce((s, v) => s + Math.pow(v - avg, 2), 0) / arr.length;
    };

    const vx = variance(this.noseHistory.map((p) => p.x));
    const vy = variance(this.noseHistory.map((p) => p.y));
    return Math.max(0, 100 - ((vx + vy) / 2) * 150000);
  }

  /**
   * Process a single video frame and return confidence metrics.
   * @param {HTMLVideoElement} video
   * @param {number} timestamp  - performance.now()
   * @returns {ConfidenceMetrics | null}
   */
  processFrame(video, timestamp) {
    if (!this.initialized || !this.faceLandmarker || !this.poseLandmarker) return null;
    if (!video || video.readyState < 2) return null;

    try {
      const faceResults = this.faceLandmarker.detectForVideo(video, timestamp);
      const poseResults = this.poseLandmarker.detectForVideo(video, timestamp);

      let eyeContact = 0;
      let posture = 50; // default neutral if no pose
      let stability = 100;

      if (faceResults.faceLandmarks?.[0]) {
        eyeContact = this.calculateEyeContact(faceResults.faceLandmarks[0]);
      }

      if (poseResults.landmarks?.[0]) {
        posture = this.calculatePosture(poseResults.landmarks[0]);
        stability = this.calculateStability(poseResults.landmarks[0][0]); // index 0 = nose in BlazePose
      }

      // Weighted composite: Eye Contact 45%, Posture 35%, Stability 20%
      const total = eyeContact * 0.45 + posture * 0.35 + stability * 0.20;

      return {
        eyeContact: Math.round(eyeContact),
        posture: Math.round(posture),
        stability: Math.round(stability),
        total: Math.round(total),
      };
    } catch (err) {
      // Silently handle cases where video frame isn't ready yet
      return null;
    }
  }
}

// Singleton - one engine instance shared across the app
export const confidenceEngine = new ConfidenceEngine();
export default confidenceEngine;
