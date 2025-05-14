"use client"
import { createContext, useContext, useState, useRef, ReactNode } from "react";
type TranscriptionContextType = {
  startTranscription: () => void;
  stopTranscription: () => void;
  status: string;
  transcripts: string[];
  partial: string;
};
const TranscriptionContext = createContext<TranscriptionContextType | undefined>(undefined);
export const TranscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [status, setStatus] = useState("Press Start");
  const [transcripts, setTranscripts] = useState<string[]>([]);
  const [partial, setPartial] = useState("");
  const voskPcRef = useRef<RTCPeerConnection | null>(null);
  const voskDcRef = useRef<RTCDataChannel | null>(null);

  const startTranscription = async () => {
    setStatus("Connecting to Vosk...");
    const pc = new RTCPeerConnection();
    voskPcRef.current = pc;

    const dc = pc.createDataChannel("result");
    voskDcRef.current = dc;

    dc.onmessage = (e) => {
      setStatus("Listening...");
      try {
        const data = JSON.parse(e.data);
        if (data.text) {
          setTranscripts(prev => [...prev, data.text]);
          setPartial("");
        } else if (data.partial) {
          setPartial(data.partial);
        }
      } catch (err) {
        console.error("Vosk JSON error", err);
      }
    };

    const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    audioStream.getTracks().forEach(track => pc.addTrack(track, audioStream));

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    await new Promise((resolve) => {
      if (pc.iceGatheringState === "complete") return resolve(null);
      pc.onicegatheringstatechange = () => {
        if (pc.iceGatheringState === "complete") resolve(null);
      };
    });

    const response = await fetch(`http://${process.env.NEXT_PUBLIC_BASE_URL}:2700/offer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pc.localDescription),
    });

    const answer = await response.json();
    await pc.setRemoteDescription(answer);
  };

  const stopTranscription = () => {
    voskDcRef.current?.close();
    voskPcRef.current?.getSenders().forEach(sender => sender.track?.stop());
    voskPcRef.current?.close();
    voskDcRef.current = null;
    voskPcRef.current = null;
    setStatus("Press Start");
  };

  return (
    <TranscriptionContext.Provider
      value={{ startTranscription, stopTranscription, status, transcripts, partial }}
    >
      {children}
    </TranscriptionContext.Provider>
  );
};

export const useTranscription = () => {
  const context = useContext(TranscriptionContext);
  if (!context) throw new Error("useTranscription must be used within TranscriptionProvider");
  return context;
};