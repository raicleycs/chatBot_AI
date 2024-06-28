const apiKey = ''; //Chave API

async function sendMessage() {
    var message = document.getElementById('message-input');
    if (!message.value) {
        message.style.border = '1px solid red';
        return;
    }
    message.style.border = 'none';

    var status = document.getElementById('status');
    var btnSubmit = document.getElementById('btn-submit');

    status.style.display = 'block';
    status.innerHTML = 'Carregando...';
    btnSubmit.disabled = true;
    btnSubmit.style.cursor = 'not-allowed';
    message.disabled = true;

    let attempts = 0;
    let success = false;
    let maxAttempts = 5;

    while (attempts < maxAttempts && !success) {
        try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`, // Corrigido
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [
                        { role: "system", content: "Você é um assistente virtual..." },
                        { role: "system", content: "Mais dados..." },  
                        { role: "user", content: message.value }
                    ],
                    max_tokens: 150, // tamanho da resposta
                    temperature: 0.6 // criatividade na resposta
                })
            });

            if (!response.ok) {
                if (response.status === 429) {
                    // Espera exponencial em caso de erro 429 (Too Many Requests)
                    let waitTime = Math.pow(2, attempts) * 1000; // Espera em milissegundos
                    console.log(`Too many requests. Waiting for ${waitTime} ms before retrying...`);
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                    attempts++;
                } else {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            } else {
                const responseData = await response.json();
                if (responseData.choices && responseData.choices.length > 0) {
                    let r = responseData.choices[0].message.content;
                    status.style.display = 'none';
                    showHistory(message.value, r);
                    success = true;
                } else {
                    throw new Error("No choices found in the response.");
                }
            }
        } catch (e) {
            console.log(`Error -> ${e}`);
            status.innerHTML = 'Erro, tente novamente mais tarde...';
        } finally {
            if (success || attempts >= maxAttempts) {
                btnSubmit.disabled = false;
                btnSubmit.style.cursor = 'pointer';
                message.disabled = false;
                message.value = '';
            }
        }
    }
}

function showHistory(message, response) {
    var historyBox = document.getElementById('history');

    // My message
    var boxMyMessage = document.createElement('div');
    boxMyMessage.className = 'box-my-message';

    var myMessage = document.createElement('p');
    myMessage.className = 'my-message';
    myMessage.innerHTML = message;

    boxMyMessage.appendChild(myMessage);
    historyBox.appendChild(boxMyMessage);

    // Response message
    var boxResponseMessage = document.createElement('div');
    boxResponseMessage.className = 'box-response-message';

    var chatResponse = document.createElement('p');
    chatResponse.className = 'response-message';
    chatResponse.innerHTML ='<div class="bot"><img class="imgBot" src="img/icon.png"><p>ChatBot</p><br><br></div>' + response;

    boxResponseMessage.appendChild(chatResponse);
    historyBox.appendChild(boxResponseMessage);

    // Levar scroll para o final
    historyBox.scrollTop = historyBox.scrollHeight;
}


function toggleChat() {
    var chatContainer = document.getElementById('chat-container');
    var icon = document.getElementById('chatIcon');
    if (chatContainer.style.display === 'flex') {   
        icon.classList.remove('fa-circle-xmark');
        icon.classList.add('fa-comment');        
        chatContainer.classList.add('show-chat-off');   
        chatContainer.classList.remove('show-chat-on');
        setTimeout(() => {
            chatContainer.style.display = 'none';              
        }, 300);         
    } else {
        icon.classList.remove('fa-comment');
        icon.classList.add('fa-circle-xmark');
        chatContainer.style.display = 'flex';
        chatContainer.classList.remove('show-chat-off');
        chatContainer.classList.add('show-chat-on');
    }
  }