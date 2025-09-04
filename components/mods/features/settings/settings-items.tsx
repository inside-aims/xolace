'use client';

import { ChevronRight, Minus, Pencil, Save } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export interface SettingsItemProps {
  label: string;
  value?: string;
  description?: string;
  onClick?: () => void;
  onToggle?: (val: boolean) => void;
  toggle?: boolean;
  toggleValue?: boolean;
  type?: 'input' | 'textarea' | 'select' | 'resources';
  options?: string[];
  isOpen?: boolean;
  onClose?: () => void;
  onSave?: (
    label: string,
    value: string | { label: string; value: string }[],
  ) => void;
  isSaving?: boolean;
  disabled?: boolean;
  resourcesList?: { label: string; value: string }[];
  onResourcesChange?: (resources: { label: string; value: string }[]) => void;
  isLoading?: boolean;
}

const SettingsItem = ({
  label,
  value,
  description,
  toggle,
  toggleValue,
  type,
  options,
  isOpen,
  onClose,
  onSave,
  onClick,
  isSaving,
  disabled,
  resourcesList = [],
  onResourcesChange,
  onToggle,
  isLoading,
}: SettingsItemProps) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [editValue, setEditValue] = useState('');
  const [resources, setResources] = useState(resourcesList);

  useEffect(() => {
    setResources(resourcesList);
  }, []);

  const handleEdit = (idx: number, res: { label: string; value: string }) => {
    setEditingIndex(idx);
    setEditLabel(res.label);
    setEditValue(res.value);
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isDirty },
  } = useForm({
    defaultValues: {
      field: value || '',
    },
  });

  //eslint-disable-next-line
  const handleSave = (data: any) => {
    if (type === 'resources' && resources) {
      onSave?.(label, resources);
    } else {
      onSave?.(label, data.field);
    }
    setValue('field', 'dirty', { shouldDirty: false });
    onClose?.();
  };

  const addResource = () => {
    if (resources.length < 3) {
      const idx = resources.length;
      setResources([...resources, { label: 'Resource Name', value: '' }]);
      handleEdit(idx, { label: 'Resource Name', value: '' });
    }
  };

  const updateResource = (index: number) => {
    if (!editLabel || !editValue) {
      toast.error('Please fill in both fields');
      return;
    }

    // check if editValue is link format
    if (editValue && !editValue.startsWith('https')) {
      toast.error('Invalid link format. Please include https://');
      return;
    }

    setValue('field', 'dirty', { shouldDirty: true });
    const updated = [...resources];
    updated[index] = { label: editLabel, value: editValue };
    setEditingIndex(null);
    setResources(updated);
  };

  const removeResource = (index: number) => {
    setValue('field', 'dirty', { shouldDirty: true });
    setResources(resources.filter((_, i) => i !== index));
  };

  return (
    <div className="flex w-full flex-col">
      <div
        className={`${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} group flex w-full items-center justify-between`}
        onClick={() => {
          if (disabled || isLoading) return;
          !toggle && onClick?.();
        }}
      >
        <div>
          <p className="font-medium">{label}</p>
          {description && (
            <p className="text-muted-foreground text-sm">{description}</p>
          )}
        </div>

        {toggle ? (
          <Switch
            checked={toggleValue}
            onCheckedChange={val => onToggle?.(val)}
            disabled={disabled || isLoading}
          />
        ) : (
          <div className="text-muted-foreground flex items-center gap-1 text-sm">
            {value && label === 'Display name'
              ? `x/${value}`
              : label === 'Resources'
                ? `${resources.length}/3`
                : value}
            <span className="rounded-full p-2 transition-colors duration-200 group-hover:bg-neutral-200 dark:group-hover:bg-neutral-800">
              <ChevronRight />
            </span>
          </div>
        )}
      </div>

      {isOpen && !toggle && (
        <form
          onSubmit={handleSubmit(handleSave)}
          className="bg-muted/30 mt-3 space-y-3 rounded-xl border p-3"
        >
          {type === 'input' && (
            <Input {...register('field')} placeholder={`Enter ${label}`} />
          )}

          {type === 'textarea' && (
            <Textarea
              {...register('field')}
              placeholder={`Enter ${label}`}
              rows={4}
            />
          )}

          {type === 'select' && options && (
            <Select
              onValueChange={val =>
                setValue('field', val, { shouldDirty: true })
              }
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

          {type === 'resources' && resources && (
            <div className="space-y-3">
              {resources.map((res, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-2 rounded-lg border p-2"
                >
                  {editingIndex === idx ? (
                    <div className="flex flex-1 flex-col gap-2">
                      <Input
                        value={editLabel}
                        onChange={e => setEditLabel(e.target.value)}
                        placeholder="Resource name"
                      />
                      <Input
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        placeholder="Resource link"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-1 flex-col">
                      <span className="font-medium">{res.label}</span>
                      <span className="text-muted-foreground text-xs">
                        {res.value}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    {editingIndex === idx ? (
                      <Button
                        type="button"
                        size="sm"
                        className="bg-lavender-500 hover:bg-lavender-600 rounded-full px-3 text-white"
                        onClick={() => {
                          updateResource(idx);
                        }}
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => handleEdit(idx, res)}
                          className="hover:bg-muted rounded-full p-1"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeResource(idx)}
                          className="hover:bg-muted rounded-full p-1 text-red-500"
                          title="Remove"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}

              {resources.length < 3 && (
                <Button
                  type="button"
                  onClick={addResource}
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
              onClick={() => {
                setEditingIndex(null);
                onClose?.();
              }}
              className={'rounded-full border px-4'}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isDirty || isSaving}
              size="sm"
              className={
                'bg-lavender-500 hover:bg-lavender-600 dark:bg-lavender-500 dark:hover:bg-lavender-600 rounded-full px-4 text-white'
              }
            >
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default SettingsItem;
