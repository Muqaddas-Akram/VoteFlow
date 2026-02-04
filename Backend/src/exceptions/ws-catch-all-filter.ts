import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import { SocketWithAuth } from '../modules/polls/types';
import {
  WsBadRequestException,
  WsTypeException,
  WsUnknownException,
} from './ws-exceptions';

//Catch all exceptions
@Catch()
export class WsCatchAllFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const socket: SocketWithAuth = host.switchToWs().getClient();

    //If error exception will HTTP-style convert it into WS tyle exception and emit to client
    if (exception instanceof BadRequestException) {
      const exceptionData = exception.getResponse();
      const exceptionMessage =
        exceptionData['message'] ?? exceptionData ?? exception.name;

      const wsException = new WsBadRequestException(exceptionMessage);
      socket.emit('exception', wsException.getError());
      return;
    }
    // If Error will be in WSException type then emit to client
    if (exception instanceof WsTypeException) {
      socket.emit('exception', exception.getError());
      return;
    }
    //If exception is not matches to abaove cases thorw Unknown error msg
    const wsException = new WsUnknownException(exception.message);
    socket.emit('exception', wsException.getError());
  }
}
