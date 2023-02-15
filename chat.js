  // Get a reference to the chat form and chat box elements
const chatForm = document.querySelector('#chat-form');
const chatBox = document.querySelector('#chat-box');

// Listen for form submission
chatForm.addEventListener('submit', (event) => {
  event.preventDefault();

  // Get the nickname and message from the form
  const nickname = chatForm['nickname'].value;
  const message = chatForm['message'].value;
  const channel = chatForm['channel'].value;
  

  // Add the message to the chat box
  const chatMessage = document.createElement('p');
  chatMessage.innerText = `${nickname}: ${message}`;
  //chatBox.appendChild(chatMessage);

  // Save the message to the database
  const messageData = {
    nickname: nickname,
    message: message,
    timestamp: Date.now()
  };
  firebase.database().ref(channel).push(messageData);

  // Reset the form
  //chatForm.reset();
  chatForm['message'].value=''
  chatForm['message'].focus();
});

// Listen for new chat messages and add them to the chat box
const channelInput = document.getElementById('channel');

// Add an event listener to the textbox that listens for the "change" event



// Add a variable to keep track of the current value of the textbox
let currentValue = channelInput.value;

// Add an event listener to the textbox that listens for the "change" event
channelInput.addEventListener('change', () => {
  // Get the new value of the textbox
  const newValue = channelInput.value;
  
  // Only clear the chat box if the value has really changed
  if (currentValue !== newValue) {
    chatBox.innerText = '';
    currentValue = newValue;
  }
  

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
  firebase.database().ref(currentValue).on('child_added', (snapshot) => {
    const message = snapshot.val();
    const chatMessage = document.createElement('p');
    chatMessage.innerText = `${message.nickname}: ${message.message}`;
    
    chatBox.appendChild(chatMessage);
    chatMessage.style.color = getColor(message.nickname);
  });
});


