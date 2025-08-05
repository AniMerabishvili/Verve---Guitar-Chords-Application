export interface Users {
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    password: string;
    role: UserType;
}

export enum UserType {
  Admin = "admin",
  Customer = "customer"
}