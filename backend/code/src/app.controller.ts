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
	// emit event to startGame
		console.log('start');
	  socket.emit("startGame");
    }
  </script>

  <input type="text" id="messageInput" onkeydown="streamMessage(event)">
  <button onclick="start()">start</button>

  <script>
    function streamMessage(event) {
      if (event.key === "ArrowUp") {
		socket.emit("move")
      }
    }

    // Listen for events from the server
    socket.on("game.launched", (data) => {
      console.log("Received from server:", data);
    });
  </script>
</body>
</html>
`;
  }
}
