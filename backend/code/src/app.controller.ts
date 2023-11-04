import { Controller, Get } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController(true)
@Controller()
export class AppController {
  constructor() {}
  @Get('/login')
  logIn() {
    // send the login page
    return `<!DOCTYPE html>
<html lang="en">
	<head>
		<title></title>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link href="css/style.css" rel="stylesheet">
	</head>
	<body>
		<a href="/auth/login/42">login frm here</a>	
	</body>
</html>
`;
  }

  //  @Post('test')
  //  test() {
  // this.prisma.friend.upsert({})
  // }

  @Get()
  // @UseGuards(AuthenticatedGuard)
  home() {
    return `

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Socket.io Example</title>
</head>
<body>
  <h1>Socket.io Example</h1>

  <!-- Connect to the socket server -->
  <script src="https://cdn.socket.io/4.4.1/socket.io.js"></script>
  <script>
    const socket = io("http://localhost:3004", {
      transports: ['websocket'],
      withCredentials: true,
    });

    // Function to send a message
    function start() {
      // Emit event to startGame
      console.log('start');
      socket.emit("startGame");
    }
  </script>

  <input type="text" id="messageInput" onkeydown="streamMessage(event)">
  <button onclick="start()">start</button>

  <ul id="messageList"></ul> <!-- Container for displaying messages -->

  <!-- Form to send a POST request to ban a member -->
  <form onsubmit="banMember(event)">
    <label for="roomId">Room ID:</label>
    <input type="text" id="roomIdInput" name="roomId" required>
    <label for="memberId">Member ID:</label>
    <input type="text" id="memberIdInput" name="memberId" required>
    <button type="submit">Ban Member</button>
  </form>

  <script>
    function streamMessage(event) {
      if (event.key === "ArrowUp") {
        socket.emit("move");
      }
    }

    // Listen for events from the server
    socket.on("message", (data) => {
      console.log("Received from server:", data);

      // Display the message in the DOM
      displayMessage(data);
    });

    function displayMessage(data) {
      const messageList = document.getElementById("messageList");
      const messageItem = document.createElement("li");
      messageItem.textContent = "ID: " + data.id + ", Content: " + data.content + ", Time: " + data.time;
      messageList.appendChild(messageItem);
    }

    function banMember(event) {
      event.preventDefault();
      const roomId = document.getElementById("roomIdInput").value;
      const memberId = document.getElementById("memberIdInput").value;

      fetch("http://localhost:3001/rooms/ban", {
        method: "POST",
        body: JSON.stringify({ roomId, memberId }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            // Request was successful, emit "roomDeparture" event to the server
            socket.emit("roomDeparture", { roomId, memberId });
          } else {
            console.error("Ban request failed");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  </script>
</body>
</html>
`;
  }
}
