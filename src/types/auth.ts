export enum AuthCard {
  SIGNIN = "signin",
  SIGNUP = "signup",
}

export type AuthCardType = keyof typeof AuthCard;
