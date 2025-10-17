import React from 'react';
import { Control, FieldValues, Path } from 'react-hook-form';
import { Globe, PaintRoller, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';

interface ToolsPopoverProps<T extends FieldValues> {
  control: Control<T>;
  is24HourFieldName: Path<T>;
  is24HourPost: boolean;
  disabled?: boolean;
}

interface ToolOption {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  available: boolean;
  colorClass?: string;
}

const TOOL_OPTIONS: ToolOption[] = [
  {
    id: '24h-expiry',
    label: '24h Auto-Delete',
    description: 'Post will disappear after 24 hours',
    icon: <Timer className="h-4 w-4" />,
    available: true,
    colorClass: 'purple',
  },
  {
    id: 'visibility',
    label: 'Visibility',
    description: 'Coming soon',
    icon: <Globe className="h-4 w-4" />,
    available: false,
  },
];

/**
 * ToolsPopover Component
 * 
 * Popover containing post configuration tools (24h expiry, visibility, etc.)
 * 
 * @improvements
 * 1. Extracted complex popover logic
 * 2. Extensible tool options structure
 * 3. Visual feedback for active tools
 * 4. Disabled state for coming soon features
 * 5. Type-safe with generics
 */
export function ToolsPopover<T extends FieldValues>({
  control,
  is24HourFieldName,
  is24HourPost,
  disabled = false,
}: ToolsPopoverProps<T>) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={`mb-2 rounded-xl transition-all duration-200 ${
            is24HourPost
              ? 'border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300'
              : 'hover:bg-muted'
          }`}
          id="tools-btn"
          disabled={disabled}
          aria-label="Open post tools"
        >
          <PaintRoller className="mr-2 h-4 w-4" />
          Tools
          {is24HourPost && (
            <div className="ml-2 h-2 w-2 animate-pulse rounded-full bg-purple-500"></div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="bg-background border-border w-80 rounded-xl border p-0 shadow-xl"
        align="end"
      >
        <div className="p-4">
          {/* Header */}
          <div className="mb-4 flex items-center gap-2">
            <PaintRoller className="text-foreground h-5 w-5" />
            <h3 className="text-foreground font-semibold">Post Tools</h3>
          </div>

          {/* Tools List */}
          <div className="space-y-4">
            {/* 24h Expiry Tool */}
            <FormField
              control={control}
              name={is24HourFieldName}
              render={({ field }) => (
                <FormItem>
                  <div className="border-border hover:bg-muted/50 flex items-center justify-between rounded-lg border p-3 transition-colors">
                    <div className="flex items-center gap-3">
                      <div
                        className={`rounded-lg p-2 ${
                          field.value
                            ? 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        <Timer className="h-4 w-4" />
                      </div>
                      <div>
                        <FormLabel className="text-foreground cursor-pointer text-sm font-medium">
                          24h Auto-Delete
                        </FormLabel>
                        <p className="text-muted-foreground text-xs">
                          Post will disappear after 24 hours
                        </p>
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-purple-500"
                        disabled={disabled}
                        aria-label="Toggle 24 hour auto-delete"
                      />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />

            {/* Coming Soon Tools */}
            {TOOL_OPTIONS.filter(tool => !tool.available).map((tool) => (
              <div
                key={tool.id}
                className="border-border flex items-center justify-between rounded-lg border border-dashed p-3 opacity-50"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-muted text-muted-foreground rounded-lg p-2">
                    {tool.icon}
                  </div>
                  <div>
                    <div className="text-muted-foreground text-sm font-medium">
                      {tool.label}
                    </div>
                    <p className="text-muted-foreground text-xs">
                      {tool.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}