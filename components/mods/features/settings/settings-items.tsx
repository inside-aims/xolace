"use client";

import {ChevronRight, Minus, Pencil, Save} from "lucide-react";
import React, {useState, useEffect} from "react";
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
  type?: "input" | "textarea" | "select" | "resources";
  options?: string[];
  isOpen?: boolean;
  onClose?: () => void;
  onSave?: (label: string, value: string | { label: string; value: string }[]) => void;
  isSaving?: boolean;
  disabled?: boolean;
  resourcesList?: { label: string; value: string }[];
  onResourcesChange?: (resources: { label: string; value: string }[]) => void;
}

const SettingsItem = (
  {label, value, description, toggle, toggleValue, type, options, isOpen, onClose, onSave, onClick, isSaving, disabled, resourcesList, onResourcesChange}: SettingsItemProps) => {

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [editValue, setEditValue] = useState("");
  const [resources, setResources] = useState(resourcesList);

  useEffect(() => {
    setResources(resourcesList);
  }, [resourcesList]);

  const handleEdit = (idx: number, res: { label: string; value: string }) => {
    setEditingIndex(idx);
    setEditLabel(res.label);
    setEditValue(res.value);
  };

  const { register, handleSubmit, setValue, formState: { isDirty }, } = useForm({
    defaultValues: {
      field: value || "",
    },
  });

  //eslint-disable-next-line
  const handleSave = (data: any) => {
    if (type === "resources" && resourcesList) {
      onSave?.(label, resourcesList);
    } else {
      onSave?.(label, data.field);
    }
    onClose?.();
  };
  

  return (
    <div className="w-full flex flex-col">
      <div
        className={`${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} w-full flex items-center justify-between group`}
        onClick={() => {
          if (disabled) return;
          !toggle && onClick?.();
        }}
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
            {value && label === 'Display name' ? `x/${value}` : value}
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

          {type === "resources" && resourcesList && (
            <div className="space-y-3">
              {resourcesList.map((res, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-2 p-2 rounded-lg border"
                >
                  {editingIndex === idx ? (
                    <div className="flex flex-1 flex-col gap-2">
                      <Input
                        value={editLabel}
                        onChange={(e) => setEditLabel(e.target.value)}
                        placeholder="Resource name"
                      />
                      <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        placeholder="Resource link"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col flex-1">
                      <span className="font-medium">{res.label}</span>
                      <span className="text-xs text-muted-foreground">{res.value}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    {editingIndex === idx ? (
                      <Button
                        type="button"
                        size="sm"
                        className="px-3 rounded-full bg-lavender-500 hover:bg-lavender-600 text-white"
                        onClick={() => {
                          const updated = [...resourcesList];
                          updated[idx] = { label: editLabel, value: editValue };
                          onResourcesChange?.(updated);
                          setEditingIndex(null);
                          setValue("field", "dirty", { shouldDirty: true });
                        }}
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => handleEdit(idx, res)}
                          className="p-1 rounded-full hover:bg-muted"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = resourcesList.filter((_, i) => i !== idx);
                            onResourcesChange?.(updated);
                          }}
                          className="p-1 rounded-full hover:bg-muted text-red-500"
                          title="Remove"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}

              {resourcesList.length < 3 && (
                <Button
                  type="button"
                  onClick={() => {
                    const updated = [
                      ...resourcesList,
                      { label: "New Resource", value: "" },
                    ];
                    onResourcesChange?.(updated);
                    handleEdit(updated.length - 1, updated[updated.length - 1]);
                  }}
                  className="w-full rounded-full"
                  variant="outline"
                >
                  + Add Resource
                </Button>
              )}
            </div>
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
              disabled={!isDirty || isSaving}
              size="sm"
              className={"bg-lavender-500 hover:bg-lavender-600 rounded-full dark:bg-lavender-500 dark:hover:bg-lavender-600 text-white px-4"}
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default SettingsItem;