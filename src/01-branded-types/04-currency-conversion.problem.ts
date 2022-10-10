import { describe, it } from "vitest";
import { Brand } from "../helpers/Brand";

type ValidUser = Brand<User, "UserCanConvert">;
type ValidAmount = Brand<number, "ConvertedAmount">;
interface User {
  id: string;
  name: string;
  maxConversionAmount: number;
}

// Mocks a function that uses an API to convert
// One currency to another
const getConversionRateFromApi = async (amount: number, from: string, to: string) => {
  return Promise.resolve(amount * 0.82) as Promise<ValidAmount>;
};

// Mocks a function which actually performs the conversion
const performConversion = async (user: ValidUser, to: string, amount: ValidAmount) => {};

const ensureUserCanConvert = (user: User, amount: ValidAmount): ValidUser => {
  if (user.maxConversionAmount < amount) {
    throw new Error("User cannot convert currency");
  }

  return user as ValidUser;
};

describe("Possible implementations", () => {
  it("Should error if you do not authorize the user first", () => {
    const handleConversionRequest = async (
      user: User,
      from: string,
      to: string,
      amount: number
    ) => {
      const convertedAmount = await getConversionRateFromApi(amount, from, to);
      // @ts-expect-error
      await performConversion(user, to, convertedAmount);
    };
  });

  it("Should error if you do not convert the amount first", () => {
    const handleConversionRequest = async (
      user: User,
      from: string,
      to: string,
      amount: number
    ) => {
      // @ts-expect-error
      const authorizedUser = ensureUserCanConvert(user, amount);

      // @ts-expect-error
      await performConversion(authorizedUser, to, amount);
    };
  });

  it("Should pass type checking if you authorize the user AND convert the amount", () => {
    const handleConversionRequest = async (
      user: User,
      from: string,
      to: string,
      amount: number
    ) => {
      const convertedAmount = await getConversionRateFromApi(amount, from, to);
      const authorizedUser = ensureUserCanConvert(user, convertedAmount);

      await performConversion(authorizedUser, to, convertedAmount);
    };
  });
});
