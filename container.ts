import Symbols from './config/Symbols';
import { MockProductRepositories } from './repositories/MockProductRepositories';
import { LocalCartRepository } from './repositories/LocalCartRepository'
import { Container } from 'inversify'
import { IProductRepositories } from './repositories/IProductRepositories'
import { ICartRepository } from './repositories/ICartRepository'
import { CartController } from './controllers/CartController'
import { IAddressRepository } from './repositories/IAddressRepository';
import { LocalAddressRepository } from './repositories/LocalAddressRepository';
import { IGeocodingService } from './services/IGeocodingService';
import { MockGeocodingService } from './services/MockGeocodingService';
import { IShippingFeeRepository } from './repositories/IShippingFeeRepository';
import { MockShippingFeeRepository } from './repositories/MockShippingFeeRepository';
import { IOrderRepository } from './repositories/IOrderRepository';
import { MockOrderRepository } from './repositories/MockOrderRepository';
import { RemoteProductRepository } from './repositories/RemoteProductRepository';
import { RemoteGeocodingSerivce } from './services/RemoteGeocodingService';
import { RemoteShippingFeeRepository } from './repositories/RemoteShippingFeeRepository';
import { RemoteOrderRepository } from './repositories/RemoteOrderRepository';
import { IPriceRequestRepository } from './repositories/IPriceRequestRepository';
import { MockPriceRequestRepository } from './repositories/MockPriceRequestRepository';
import { RemotePriceRequestRepository } from './repositories/RemotePriceRequestRepository';

const myContainer = new Container()

myContainer.bind<IProductRepositories>(Symbols.PRODUCT_REPOSITORY).to(RemoteProductRepository).inSingletonScope()
myContainer.bind<ICartRepository>(Symbols.CART_REPOSITORY).to(LocalCartRepository).inSingletonScope()
myContainer.bind<CartController>(Symbols.CART_CONTROLLER).to(CartController).inSingletonScope()
myContainer.bind<IAddressRepository>(Symbols.ADDRESS_REPOSITORY).to(LocalAddressRepository).inSingletonScope()
myContainer.bind<IGeocodingService>(Symbols.GEOCODING_SERVICE).to(RemoteGeocodingSerivce).inSingletonScope()
myContainer.bind<IShippingFeeRepository>(Symbols.SHIPPING_FEE_REPOSITORY).to(RemoteShippingFeeRepository).inSingletonScope()
myContainer.bind<IOrderRepository>(Symbols.ORDER_REPOSITORY).to(RemoteOrderRepository).inSingletonScope()
myContainer.bind<IPriceRequestRepository>(Symbols.PRICE_REQUEST_REPOSITORY).to(RemotePriceRequestRepository).inSingletonScope()

// myContainer.bind<IPriceRequestRepository>(Symbols.PRICE_REQUEST_REPOSITORY).to(MockPriceRequestRepository)
// let mockProductRepositories = new MockProductRepositories()
// myContainer.rebind<IProductRepositories>(Symbols.PRODUCT_REPOSITORY).toConstantValue(mockProductRepositories)

export default myContainer
