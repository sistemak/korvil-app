export const cgm_config = {
  camera: {
    permission: "during_app",
    front_camera: true,
  },
  calibration: {
    pinch_threshold: 0.05,
    hand_confidence: 0.7,
    detection_zone: { x: 0.3, y: 0.3, w: 0.4, h: 0.4 }
  },
  gestures: {
    indicador_toque: "scroll_down",
    medio_toque: "scroll_up",
  }
}

export const save_calibration = (new_values) => {
  local_storage.set_item('cgm_calibration', json.stringify(new_values));
}

export const load_calibration = () => {
  const data = local_storage.get_item('cgm_calibration');
  return data? json.parse(data) : cgm_config;
}
