import React from 'react';
import { Control, FieldValues, Path } from 'react-hook-form';
import { FileText, ImageIcon } from 'lucide-react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { NewBadge } from '@/components/shared/NewBadge';

export type PostType = 'single' | 'carousel';

interface PostTypeOption {
  value: PostType;
  label: string;
  icon: React.ReactNode;
  color: string;
  description?: string;
}

interface PostTypeSelectorProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  disabled?: boolean;
  showBadge?: boolean;
}

const POST_TYPE_OPTIONS: PostTypeOption[] = [
  {
    value: 'single',
    label: 'Single Post',
    icon: <FileText className="text-muted-foreground h-4 w-4" />,
    color: 'bg-green-500',
    description: 'Share a single thought or moment',
  },
  {
    value: 'carousel',
    label: 'Carousel',
    icon: <ImageIcon className="text-muted-foreground h-4 w-4" />,
    color: 'bg-blue-500',
    description: 'Tell a story across multiple slides',
  },
];

/**
 * PostTypeSelector Component
 * 
 * Dropdown selector for choosing between single post and carousel post types
 * 
 * @improvements
 * 1. Extracted from main form for reusability
 * 2. Type-safe with generics
 * 3. Configurable options
 * 4. Accessible with proper ARIA labels
 * 5. Consistent styling with design system
 */
export function PostTypeSelector<T extends FieldValues>({
  control,
  name,
  disabled = false,
  showBadge = true,
}: PostTypeSelectorProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="relative flex-1" id="post-type">
          <FormLabel className="text-foreground text-sm font-medium">
            Post Type
          </FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger 
                className="w-48 rounded-xl border-0"
                aria-label="Select post type"
              >
                <SelectValue />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="bg-background border-border rounded-xl border shadow-xl">
              {POST_TYPE_OPTIONS.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="hover:bg-muted cursor-pointer rounded-lg p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-3 w-3 items-center justify-center rounded-full ${option.color}`}>
                      <div className="h-1.5 w-1.5 rounded-full bg-white"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      {option.icon}
                      <span className="font-medium">{option.label}</span>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
          {showBadge && (
            <NewBadge
              size="sm"
              containerClass="absolute top-0 left-17"
            />
          )}
        </FormItem>
      )}
    />
  );
}

/**
 * Get post type option by value
 */
export function getPostTypeOption(value: PostType): PostTypeOption | undefined {
  return POST_TYPE_OPTIONS.find(opt => opt.value === value);
}