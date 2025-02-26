# NestJS Microservice Client

A base client abstraction for NestJS microservices with built-in retry and timeout handling.

## Installation

```bash
npm install nestjs-microservice-client
```

## Usage

```typescript
import { BaseClientAbstract } from 'nestjs-microservice-client';
import { Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class UserServiceClient extends BaseClientAbstract {
  constructor(
    @Inject('USER_SERVICE') client: ClientProxy
  ) {
    super(client, {
      timeout: 10000,      // Optional: override default timeout
      retryAttempts: 10    // Optional: override default retry attempts
    });
  }

  async getUser(id: number) {
    return this.fetchData(
      'user.get',
      { id },
      'User service timeout',
      'User service error'
    );
  }
}
```

## Features

- Configurable timeout and retry attempts
- Error handling with appropriate exceptions
- Built on top of RxJS
- TypeScript support
- NestJS integration

## License

MIT