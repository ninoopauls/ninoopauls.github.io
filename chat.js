// Get a reference to the chat form and chat box elements
const chatForm = document.querySelector('#chat-form');
const chatBox = document.querySelector('#chat-box');

// Get the channel and nickname input elements
const channelInput = document.getElementById('channel');
const nicknameInput = document.getElementById('nickname');

// Check if the values are already stored in localStorage
if (localStorage.channel) {
  channelInput.value = localStorage.channel;
  loadChatMessages(channelInput.value);
}

if (localStorage.nickname) {
  nicknameInput.value = localStorage.nickname;
}

// Listen for changes on the channel and nickname input elements
channelInput.addEventListener('input', () => {
  localStorage.channel = channelInput.value;
});

nicknameInput.addEventListener('input', () => {
  localStorage.nickname = nicknameInput.value;
});

// Listen for form submission
chatForm.addEventListener('submit', (event) => {
  event.preventDefault();

  // Get the nickname and message from the form
  const nickname = chatForm['nickname'].value;
  const message = chatForm['message'].value;
  const channel = chatForm['channel'].value;

  // Save the message to the database
  const messageData = {
    nickname: nickname,
    message: message,
    timestamp: Date.now()
  };
  firebase.database().ref(channel).push(messageData);

  // Reset the form
  chatForm['message'].value = ''
  chatForm['message'].focus();
});

// Listen for new chat messages and add them to the chat box
function loadChatMessages(channel) {
  // Assign colors based on nickname
  function getColor(nickname) {
    // Generate a hash value for the nickname
    var hash = 0;
    for (var i = 0; i < nickname.length; i++) {
      hash = nickname.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Convert the hash value to an RGB color
    var color = (hash & 0x00FFFFFF)
      .toString(16)
      .toUpperCase();
    while (color.length < 6) {
      color = "0" + color;
    }
    return "#" + color;
  }

  // Call the firebase function with the new value
  firebase.database().ref(channel).on('child_added', (snapshot) => {
    const message = snapshot.val();
    const chatMessage = document.createElement('p');
    chatMessage.innerText = `${message.nickname}: ${message.message}`;

    chatBox.appendChild(chatMessage);
    chatBox.scrollTop = chatBox.scrollHeight;
    chatMessage.style.color = getColor(message.nickname);


    if (message.nickname != chatForm['nickname'].value) {
      // Create an audio element

      const audio = new Audio('ChatAlert.mp3');

      // Add an event listener for when the sound finishes playing
      audio.addEventListener('ended', () => {
        console.log('Sound finished playing');
      });

      // Play the sound
      audio.volume = 0.01;
      audio.play();
    }
  });
}

// Add an event listener to the textbox that listens for the "change" event
let currentValue = channelInput.value;
channelInput.addEventListener('change', () => {
  const newValue = channelInput.value;
  if (currentValue !== newValue) {
    chatBox.innerText = '';
    currentValue = newValue;
    loadChatMessages(currentValue);
  }
});
