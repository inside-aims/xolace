"use client";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {DownloadButtons} from "@/components/shared/layoutUIs/download-buttons";

export const HeroSection = () => {
  return (
    <section id={"hero"} className="w-full relative">
      <div className="sticky top-0 flex overflow-hidden section mb-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute top-10 right-10 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-2xl" />
        </div>
        <div className="text-center space-y-8 max-w-3xl mx-auto py-6 md:py-12 px-4 z-10 relative">
          <Badge variant="outline" className="text-sm py-2">
            <span className="mr-2 text-primary">
              <Badge>New</Badge>
            </span>
            <span>Now on iOS &amp; Android</span>
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            For the moments that{" "}
            <span className="text-primary">don't have a name</span> yet
          </h1>

          <p className="max-w-screen-sm mx-auto text-xl text-muted-foreground">
            A quiet place to say what's true, when you can't find the words. Not
            therapy. Not a chatbot. Not a social platform.
          </p>

          <DownloadButtons />

          <p className="text-sm text-muted-foreground">
            Or{" "}
            <Link
              href="/sign-up"
              className="underline underline-offset-4 hover:text-foreground transition-colors"
            >
              continue to the web app
            </Link>
          </p>
        </div>
      </div>

      <div className="relative z-20 bg-background">
        <div className="lg:max-w-7xl mx-auto px-4 -mt-18">
          <div className="relative group">
            <div className="absolute top-2 lg:-top-8 left-1/2 transform -translate-x-1/2 w-[80%] mx-auto h-24 lg:h-80 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-full h-20 md:h-28 bg-linear-to-b from-background/0 via-background/50 to-background rounded-b-xl pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
};
