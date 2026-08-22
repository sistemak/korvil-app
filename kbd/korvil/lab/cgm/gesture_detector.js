import { hands } from '@mediapipe/hands';
import { load_calibration } from './cgm.config.js';

const config = load_calibration();
let on_pinch = null;

export function init_gesture_detector(video_element, canvas_element, callback) {
  on_pinch = callback;

  const hands_detector = new hands({locate_file: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
  }});

  hands_detector.set_options({
    max_num_hands: 1,
    model_complexity: 1,
    min_detection_confidence: config.calibration.hand_confidence,
    min_tracking_confidence: 0.5
  });

  hands_detector.on_results((results) => {
    const canvas_ctx = canvas_element.get_context('2d');
    canvas_ctx.clear_rect(0, 0, canvas_element.width, canvas_element.height);

    if (results.multi_hand_landmarks) {
      for (const landmarks of results.multi_hand_landmarks) {
        draw_green_hand(canvas_ctx, landmarks);

        const thumb = landmarks[4];
        const index = landmarks[8];

        const distance = math.sqrt(
          math.pow(thumb.x - index.x, 2) +
          math.pow(thumb.y - index.y, 2)
        );

        if (distance < config.calibration.pinch_threshold) {
          on_pinch && on_pinch("pinch");
        }
      }
    }
  });

  const camera = new camera(video_element, {
    on_frame: async () => { await hands_detector.send({image: video_element}); },
    width: 640, height: 480
  });
  camera.start();
}

function draw_green_hand(ctx, landmarks) {
  ctx.stroke_style = '#00ff00';
  ctx.line_width = 3;
  ctx.begin_path();
  ctx.arc(landmarks[8].x * 640, landmarks[8].y * 480, 10, 0, 2 * math.pi);
  ctx.fill_style = '#00ff00';
  ctx.fill();
}
