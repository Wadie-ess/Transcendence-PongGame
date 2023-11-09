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
  <script src="https://cdn.socket.io/4.4.1/socket.io.js"></script>
  <title>Socket.io Example</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }

    h1 {
      text-align: center;
      background-color: #333;
      color: #fff;
      padding: 10px;
      margin: 0;
    }

    #container {
      max-width: 800px;
      margin: 20px auto;
      padding: 20px;
      background-color: #fff;
      border-radius: 5px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    ul {
      list-style: none;
      padding: 0;
    }

    li {
      margin: 10px 0;
      padding: 10px;
      background-color: #e6e6e6;
      border-radius: 5px;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    }

    input[type="text"], button {
      display: block;
      width: 100%;
      padding: 10px;
      margin: 5px 0;
      border: 1px solid #ccc;
      border-radius: 3px;
    }

    button {
      background-color: #333;
      color: #fff;
      border: none;
      cursor: pointer;
    }

    form {
      margin-top: 20px;
    }

    label {
      display: block;
      margin-top: 10px;
      font-weight: bold;
    }
  </style>
  <script>
    // Socket.io script
    const socket = io("http://localhost:3004", {
      transports: ['websocket'],
      withCredentials: true,
    });

    // Functions defined here
    function start() {
      console.log('start');
      socket.emit("startGame");
    }

    function streamMessage(event) {
      if (event.key === "ArrowUp") {
        socket.emit("move");
      }
    }

    function displayMessage(data) {
      const messageList = document.getElementById("messageList");
      const messageItem = document.createElement("li");
      messageItem.textContent = "ID: " + data.id + ", Content: " + data.content + ", Time: " + data.time;
      messageList.appendChild(messageItem);
    }

    function banMember() {
      const roomId = document.getElementById("roomIdInput").value;
      const memberId = document.getElementById("memberIdInput").value;

      fetch("http://localhost:3001/rooms/ban", {
        method: "POST",
        body: JSON.stringify({ roomId: roomId, memberId: memberId }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(function(response) {
          if (response.ok) {
            socket.emit("roomDeparture", { roomId: roomId, memberId: memberId });
          } else {
            console.error("Ban request failed");
          }
        })
        .catch(function(error) {
          console.error("Error: " + error);
        });
    }

    function sendMessageToRoom() {
      const roomId = document.getElementById("roomIdInput").value;
      const message = document.getElementById("newMessageInput").value;

const raw = JSON.stringify({"content": message});

      fetch("http://localhost:3001/messages/room/" + roomId, {
        method: "POST",
        body: raw,
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(function(response) {
          if (response.ok) {
            console.log("Message sent to room " + roomId + ": " + message);
          } else {
            console.error("Message sending failed");
          }
        })
        .catch(function(error) {
          console.error("Error: " + error);
        });
    }

    function unbanMember() {
      const roomIdUnban = document.getElementById("roomIdUnbanInput").value;
      const memberIdUnban = document.getElementById("memberIdUnbanInput").value;

      fetch("http://localhost:3001/rooms/unban", {
        method: "POST",
        body: JSON.stringify({ roomId: roomIdUnban, memberId: memberIdUnban }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(function(response) {
          if (response.ok) {
            console.log("Member unbanned successfully.");
          } else {
            console.error("Unban request failed");
          }
        })
        .catch(function(error) {
          console.error("Error: " + error);
        });
    }

    // Listening for the "message" event and displaying messages
    socket.on("message", function(data) {
      displayMessage(data);
    });

function sendFriendRequest() {
  const friendId = document.getElementById("friendIdInput").value;

  fetch("http://localhost:3001/friends/add", {
    method: "POST",
    body: JSON.stringify({ friendId: friendId }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(function(response) {
      if (response.ok) {
        console.log("Friend request sent to: " + friendId);
      } else {
        console.error("Friend request sending failed");
      }
    })
    .catch(function(error) {
      console.error("Error: " + error);
    });
}
 </script>
</head>
<body>
  <h1>Socket.io Example</h1>

  <div id="container">
    <input type="text" id="messageInput" onkeydown="streamMessage(event)" placeholder="Press Arrow Up to Stream Message">
    <button type="button" onclick="start()">Start</button>

    <ul id="messageList"></ul> <!-- Container for displaying messages -->

    <!-- Form to send a POST request to ban a member -->
    <form onsubmit="banMember(event)">
      <label for="roomId">Room ID:</label>
      <input type="text" id="roomIdInput" name="roomId" required>
      <label for="memberId">Member ID:</label>
      <input type="text" id="memberIdInput" name="memberId" required>
      <button type="button" onclick="banMember()">Ban Member</button>
    </form>

    <!-- New message area and button -->
    <input type="text" id="newMessageInput" placeholder="Enter a Message">
    <button type="button" onclick="sendMessageToRoom()">Send Message</button>

    <!-- Unban Member button -->
    <form onsubmit="unbanMember(event)">
      <label for="roomIdUnban">Room ID (Unban):</label>
      <input type="text" id="roomIdUnbanInput" name="roomIdUnban" required>
      <label for="memberIdUnban">Member ID (Unban):</label>
      <input type="text" id="memberIdUnbanInput" name="memberIdUnban" required>
      <button type="button" onclick="unbanMember()">Unban Member</button>
    </form>

<!-- Form to send a POST request to send a friend request -->
<form onsubmit="sendFriendRequest(event)">
  <label for="friendId">Friend ID:</label>
  <input type="text" id="friendIdInput" name="friendId" required>
  <button type="button" onclick="sendFriendRequest()">Send Friend Request</button>
</form>
  </div>
</body>
</html>
`;
  }
}
