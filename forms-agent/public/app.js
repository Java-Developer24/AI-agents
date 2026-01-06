const form = document.getElementById('chatForm');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

function addMessage(text, cls='bot'){
  const el = document.createElement('div');
  el.className = 'msg ' + (cls === 'user' ? 'user' : 'bot');
  el.textContent = text;
  messages.appendChild(el);
  messages.scrollTop = messages.scrollHeight;
}

form.addEventListener('submit', async (e) =>{
  e.preventDefault();
  const text = input.value.trim();
  if(!text) return;
  addMessage(text, 'user');
  input.value = '';
  addMessage('…thinking…', 'bot');
  try{
    const res = await fetch('/chat', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ message: text })
    });
    const data = await res.json();
    // remove the thinking message
    const last = messages.querySelector('.msg.bot:last-child');
    if(last && last.textContent === '…thinking…') last.remove();

    if(!data.success){
      addMessage('Error: ' + (data.error || 'Unknown'), 'bot');
      return;
    }

    // Display a short summary of the returned result
    const result = data.result;
    if(result && result.questions){
      addMessage('Generated ' + result.questions.length + ' questions:', 'bot');
      for(const q of result.questions){
        addMessage(JSON.stringify(q), 'bot');
      }
    } else {
      addMessage(JSON.stringify(result), 'bot');
    }
  }catch(err){
    addMessage('Network error: ' + err.message, 'bot');
  }
});
