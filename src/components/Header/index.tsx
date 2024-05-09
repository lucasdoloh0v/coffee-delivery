import { Link } from 'react-router-dom'
import { Aside, Container } from './styles'
import { MapPin, ShoppingCart } from '@phosphor-icons/react'
import { useCart } from '../../hook/useCart'

export function Header() {
  const { cart } = useCart()

  return (
    <Container>
      <Link to="/">
        <img id="logo" src="/logo.svg" alt="Coffee Delivery" />
        <img id="mobile-logo" src="short-logo.svg" alt="Coffee Delivery" />
      </Link>

      <Aside>
        <div>
          <MapPin size={32} weight="fill" />
          <span>Arcoverde, PE</span>
        </div>

        <Link to={`cart`}>
          <ShoppingCart size={32} weight="fill" />
          {cart.length > 0 && <span>{cart.length}</span>}
        </Link>
      </Aside>
    </Container>
  )
}
