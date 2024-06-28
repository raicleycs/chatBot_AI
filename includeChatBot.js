// includeChatBot.js
document.addEventListener("DOMContentLoaded", function() {
    fetch('chatbot/chat.html')
    .then(response => {
        if (!response.ok) {
            throw new Error('Falha ao carregar a barra de navegação');
        }
        return response.text();
    })
    .then(data => {

        // Carregar o CSS e JS 
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = 'chatbot/css/styleChat.css';
        document.head.appendChild(cssLink);

        const script = document.createElement('script');
        script.src = 'chatbot/main.js';
        script.defer = true;
        document.body.appendChild(script);


        document.body.insertAdjacentHTML('afterend', data);        
    })
    .catch(error => {
        console.error(error);
    });
});
