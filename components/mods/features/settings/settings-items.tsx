"use client";

import { ChevronRight } from "lucide-react";
import React from "react";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export interface SettingsItemProps {
  label: string;
  value?: string;
  description?: string;
  onClick?: () => void;
  toggle?: boolean;
  toggleValue?: boolean;
  type?: "input" | "textarea" | "select";
  options?: string[];
  isOpen?: boolean;
  onClose?: () => void;
  onSave?: (label: string, value: string) => void;
}

const SettingsItem = (
  {label, value, description, toggle, toggleValue, type,
    options, isOpen, onClose, onSave, onClick,}: SettingsItemProps) => {

  const { register, handleSubmit, setValue, formState: { isDirty }, } = useForm({
    defaultValues: {
      field: value || "",
    },
  });

  //eslint-disable-next-line
  const handleSave = (data: any) => {
    onSave?.(label,data.field);
    onClose?.();
  };

  return (
    <div className="w-full flex flex-col">
      <div
        className="w-full flex items-center justify-between cursor-pointer group"
        onClick={() => !toggle && onClick?.()}
      >
        <div>
          <p className="font-medium">{label}</p>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>

        {toggle ? (
          <Switch checked={toggleValue} />
        ) : (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            {value && value}
            <span className="p-2 rounded-full transition-colors duration-200 group-hover:bg-neutral-200 dark:group-hover:bg-neutral-800">
              <ChevronRight />
            </span>
          </div>
        )}
      </div>

      {isOpen && !toggle && (
        <form
          onSubmit={handleSubmit(handleSave)}
          className="mt-3 p-3 rounded-xl border bg-muted/30 space-y-3"
        >
          {type === "input" && (
            <Input
              {...register("field")}
              placeholder={`Enter ${label}`}
            />
          )}

          {type === "textarea" && (
            <Textarea
              {...register("field")}
              placeholder={`Enter ${label}`}
              rows={4}
            />
          )}

          {type === "select" && options && (
            <Select
              onValueChange={(val) => setValue("field", val, { shouldDirty: true })}
              defaultValue={value || options?.[0]}
            >
              <SelectTrigger>
                <SelectValue placeholder={`Select ${label}`} />
              </SelectTrigger>
              <SelectContent>
                {options.map((opt, i) => (
                  <SelectItem key={i} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className={"rounded-full border px-4"}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isDirty}
              size="sm"
              className={"bg-lavender-500 hover:bg-lavender-600 rounded-full dark:bg-lavender-500 dark:hover:bg-lavender-600 text-white px-4"}
            >
              Save
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default SettingsItem;
