export interface Message {
    _id: string;
    message: string;
    isUser: boolean;
    createdAt: string;
  }
  
  export interface Chat {
    _id: string;
    title: string;
    userId: string;
    createdAt: string;
    messages?: Message[]; // Keep it optional here
  }
  
  export interface NewMessageData {
    message: string;
    isUser: boolean;
  }