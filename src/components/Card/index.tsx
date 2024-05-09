import { ShoppingCart } from '@phosphor-icons/react'
import {
  CoffeeImg,
  Container,
  Control,
  Description,
  Order,
  Price,
  Tags,
  Title,
} from './styles'
import { useTheme } from 'styled-components'
import { QuantityInput } from '../../components/form/QuantityInput'
import { useState } from 'react'
import { useCart } from '../../hook/useCart'

interface CardProps {
  coffee: {
    id: string
    title: string
    description: string
    tags: string[]
    price: number
    image: string
  }
}

export function Card({ coffee }: CardProps) {
  const [quantity, setQuantity] = useState(1)

  const theme = useTheme()
  const { addItem } = useCart()

  const { id, title, description, tags, price, image } = coffee

  function handleAddCoffee() {
    addItem({ id, quantity })
  }

  function incrementQuantity() {
    setQuantity((prev) => prev + 1)
  }

  function decrementQuantity() {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  return (
    <Container>
      <CoffeeImg src={image} alt={title} />

      <Tags>
        {tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </Tags>

      <Title>{title}</Title>

      <Description>{description}</Description>

      <Control>
        <Price>
          <span>R$</span>
          <span>{price.toFixed(2)}</span>
        </Price>

        <Order>
          <QuantityInput
            quantity={quantity}
            incrementQuantity={incrementQuantity}
            decrementQuantity={decrementQuantity}
          />

          <button onClick={handleAddCoffee}>
            <ShoppingCart size={22} color={theme.colors['base-card']} />
          </button>
        </Order>
      </Control>
    </Container>
  )
}
