"use client";

import React, { useEffect, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { PostCard } from "@/components/cards/PostCard";
import UpdatePasswordCardForm from "@/components/forms/UpdatePasswordCardForm";
import UpdateUsernameCardForm from "@/components/forms/UpdateUsernameCardForm";
import DeleteUserAccountCard from "@/components/cards/DeleteUserAccountCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import Loader from "@/components/shared/Loader";

const Profile = () => {
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);

  return (
    <>
      <div className="flex gap-3 md:gap-4 items-center justify-center">
        <Avatar>
          <AvatarImage src={"user?.avatarUrl"} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1 items-start justify-center">
          <h5 className="text-small tracking-tight text-default-400 text-dark-2 dark:text-white">
            {"user.username"}
          </h5>
          <h4 className="text-dark-4/65 dark:text-gray-400">{"5"}</h4>
        </div>
      </div>
      <Separator className=" my-4" />

      <Tabs defaultValue="account" className="w-[100%]">
        <TabsList className="grid w-full grid-cols-2 sticky top-16">
          <TabsTrigger value="account">Posts</TabsTrigger>
          <TabsTrigger value="password">Edit profile</TabsTrigger>
        </TabsList>
        <TabsContent value="account" className=" p-2">
          <ScrollArea className=" h-[58vh] md:h-80 w-full rounded-md">
            <div className=" p-4">
              {isLoadingPosts ? (
                <Loader />
              ) : (
                <ul className="flex flex-col flex-1 gap-3 w-full ">
                  <li key={"post.$id"} className="flex justify-center w-full">
                    <PostCard post={{}} section="profile" />
                  </li>

                  <li key={"post.$id"} className="flex justify-center w-full">
                    <PostCard post={{}} section="profile" />
                  </li>

                  <li key={"post.$id"} className="flex justify-center w-full">
                    <PostCard post={{}} section="profile" />
                  </li>
                </ul>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="password" className=" space-y-6 mb-10">
          <UpdatePasswordCardForm />
          <UpdateUsernameCardForm />
          <DeleteUserAccountCard />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Profile;
