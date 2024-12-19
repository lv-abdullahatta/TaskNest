import { account } from "./appwrite";
import { ID } from "appwrite";

export const login = async (email: string, password: string) => {
  return await account.createSession(email, password);
};

export const register = async (email: string, password: string, name: string) => {
  return await account.create(ID.unique(), email, password, name);
};

export const logout = async () => {
  return await account.deleteSession("current");
};

export const getCurrentUser = async () => {
  try {
    return await account.get();
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

export const sendVerificationEmail = async () => {
  return await account.createVerification("http://localhost:3000/verify-email");
};

export const confirmVerification = async (userId: string, secret: string) => {
  return await account.updateVerification(userId, secret);
};

export const sendPhoneVerification = async () => {
  return await account.createPhoneVerification();
};

export const confirmPhoneVerification = async (userId: string, secret: string) => {
  return await account.updatePhoneVerification(userId, secret);
};
