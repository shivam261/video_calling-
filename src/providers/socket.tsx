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
        // get domain name 
        //const domainName = window.location.hostname;
        // get domain name from window object
        const domainName = window.location.hostname;
        // if domain name is localhost, use localhost

        return io(`http://${process.env.NEXT_PUBLIC_BASE_URL}:8001`);

   },[])
    return(
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
};
