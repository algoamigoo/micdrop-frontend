// src/api/client.ts
import axios from "axios";

// In a real app, this would be an environment variable
const MOCK_USER_ID = "alice"; // Change this to "bob" to test voting as another user

export const api = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  headers: {
    "Content-Type": "application/json",
    "X-User-ID": MOCK_USER_ID,
  },
});