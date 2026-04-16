import { io } from "socket.io-client";
import getEnv from "../configs/config";

const SOCKET = io(getEnv("SERVER_URL"), {
  autoConnect: false,
  withCredentials: true,
  transports: ["websocket", "polling"],
  reconnection: true,
});

export { SOCKET };
