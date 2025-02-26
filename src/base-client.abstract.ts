import {ClientProxy} from "@nestjs/microservices";
import {firstValueFrom, retry, timeout, TimeoutError} from "rxjs";
import {InternalServerErrorException, RequestTimeoutException} from "@nestjs/common";
import {ClientOptions} from "./interfaces/client-options.interface";

export abstract class BaseClient {
    private readonly DEFAULT_TIMEOUT: number = 10000;
    private readonly DEFAULT_RETRY_ATTEMPTS: number = 10;

    protected constructor(
        protected readonly client: ClientProxy,
        protected readonly options?: ClientOptions
    ) {}

    protected async fetchData<TResponse, TRequest>(
        event: string,
        payload: TRequest,
        timeoutMessage: string,
        generalMessage: string,
    ): Promise<TResponse> {
        try {
            return await firstValueFrom(
                this.client
                    .send(event, payload)
                    .pipe(
                        timeout(this.options?.timeout ?? this.DEFAULT_TIMEOUT),
                        retry(this.options?.retryAttempts ?? this.DEFAULT_RETRY_ATTEMPTS)
                    ),
            );
        } catch (error) {
            if (error instanceof TimeoutError) {
                throw new RequestTimeoutException(timeoutMessage);
            }
            throw new InternalServerErrorException(generalMessage);
        }
    }

}