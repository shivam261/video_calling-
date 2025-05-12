"use client"

import React, {useMemo} from "react";
import {io} from "socket.io-client";
import { Socket } from "socket.io-client";
const SocketContext=React.createContext<Socket | null>(null);

export const useSocket=()=>{
    const socket=React.useContext(SocketContext);
    if(!socket){
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return socket;
}
export const SocketProvider=({children}:{children:React.ReactNode})=>{
   const socket= useMemo(()=>{

        return io(`http://192.168.202.32:8001`);

   },[])
    return(
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
};
