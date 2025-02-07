import Image from "next/image";
import { Button } from "@/components/ui/button";
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
      <div className="flex justify-center basis-1/3 pl-4 bg-blue-400 h-screen ">
    
      </div>
      <div className=" flex justify-center basis-2/3 bg-blue-600 h-screen ">
      <Tabs defaultValue="account" className="w-[1000%] p-[20%] ">
  <TabsList className="ml-[35%]">
    <TabsTrigger value="account">Login</TabsTrigger>
    <TabsTrigger value="password">Sign Up</TabsTrigger>
  </TabsList>
  <TabsContent value="account">
  <Card>
  <CardHeader>
    <CardTitle>Login</CardTitle>
    <CardDescription>login detail Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>user Name</p>
  </CardContent>
  <CardContent>
    <p>password</p>
  </CardContent>
  <CardFooter>
   <Button>Login</Button>
  </CardFooter>
</Card>

  </TabsContent>
  <TabsContent value="password"><Card>
  <CardHeader>
    <CardTitle>Sing UP</CardTitle>
    <CardDescription>sign up Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>name</p>
  </CardContent>
  <CardContent>
    <p>password</p>
  </CardContent>
  <CardContent>
    <p>confirm Password</p>
  </CardContent>
  <CardFooter>
  <Button>Sign Up</Button>
  </CardFooter>
</Card>
</TabsContent>
</Tabs>

      </div>
        
      </div>
      
    </>
     
  );
}
