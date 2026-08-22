
export async function request_camera_permission() {
  try {
    await navigator.media_devices.get_user_media({ video: true });
    return true;
  } catch {
    alert("falha ao salvar a captura de tela. tente novamente");
    return false;
  }
}
