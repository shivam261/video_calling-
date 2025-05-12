"use client";
import React, { useEffect, useState, useContext, createContext, useCallback } from "react";
interface PeerContextType {
  peer: RTCPeerConnection | null;
  createOffer: () => Promise<RTCSessionDescriptionInit | undefined>;
  createAnswer: (offer: RTCSessionDescriptionInit) => Promise<RTCSessionDescriptionInit | undefined>;
  setRemoteAnswer: (ans: RTCSessionDescriptionInit) => Promise<void>;
  sendStream: (stream: MediaStream) => Promise<void>;
  remoteStream: MediaStream | null;
}
interface PeerProviderProps {
  children: React.ReactNode;
}
const PeerContext = createContext<PeerContextType | null>(null);

export const usePeer = (): PeerContextType => {
  const peer = useContext(PeerContext);
  if (!peer) {
    throw new Error("usePeer must be used within a PeerProvider");
  }
  return peer;
};


export const PeerProvider = ({ children }: PeerProviderProps) => {
  const [peer, setPeer] = useState<RTCPeerConnection | null>(null);
const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const newPeer = new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478"
            ]
          }
        ]
      });
      setPeer(newPeer);
    }
  }, []);
  const handleTrackEvent=useCallback((ev:RTCTrackEvent)=>{
    const streams=ev.streams;
    setRemoteStream(streams[0]);
  },[])
 
useEffect(() => {
    peer?.addEventListener('track',
      handleTrackEvent);
    return () => {  
      peer?.removeEventListener('track', handleTrackEvent);
    }
},[peer]);


  const createOffer = async () => {
    if (!peer) return;
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    return offer;
  };

  const createAnswer = async (offer: RTCSessionDescriptionInit) => {
  if (!peer) return;

  console.log("Before setRemoteDescription, state:", peer.signalingState);

  if (peer.signalingState !== "have-remote-offer") {
    try {
      await peer.setRemoteDescription(offer);
    } catch (err) {
      console.error("Failed to set remote description:", err);
      return;
    }
  }

  console.log("After setRemoteDescription, state:", peer.signalingState);

  const answer = await peer.createAnswer();

  try {
    await peer.setLocalDescription(answer);
    console.log("Local description set:", answer);
  } catch (err) {
    console.error("Failed to set local description:", err);
    return;
  }

  return answer;
};

const sendStream=async(stream:MediaStream)=>{
    const tracks=stream.getTracks();
    for (const track of tracks) {
        peer?.addTrack(track,stream);
    }   
};
  const setRemoteAnswer = async (ans: RTCSessionDescriptionInit) => {
    if (!peer) return;
    await peer.setRemoteDescription(ans);
  };

  return (
    <PeerContext.Provider value={{ peer, createOffer, createAnswer, setRemoteAnswer ,sendStream,remoteStream}}>
      {children}
    </PeerContext.Provider>
  );
};
