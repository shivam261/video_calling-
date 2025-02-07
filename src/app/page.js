
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


 export default function Home() {

  return (
    <><div className="flex flex-row h-screen bg-white ">
      <div className="flex justify-center basis-1/3 pl-4 bg-amber-100 h-screen ">
    <h1 className="">Welcome To Video calling app</h1>
      </div>
      <div className=" flex justify-center basis-2/3 bg-amber-50 h-screen ">
      <Tabs defaultValue="account" className=" w-[100%] p-[15%]  ">
        <TabsList className="ml-[35%]">
          <TabsTrigger value="account">Login</TabsTrigger>
          <TabsTrigger value="password">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Card className=" shadow-2xl">
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>login detail Description</CardDescription>
            </CardHeader>
          <CardContent>
            <Label htmlFor="email">Email</Label>
            <Input type="email" id="email" placeholder="Email"/>
          </CardContent>
          <CardContent>
          <Label htmlFor="password">Password</Label>
          <Input type="password" id="password" placeholder="password"/>
          </CardContent>
          <CardFooter>
            <Link href="/welcome">
            <Button>Login</Button>
            </Link>
          </CardFooter>
          </Card>

        </TabsContent>
        <TabsContent value="password">
        <Card className=" shadow-2xl">
        <CardHeader>
          <CardTitle>SingUp</CardTitle>
          <CardDescription>sign up Description</CardDescription>
        </CardHeader>
        <CardContent>
        <Label htmlFor="name ">Full Name </Label>
        <Input type="text"  placeholder="Full Name"/>
        </CardContent>
        <CardContent>
        <Label htmlFor="email ">Email </Label>
        <Input type="email"  placeholder="Email"/>
        </CardContent>
        <CardContent>
        <Label htmlFor="password ">Password </Label>
        <Input type="password"  placeholder="New Password"/>
        </CardContent>
        <CardContent>
        <Label htmlFor="password ">Confirm Password </Label>
        <Input type="password"  placeholder="Confirm  Password "/>
        </CardContent>
        <CardFooter>


  <Button type="submit">Sign Up</Button>

        </CardFooter>
      </Card>
      </TabsContent>
</Tabs>

      </div>
        
      </div>
      
    </>
     
  );
}
