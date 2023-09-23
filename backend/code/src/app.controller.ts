import { Controller, Get, Post } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
	constructor (private readonly prisma: PrismaService){}
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
    return 'yo are in';
  }
}
