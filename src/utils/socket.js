import { io } from "socket.io-client";
import getEnv from "../configs/config";

const SOCKET = io(getEnv("SERVER_URL"), {
  autoConnect: false,
});

export { SOCKET };
