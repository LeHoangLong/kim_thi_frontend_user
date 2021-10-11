import Symbols from './config/Symbols';
import { MockProductRepositories } from './repositories/MockProductRepositories';
import { LocalCartRepository } from './repositories/LocalCartRepository'
import { Container } from 'inversify'
import { IProductRepositories } from './repositories/IProductRepositories'
import { ICartRepository } from './repositories/ICartRepository'
import { CartController } from './controllers/CartController'
import { useAppDispatch } from './hooks/Hooks' 

const myContainer = new Container()

myContainer.bind<IProductRepositories>(Symbols.PRODUCT_REPOSITORY).to(MockProductRepositories)
myContainer.bind<ICartRepository>(Symbols.CART_REPOSITORY).to(LocalCartRepository)
myContainer.bind<CartController>(Symbols.CART_CONTROLLER).to(CartController)

export default myContainer
