"use client";

import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "../ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import Loader from "../shared/Loader";
import { useToast } from "../ui/use-toast";
import { getSupabaseBrowserClient } from "@/utils/supabase/client";

interface ReportFormProps {
  postId?: any;
  commentId?: any;
}

const ReportForm = ({ postId, commentId }: ReportFormProps) => {
  const { toast } = useToast();

  // initialize supabase client
  const supabase = getSupabaseBrowserClient();

  //states
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const ReportSchema = z.object({
    description: z
      .string()
      .min(10, {
        message: "Report must be at least 10 characters.",
      })
      .max(200, {
        message: "Report must not be longer than 300 characters.",
      }),
    severity: z.string(),
    otherReason: z
      .string()
      .max(100, {
        message: "Report must not be longer than 300 characters.",
      })
      .optional(),
  });

  const form = useForm<z.infer<typeof ReportSchema>>({
    resolver: zodResolver(ReportSchema),
    defaultValues: {
      description: "",
      severity: "",
      otherReason: "",
    },
  });

  // watch post realtime updates
  const { watch } = form;
  const description = watch("description");

  //
  async function onSubmit(data: z.infer<typeof ReportSchema>) {


    // extract severity
    const { description, severity, otherReason } = data;
    let getReason = "";
    setIsLoading(true);

    // convert severity to number
    const numSeverity = Number(severity);
    if (isNaN(numSeverity) || numSeverity < 1 || numSeverity > 5) {
      toast({
        title: "Severity Error",
        description: "Please enter a valid severity number between 1 and 5.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (!otherReason) {
      getReason = reason;
    } else {
      getReason = otherReason;
    }

    const report = {
      description,
      severity: numSeverity,
      reason: getReason,
      post_id: postId,
      comment_id: commentId,
    };

    const { error: reportError } = await supabase
      .from("reports")
      .insert(report);

    if (reportError) {
      if (reportError.message.startsWith("duplicate key value")) {
        toast({
          variant: "destructive",
          title: "Oops, You can't report on the same post twice 😵‍💫!",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Oops, something must have gone wrong 😵‍💫!",
        });
      }
      console.log(reportError);
      setIsLoading(false);
      return;
    }

    // show notification
    toast({
      variant: "default",
      title: "Report received. Our Team investigate the issue soon!💢",
    });

    setIsLoading(false);
    form.reset();
    setReason("");
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-4 py-4 max-md:px-5"
      >
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="severity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Severity</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select the severity level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">Severity 1 - lowest</SelectItem>
                    <SelectItem value="2">Severity 2</SelectItem>
                    <SelectItem value="3">Severity 3</SelectItem>
                    <SelectItem value="4">Severity 4</SelectItem>
                    <SelectItem value="5">Severity 5 - Highest</SelectItem>
                  </SelectContent>
                </Select>
                {/* <FormDescription>
                  You can manage email addresses in your
                </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* reasons options */}
          <div className="grid gap-2 mt-2">
            <Label htmlFor="report-reasons">Reason</Label>
            <Select onValueChange={setReason} defaultValue={reason}>
              <SelectTrigger id="report-reasons" className=" truncate">
                <SelectValue placeholder="Select Reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="spam">Spam</SelectItem>
                <SelectItem value="harassment">Harassment</SelectItem>
                <SelectItem value="hate speech">Hate Speech</SelectItem>
                <SelectItem value="violence">Violence</SelectItem>
                <SelectItem value="misinformation">Misinformation</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          {reason === "other" && (
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="otherReason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Please state your reason..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Please try to be precise and straightforward as possible
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>

        <div className="">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Please include all information relevant to your issue."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          disabled={description.length > 200 || isLoading}
          type="submit"
          className=" rounded-full"
        >
          {isLoading ? (
            <span className=" flex gap-2">
              <Loader />
              <p>Loading...</p>
            </span>
          ) : (
            "Submit"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ReportForm;
