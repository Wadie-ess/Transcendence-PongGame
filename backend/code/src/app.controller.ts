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
    return `<!doctype html>
<html lang="en">
  <head>
    <title></title>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link href="css/style.css" rel="stylesheet" />
  </head>
  <body>
    <script type="module">
      import { io } from 'https://cdn.socket.io/4.4.1/socket.io.esm.min.js';

      const socket = io("http://localhost:3004", {
transports: ['websocket'],
withCredentials: true,
});

socket.on('connect', (scoket) => {
socket.on('message', (data) => {
 const message = document.createElement('div');
 message.innerHTML = JSON.stringify(data);
 document.body.appendChild(message);
 });

socket.on('error', (error) => {
});
});

socket.on('disconnect', () => {
});

socket.on('error', (error) => {
});



    </script>
  </body>
</html>
`;
  }
}
