const app = document.querySelector(".app");
const socket = io(); // Connect to the server
let uname;

// Function to format time
function formatTime(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // If hour is 0, make it 12
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutes} ${ampm}`;
}

// Join user event
app.querySelector("#join-user").addEventListener('click', () => {
    let username = app.querySelector("#username").value;
    if (username.length === 0) {
        return; // Prevent empty usernames
    }

    uname = username;
    socket.emit("newuser", username); // Emit new user event

    // Switch to chat screen
    app.querySelector(".join-screen").classList.remove("active");
    app.querySelector(".chat-screen").classList.add("active");
});

// Send message
app.querySelector("#send-message").addEventListener('click', () => {
    let message = app.querySelector("#message-input").value;
    if (message.length === 0) {
        return; // Prevent empty messages
    }

    const timestamp = formatTime(new Date());

    // Emit message to server
    socket.emit("chat", {
        username: uname,
        text: message,
        time: timestamp
    });

    // Add message to chat screen (right side for user)
    app.querySelector(".messages").innerHTML += `
        <div class="message my-message">
            <div><strong>You:</strong> ${message} <span class="time">${timestamp}</span></div>
        </div>
    `;

    // Clear the message input
    app.querySelector("#message-input").value = "";
});

// Listen for messages from others
socket.on("chat", message => {
    if (message.username !== uname) {
        app.querySelector(".messages").innerHTML += `
            <div class="message other-message">
                <div><strong>${message.username}:</strong> ${message.text} <span class="time">${message.time}</span></div>
            </div>
        `;
    }
});

// Listen for new user updates
socket.on("update", message => {
    app.querySelector(".messages").innerHTML += `
        <div class="update">${message}</div>
    `;
});

// Exit chat event
app.querySelector("#exit-chat").addEventListener('click', () => {
    // Switch back to join screen
    app.querySelector(".chat-screen").classList.remove("active");
    app.querySelector(".join-screen").classList.add("active");
});
