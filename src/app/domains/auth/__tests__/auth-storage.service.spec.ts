import { TestBed } from "@angular/core/testing"
import { firstValueFrom } from "rxjs"
import { beforeEach, describe, test, vi } from "vitest"
import { AuthStorageService } from "../internal"

describe("TokenInterceptor", () => {
  let service: AuthStorageService

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthStorageService],
    })

    service = TestBed.inject(AuthStorageService)

    service["storage"] = {
      getItem: vi.fn().mockImplementation((arg) => Promise.resolve(arg)),
      setItem: vi.fn().mockImplementation(() => Promise.resolve()),
      removeItem: vi.fn().mockImplementation(() => Promise.resolve()),
    } as unknown as (typeof service)["storage"]
  })

  test("getItem return value", async () => {
    // Arrange
    const spy = vi.spyOn(service, "getItem")
    const req = service.getItem("key")

    // Act
    const res = await firstValueFrom(req)

    // Assert
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith("key")
    expect(res).toEqual("key")
  })

  test("setItem return value", async () => {
    // Arrange
    const spy = vi.spyOn(service, "setItem")
    const req = service.setItem("key", "value")

    // Act
    const res = await firstValueFrom(req)

    // Assert
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith("key", "value")
    expect(res).toBeFalsy()
  })

  test("removeItem return value", async () => {
    // Arrange
    const spy = vi.spyOn(service, "removeItem")
    const req = service.removeItem("key")

    // Act
    const res = await firstValueFrom(req)

    // Assert
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith("key")
    expect(res).toBeFalsy()
  })
})
