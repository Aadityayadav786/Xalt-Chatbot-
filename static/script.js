document.getElementById('chat-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = document.getElementById('user-input');
    const message = input.value.trim();
    if (!message) return;

    appendMessage('user', message);
    input.value = '';

    const sessionId = sessionStorage.getItem('session_id') || Date.now().toString();
    sessionStorage.setItem('session_id', sessionId);  // Store for reuse

    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, session_id: sessionId })
        });

        const data = await response.json();

        if (data.error) {
            appendMessage('bot', '⚠️ Sorry, something went wrong.');
            console.error(data.error);
        } else {
            appendMessage('bot', data.response);
        }
    } catch (err) {
        appendMessage('bot', '⚠️ Network error. Please try again.');
        console.error(err);
    }
});

function appendMessage(sender, text) {
    const container = document.getElementById('chat-container');
    const messageEl = document.createElement('div');
    messageEl.className = `message ${sender}-message`;

    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.innerHTML = text;

    if (sender === 'bot') {
        bubble.querySelectorAll('a').forEach(a => {
            a.setAttribute('target', '_blank');
            a.setAttribute('rel', 'noopener noreferrer');
        });
        
        const avatar = document.createElement('img');
        avatar.src = '/static/assets/xaltanalytics_logo.jpg';
        avatar.className = 'bot-avatar';  // Must be styled in CSS with border-radius: 50%
        messageEl.appendChild(avatar);
    }

    messageEl.appendChild(bubble);
    container.appendChild(messageEl);
    container.scrollTop = container.scrollHeight;
}



async function sendInitialGreeting() {
    const sessionId = sessionStorage.getItem('session_id') || Date.now().toString();
    sessionStorage.setItem('session_id', sessionId);  // Store for reuse

    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: '__start__', session_id: sessionId })
        });

        const data = await response.json();

        if (data.error) {
            appendMessage('bot', '⚠️ Failed to start chat.');
            console.error(data.error);
        } else {
            appendMessage('bot', data.response);
        }
    } catch (err) {
        appendMessage('bot', '⚠️ Network error.');
        console.error(err);
    }
}



window.addEventListener('load', sendInitialGreeting);


document.getElementById('chat-container').addEventListener('click', function(e) {
  if (e.target.tagName === 'A' && e.target.target === '_blank') {
    // Just to confirm link behavior, this is usually not needed
    // but you can force open it manually to test:
    window.open(e.target.href, '_blank');
    e.preventDefault();
  }
});
