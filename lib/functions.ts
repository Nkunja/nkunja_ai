'use server';

import Chat from "./models/chatModel";


export async function SaveChat(title: string){
    try {
        const chat = new Chat({
            title: title,
          })
      
          await chat.Save();
          console.log('chat saved', chat);
          return {
            id: chat._id,
            title: chat.title,
          }
    }catch(e: any){
        console.error('Error creating chat:', e);
        throw new Error('Failed to create chat'); 
    }
}