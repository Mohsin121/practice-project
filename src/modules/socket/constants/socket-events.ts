export const SOCKET_EVENTS = {
  // Client -> Server
  PING: 'ping',
  JOIN_ROOM: 'joinRoom',
  LEAVE_ROOM: 'leaveRoom',
  SEND_MESSAGE: 'sendMessage',
  
  // Server -> Client
  PONG: 'pong',
  NEW_MESSAGE: 'newMessage',
  USER_JOINED: 'userJoined',
  USER_LEFT: 'userLeft',
  ERROR: 'error',
} as const;

