import { INestApplicationContext, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions } from 'socket.io';
import { SocketWithAuth } from './modules/polls/types';

export class SocketIOAdapter extends IoAdapter {
  private readonly logger = new Logger(SocketIOAdapter.name);
  constructor(
    private app: INestApplicationContext,
    private configService: ConfigService,
  ) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions) {
    const clientPort = Number(
      this.configService.get<string>('CLIENT_PORT'),
    );

    if (!clientPort) {
      throw new Error('CLIENT_PORT is not defined');
    }

    const cors: ServerOptions['cors'] = {
      origin: [
        `http://localhost:${clientPort}`,
        new RegExp(`^http://192\\.168\\.1\\.([1-9]|[1-9]\\d):${clientPort}$`),
      ],
      credentials: true,
    };

    this.logger.log('Configuring Socket.IO CORS', cors);

    const optionsWithCORS = {
      ...(options ?? {}),
      cors,
    } as ServerOptions;

    const jwtService = this.app.get(JwtService);
    const server = super.createIOServer(port, optionsWithCORS) as Server;

    server.of('polls').use(createTokenMiddleware(jwtService, this.logger));

    return server;
  }
}

const createTokenMiddleware =
  (jwtService: JwtService, logger: Logger) =>
  (socket: SocketWithAuth, next) => {
    // for Postman testing support, fallback to token header
    const token =
      socket.handshake.auth.token || socket.handshake.headers['token'];

    logger.debug(`Validating auth token before connection: ${token}`);

    try {
      const payload = jwtService.verify(token);
      socket.userID = payload.sub;
      socket.pollID = payload.pollID;
      socket.name = payload.name;
      next();
    } catch {
      next(new Error('FORBIDDEN'));
    }
  };




// import { INestApplicationContext, Logger } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { IoAdapter } from '@nestjs/platform-socket.io';
// import { ServerOptions } from 'socket.io';

// export class SocketIOAdapter extends IoAdapter {
//   private readonly logger = new Logger(SocketIOAdapter.name);

//   constructor(
//     private readonly app: INestApplicationContext,
//     private readonly configService: ConfigService,
//   ) {
//     super(app);
//   }

//   createIOServer(port: number, options?: ServerOptions) {
//     const clientPort = Number(
//       this.configService.get<string>('CLIENT_PORT'),
//     );

//     if (!clientPort) {
//       throw new Error('CLIENT_PORT is not defined');
//     }

//     const cors: ServerOptions['cors'] = {
//       origin: [
//         `http://localhost:${clientPort}`,
//         new RegExp(`^http://192\\.168\\.1\\.([1-9]|[1-9]\\d):${clientPort}$`),
//       ],
//       credentials: true,
//     };

//     this.logger.log('Configuring Socket.IO CORS', cors);

//     return super.createIOServer(port, {
//       ...(options ?? {}),
//       cors,
//     } as ServerOptions);
//   }
// }
