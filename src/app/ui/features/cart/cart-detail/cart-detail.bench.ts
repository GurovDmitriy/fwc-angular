import { bench } from "vitest"

function generateOrderedMap(size: number): [
  string,
  {
    quantity: number
    product: { id: string; name: string; price: string }
  },
][] {
  const entries: [
    string,
    { quantity: number; product: { id: string; name: string; price: string } },
  ][] = []

  for (let i = 1; i <= size; i++) {
    entries.push([
      i.toString(),
      {
        quantity: Math.floor(Math.random() * 10) + 1,
        product: {
          id: i.toString(),
          name: `name${i}`,
          price: (Math.random() * 100).toFixed(2),
        },
      },
    ])
  }

  return entries
}

const itemsA = generateOrderedMap(200)
const itemsB = generateOrderedMap(200)

describe("CartDetail: cart total calculate", () => {
  bench("reduce", () => {
    const list = itemsA

    list.reduce(
      (acc, [, value]) => {
        const sum = parseInt(value.product.price) * value.quantity
        return {
          list: [...acc.list, { ...value, sum }],
          total: acc.total + sum,
        } as any
      },
      {
        list: [],
        total: 0,
      },
    )
  })

  bench("simple", () => {
    const list = itemsB

    const total = {
      list: [] as any,
      total: 0,
    }

    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < list.length; i++) {
      const sum = parseInt(list[i][1].product.price) * list[i][1].quantity

      total.list.push({ ...list[i][1], sum })
      total.total += sum
    }
  })
})
