import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions, Socket } from 'socket.io';
import * as http from 'http';
import { JwtService } from '@nestjs/jwt';
import { JwtConsts } from 'src/auth/constants/constants';

export class GatewayAdapter extends IoAdapter {
  private jwtService = new JwtService({
    secret: JwtConsts.at_secret,
  });
  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);
    server.use((client: Socket, next) => {
      const req = client.request as http.IncomingMessage;
      if (req.headers.cookie) {
        const cookies = req.headers.cookie
          .split(';')
          .reduce((acc: any, cookie: string) => {
            const [key, value] = cookie.trim().split('=');
            acc[key] = value;
            return acc;
          }, {});

        client['cookies'] = cookies; // Store the cookies in the socket for later use
      } else {
        client['cookies'] = {}; // No cookies found
        return next(new Error('Unauthorized'));
      }

      try {
        const decoded = this.jwtService.verify(
          client['cookies']['X-Access-Token'],
        );
        client.data.user = decoded;
      } catch (error) {
        return next(new Error('Unauthorized'));
      }
      return next();
    });
    return server;
  }
}
