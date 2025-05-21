document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('chatbot-toggle');
  const box = document.getElementById('chatbot-box');
  const input = document.getElementById('chatbot-input');
  const messages = document.getElementById('chatbot-messages');

  let chatHistorial = [];

  toggle.addEventListener('click', () => {
    box.classList.toggle('hidden');
    if (!box.classList.contains('hidden')) {
      renderizarMensajes();
      input.focus();
    }
  });

  input.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter' && input.value.trim() !== '') {
      const mensaje = input.value.trim();
      agregarMensaje('Tú', mensaje);
      input.value = '';

      try {
        const res = await fetch('/api/chatbot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mensaje })
        });
        const data = await res.json();
        agregarMensaje('Bot', data.respuesta);
      } catch (err) {
        agregarMensaje('Error', 'No se pudo conectar con el bot.');
      }
    }
  });

  function agregarMensaje(remitente, texto) {
    chatHistorial.push({ remitente, texto });
    renderizarMensajes();
  }

  function renderizarMensajes() {
    messages.innerHTML = '';
    chatHistorial.forEach(({ remitente, texto }) => {
      const div = document.createElement('div');
      div.classList.add(remitente === 'Tú' ? 'mensaje-usuario' : 'mensaje-bot');
      div.textContent = texto;
      messages.appendChild(div);
    });
    messages.scrollTop = messages.scrollHeight;
  }
});
