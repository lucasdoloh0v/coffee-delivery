import {
  Bank,
  CreditCard,
  CurrencyDollar,
  MapPin,
  Money,
  Trash,
} from '@phosphor-icons/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Fragment } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  AddressContainer,
  AddressForm,
  AddressHeading,
  CartTotal,
  CartTotalInfo,
  CheckoutButton,
  Coffee,
  CoffeeInfo,
  Container,
  InfoContainer,
  PaymentContainer,
  PaymentErrorMessage,
  PaymentHeading,
  PaymentOptions,
} from './styles'
import { TextInput } from '../../components/form/TextInput'
import { Radio } from '../../components/form/Radio'
import { useCart } from '../../hook/useCart'
import { coffees } from '../../../data.json'
import { QuantityInput } from '../../components/form/QuantityInput'
import { Item } from '../../contexts/CartContext'
import { useNavigate } from 'react-router-dom'

type FormInputs = {
  cep: number
  street: string
  number: string
  fullAddress: string
  neighborhood: string
  city: string
  state: string
  paymentMethod: 'credit' | 'debit' | 'cash'
}

const newOrder = z.object({
  cep: z.number({ invalid_type_error: 'Informe o CEP' }),
  street: z.string().min(1, 'Informe a rua'),
  number: z.string().min(1, 'Informe o número'),
  fullAddress: z.string(),
  neighborhood: z.string().min(1, 'Informe o bairro'),
  city: z.string().min(1, 'Informe a cidade'),
  state: z.string().min(1, 'Informe a UF'),
  paymentMethod: z.enum(['credit', 'debit', 'cash'], {
    invalid_type_error: 'Informe um método de pagamento',
  }),
})

export type OrderInfo = z.infer<typeof newOrder>

const shippingPrice = 3.5

export function Cart() {
  const { cart, itemIncrement, itemDecrement, removeItem, checkoutCart } =
    useCart()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: zodResolver(newOrder),
  })
  const navigate = useNavigate()

  const selectedPaymentMethod = watch('paymentMethod')

  const coffeesInCart = cart.map((item) => {
    const coffeeInfo = coffees.find((coffee) => coffee.id === item.id)

    if (!coffeeInfo) {
      throw new Error('Invalid coffee.')
    }

    return {
      ...coffeeInfo,
      quantity: item.quantity,
    }
  })

  const totalItemsPrice = coffeesInCart.reduce((previousValue, currentItem) => {
    return (previousValue += currentItem.price * currentItem.quantity)
  }, 0)

  const handleItemIncrement = (id: Item['id']) => {
    itemIncrement(id)
  }

  const handleItemDecrement = (id: Item['id']) => {
    itemDecrement(id)
  }

  const handleRemoveItem = (id: Item['id']) => {
    removeItem(id)
  }

  const handleOrderCheckout: SubmitHandler<FormInputs> = (data) => {
    if (cart.length === 0) {
      return alert('É preciso ter pelo menos um item no carrinho')
    }
    checkoutCart(data, navigate)
  }

  return (
    <Container>
      <InfoContainer>
        <h2>Complete seu pedido</h2>

        <form id="order" onSubmit={handleSubmit(handleOrderCheckout)}>
          <AddressContainer>
            <AddressHeading>
              <MapPin size={22} />

              <div>
                <span>Endereço de Entrega</span>

                <p>Informe o endereço onde deseja receber o seu pedido</p>
              </div>
            </AddressHeading>

            <AddressForm>
              <TextInput
                placeholder="CEP"
                type="number"
                containerProps={{ style: { gridArea: 'cep' } }}
                error={errors.cep}
                {...register('cep', { valueAsNumber: true })}
              />

              <TextInput
                placeholder="Rua"
                containerProps={{ style: { gridArea: 'street' } }}
                error={errors.street}
                {...register('street')}
              />

              <TextInput
                placeholder="Número"
                containerProps={{ style: { gridArea: 'number' } }}
                error={errors.number}
                {...register('number')}
              />

              <TextInput
                placeholder="Complemento"
                optional
                containerProps={{ style: { gridArea: 'fullAddress' } }}
                error={errors.fullAddress}
                {...register('fullAddress')}
              />

              <TextInput
                placeholder="Bairro"
                containerProps={{ style: { gridArea: 'neighborhood' } }}
                error={errors.neighborhood}
                {...register('neighborhood')}
              />

              <TextInput
                placeholder="Cidade"
                containerProps={{ style: { gridArea: 'city' } }}
                error={errors.city}
                {...register('city')}
              />

              <TextInput
                placeholder="UF"
                maxLength={2}
                containerProps={{ style: { gridArea: 'state' } }}
                error={errors.state}
                {...register('state')}
              />
            </AddressForm>
          </AddressContainer>

          <PaymentContainer>
            <PaymentHeading>
              <CurrencyDollar size={22} />

              <div>
                <span>Pagamento</span>

                <p>
                  O pagamento é feito na entrega. Escolha a forma que deseja
                  pagar
                </p>
              </div>
            </PaymentHeading>

            <PaymentOptions>
              <div>
                <Radio
                  isSelected={selectedPaymentMethod === 'credit'}
                  value="credit"
                  {...register('paymentMethod')}
                >
                  <CreditCard size={16} />
                  <span>Cartão de crédito</span>
                </Radio>

                <Radio
                  isSelected={selectedPaymentMethod === 'debit'}
                  value="debit"
                  {...register('paymentMethod')}
                >
                  <Bank size={16} />
                  <span>Cartão de débito</span>
                </Radio>

                <Radio
                  isSelected={selectedPaymentMethod === 'cash'}
                  value="cash"
                  {...register('paymentMethod')}
                >
                  <Money size={16} />
                  <span>Dinheiro</span>
                </Radio>
              </div>

              {errors.paymentMethod && (
                <PaymentErrorMessage role="alert">
                  {errors.paymentMethod.message}
                </PaymentErrorMessage>
              )}
            </PaymentOptions>
          </PaymentContainer>
        </form>
      </InfoContainer>

      <InfoContainer>
        <h2>Cafés selecionados</h2>

        <CartTotal>
          {coffeesInCart.map((coffee) => (
            <Fragment key={coffee.id}>
              <Coffee>
                <div>
                  <img src={coffee.image} alt={coffee.title} />

                  <div>
                    <span>{coffee.title}</span>

                    <CoffeeInfo>
                      <QuantityInput
                        quantity={coffee.quantity}
                        incrementQuantity={() => handleItemIncrement(coffee.id)}
                        decrementQuantity={() => handleItemDecrement(coffee.id)}
                      />

                      <button onClick={() => handleRemoveItem(coffee.id)}>
                        <Trash />
                        <span>Remover</span>
                      </button>
                    </CoffeeInfo>
                  </div>
                </div>

                <aside>R$ {coffee.price?.toFixed(2)}</aside>
              </Coffee>

              <span />
            </Fragment>
          ))}

          <CartTotalInfo>
            <div>
              <span>Total de itens</span>
              <span>
                {new Intl.NumberFormat('pt-br', {
                  currency: 'BRL',
                  style: 'currency',
                }).format(totalItemsPrice)}
              </span>
            </div>

            <div>
              <span>Entrega</span>
              <span>
                {new Intl.NumberFormat('pt-br', {
                  currency: 'BRL',
                  style: 'currency',
                }).format(shippingPrice)}
              </span>
            </div>

            <div>
              <span>Total</span>
              <span>
                {new Intl.NumberFormat('pt-br', {
                  currency: 'BRL',
                  style: 'currency',
                }).format(totalItemsPrice + shippingPrice)}
              </span>
            </div>
          </CartTotalInfo>

          <CheckoutButton type="submit" form="order">
            Confirmar pedido
          </CheckoutButton>
        </CartTotal>
      </InfoContainer>
    </Container>
  )
}
