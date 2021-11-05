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

const myContainer = new Container()

myContainer.bind<IProductRepositories>(Symbols.PRODUCT_REPOSITORY).to(RemoteProductRepository)
myContainer.bind<ICartRepository>(Symbols.CART_REPOSITORY).to(LocalCartRepository)
myContainer.bind<CartController>(Symbols.CART_CONTROLLER).to(CartController)
myContainer.bind<IAddressRepository>(Symbols.ADDRESS_REPOSITORY).to(LocalAddressRepository)
myContainer.bind<IGeocodingService>(Symbols.GEOCODING_SERVICE).to(RemoteGeocodingSerivce)
myContainer.bind<IShippingFeeRepository>(Symbols.SHIPPING_FEE_REPOSITORY).to(MockShippingFeeRepository)
myContainer.bind<IOrderRepository>(Symbols.ORDER_REPOSITORY).to(MockOrderRepository)

export default myContainer
