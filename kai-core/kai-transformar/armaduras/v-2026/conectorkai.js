// BARRAMENTO K-AI V-2026
const PECAS = ['capacete','pescoco','nucleo','pelvis','luvas','botas'];

window.addEventListener('message', e => {
  console.log('K-AI BUS:', e.data);
  
  // Se veio da Penugem, manda pro Núcleo
  if(e.data.origem === 'penugem'){
    document.getElementById('nucleo').contentWindow.postMessage(e.data, '*');
  }
  
  // Se veio do Núcleo, distribui
  if(e.data.origem === 'nucleo'){
    PECAS.forEach(p => {
      let el = document.getElementById(p);
      if(el) el.contentWindow.postMessage(e.data, '*');
    });
  }
});
