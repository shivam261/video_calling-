import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from "next/link"
import { Plus } from "lucide-react";
export function HomeCard(props) {
  return (
<Link href={props.link?props.link:"/"}>

    <Card className=" bg-red-400 " style={{ width: "100%"  }}>
      <CardHeader>
        <CardTitle className=""><props.icon size={50} color={"white"}/></CardTitle>

      </CardHeader>
      <CardContent>

          <div className="grid w-full items-center gap-4">
            
            <div className="flex flex-col space-y-1.5 ">
            <CardDescription style={{ color: "rgb(255, 255, 255)" }}>
               
                {props.description}

            </CardDescription>
              
            </div>
          </div>

      </CardContent>
      <CardFooter className="flex justify-between">
       <div className="text-sm">
        {props.topic}
       </div>
      </CardFooter>
    </Card>
    </Link>
  )
}
