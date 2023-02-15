import { SetMetadata } from '@nestjs/common';

export const MESSAGE_KEY = 'RESPONSE_MESSAGE';

export const Message = (message: string) => SetMetadata(MESSAGE_KEY, message);
