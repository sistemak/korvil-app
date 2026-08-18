import { use_effect, use_ref, use_state } from 'react';
import { init_gesture_detector } from './gesture_detector.js';
import { save_calibration, cgm_config } from './cgm.config.js';
import { request_camera_permission } from './utils/permissions.js';

export default function calibration() {
  const video_ref = use_ref(null);
  const canvas_ref = use_ref(null);
  const [step, set_step] = use_state(1);

  use_effect(() => {
    request_camera_permission().then(granted => {
      if(granted) set_step(2);
    })
  }, []);

  use_effect(() => {
    if(step === 2) {
      init_gesture_detector(video_ref.current, canvas_ref.current, (gesture) => {
        if(gesture === "pinch") {
          set_step(3);
          save_calibration({...cgm_config, calibrated: true});
        }
      });
    }
  }, [step]);

  return (
    <div style={{background:'#000', color:'#fff', height:'100vh', display:'flex', flex_direction:'column', align_items:'center', justify_content:'center'}}>

      {step === 1 && (
        <div>
          <h2>vamos tentar.</h2>
          <p>o acesso à câmera é necessário para começar.</p>
          <button on_click={() => request_camera_permission()}>durante o uso do app</button>
        </div>
      )}

      {step === 2 && (
        <div style={{position:'relative'}}>
          <h2>quando a mão verde aparecer, toque juntando o polegar e o indicador</h2>
          <video ref={video_ref} style={{display:'none'}} auto_play plays_inline />
          <canvas ref={canvas_ref} width="640" height="480" />
        </div>
      )}

      {step === 3 && (
        <div>
          <h2>ótimo trabalho!</h2>
          <p>agora, vamos experimentar em um app real.</p>
          <button>toque para abrir o youtube</button>
        </div>
      )}
    </div>
  )
}
