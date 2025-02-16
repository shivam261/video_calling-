import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { HomeCard } from "@/customComponets/Homecards";
import { Plus,Folder , FileText } from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
export default function Home() {

  return (
   <div className="flex flex-col bg-amber-50 h-[90%] w-full m-10 gap-y-2">
  
    <div className="basis-full bg-red-200 h-[20]"> </div>
    <div className="basis-full flex flex-row gap-4 bg-amber-100 place-content-center p-8">
      <div className="flex flex-col basis-1/4">
        <div className="bg-orange-400 rounded-2xl hover:bg-orange-500">
          <HomeCard icon={Plus} topic={"New Meeting"} description={"Start New Meeting"} link="/"/> 
        </div>
      </div>
      <div className="flex flex-col basis-1/4">
        <div className="bg-blue-500 rounded-2xl hover:bg-blue-600 ">
          <HomeCard icon={Folder} topic={"Schedule Meeting"} description={"Plan Meeting"} link="/"/> 
        </div>
      </div>
      <div className="flex flex-col basis-1/4">
        <div className="bg-purple-500 rounded-2xl hover:bg-purple-600 basis-1/4 ">
          <HomeCard icon={FileText} topic={" View Records"} description={"Past Meetings"} link="/"/> 
        </div>
      </div>
      <div className="flex flex-col basis-1/4">
        <div className="bg-yellow-400 rounded-2xl hover:bg-yellow-500 basis-1/4 ">
          <HomeCard icon={FileText} topic={"Join"} description={"join Meetings"} link="/"/> 
        </div>
      </div>
    </div>

   
   </div>
     
  );
}
