import { redirect } from "react-router-dom";

export function getTokenDuration() {
  const expiration = localStorage.getItem("expiration");
  const date = new Date(expiration);
  const now = new Date();
  const duration = date.getTime() - now.getTime();

  return duration;
}

export function tokenLoader() {
  const token = localStorage.getItem("token");

  if (!token) {
    return null;
  }

  const tokenDuration = getTokenDuration();

  if (tokenDuration < 0) {
    return "EXPIRED";
  }

  return token;
}

export function checkAuthToken() {
  const token = localStorage.getItem("token");

  if (!token) {
    return redirect("/auth");
  }

  return null;
}

export function saveToken(token) {
  localStorage.setItem("token", token);
  const expiration = new Date();
  expiration.setHours(expiration.getHours() + 1);
  localStorage.setItem("expiration", expiration.toISOString());
}

export function deleteToken() {
  localStorage.removeItem("token");
  localStorage.removeItem("expiration");
}
