import { injectable } from 'inversify'
import { IPriceRequestRepository } from './IPriceRequestRepository'

@injectable()
export class MockPriceRequestRepository implements IPriceRequestRepository {
    async createPriceRequest(): Promise<boolean> {
        return true
    }
}