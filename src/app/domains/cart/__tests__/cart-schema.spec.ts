import { TestBed } from "@angular/core/testing"
import { Observable } from "rxjs"
import { beforeEach, describe, it, vi } from "vitest"
import {
  ErrorSchemaBaseFactory,
  ErrorService,
  TOKEN_ERROR_SERVICE,
} from "../../../core/error"
import { CartSchema } from "../internal/cart.schema"

describe("CartSchema", () => {
  let schema: CartSchema
  let spyErrorService: ErrorService
  let spyErrorFactory: ErrorSchemaBaseFactory

  beforeEach(() => {
    spyErrorService = {
      error$: new Observable(),
      handle: vi.fn().mockImplementation((arg) => arg),
    }

    spyErrorFactory = {
      create: vi.fn().mockImplementation((arg) => arg),
    }

    TestBed.configureTestingModule({
      providers: [
        CartSchema,
        {
          provide: TOKEN_ERROR_SERVICE,
          useValue: spyErrorService,
        },
        {
          provide: ErrorSchemaBaseFactory,
          useValue: spyErrorFactory,
        },
      ],
    })

    schema = TestBed.inject(CartSchema)
    spyErrorService = TestBed.inject(TOKEN_ERROR_SERVICE)
    spyErrorFactory = TestBed.inject(ErrorSchemaBaseFactory)
  })

  it("cart should be return mapped output", () => {
    // Arrange
    const mockResponse = {
      data: {
        id: "1",
        list: [
          {
            product: {
              id: "1",
              image: "image",
              price: "price",
              name: "name",
              description: "description",
            },
            quantity: 1,
          },
        ],
      },
    } as any

    // const mockReturn = {
    //   id: "1",
    //   list: OrderedMap({
    //     "1": {
    //       productId: "1",
    //       quantity: 1,
    //       product: {
    //         image: "image",
    //         price: "price",
    //         name: "name",
    //         description: "description",
    //       },
    //     },
    //   }),
    // } as CartNormalized

    // Act
    const responseMapped = schema.cart(mockResponse)

    // Assert
    expect(responseMapped.list?.get("1")?.productId).toEqual("1")
  })

  it("cart should be throw error", () => {
    const mockResponse = {
      data: {
        id: "1",
        data: [
          {
            product: {
              id: "1",
              image: "image",
              price: "price",
              name: "name",
              description: "description",
            },
            quantity: 1,
          },
        ],
      },
    } as any

    // Act
    const action = () => schema.cart(mockResponse)

    // Assert
    expect(action).toThrowError()
  })
})
