import { it } from "vitest";
import { Brand } from "../helpers/Brand";

type Valid<T> = Brand<T, "Valid">;

interface PasswordValues {
  password: string;
  confirmPassword: string;
}

// Info: Instead of returning values.password and casting it's type to a branded password type, we can create a function that returns a boolean based on a password check, by typing the return value to a type predicate indicating the correct return type, if the function returns true, then typescript would know the type is valid.
const isValidPassword = (values: PasswordValues): values is Valid<PasswordValues> => {
  if (values.password !== values.confirmPassword) {
    return false;
  }
  return true;
};

const createUserOnApi = (values: Valid<PasswordValues>) => {
  // Imagine this function creates the user on the API
};

it("Should fail if you do not validate the values before calling createUserOnApi", () => {
  const onSubmitHandler = (values: PasswordValues) => {
    // @ts-expect-error
    createUserOnApi(values);
  };
});

it("Should succeed if you DO validate the values before calling createUserOnApi", () => {
  const onSubmitHandler = (values: PasswordValues) => {
    if (isValidPassword(values)) {
      createUserOnApi(values);
    }
  };
});
