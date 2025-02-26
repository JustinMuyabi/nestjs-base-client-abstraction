import { Test } from '@nestjs/testing';
import { ClientProxy } from '@nestjs/microservices';
import { of, throwError } from 'rxjs';
import { BaseClientAbstract} from "../src";

class TestClient extends BaseClientAbstract {
    constructor(client: ClientProxy) {
        super(client);
    }

    public async testFetch<T>(payload: T) {
        return this.fetchData('test.event', payload, 'Timeout', 'Error');
    }
}

describe('BaseClientAbstract', () => {
    let client: TestClient;
    let clientProxy: ClientProxy;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                {
                    provide: ClientProxy,
                    useValue: {
                        send: jest.fn(),
                    },
                },
            ],
        }).compile();

        clientProxy = module.get<ClientProxy>(ClientProxy);
        client = new TestClient(clientProxy);
    });

    it('should successfully fetch data', async () => {
        const mockData = { test: 'data' };
        jest.spyOn(clientProxy, 'send').mockReturnValue(of(mockData));

        const result = await client.testFetch({ id: 1 });
        expect(result).toEqual(mockData);
    });
});