"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react'
import type { CampfireRule } from "./campfires.types"

type Props = {
  rules?: CampfireRule[]
  onChange?: (rules: CampfireRule[]) => void
}

export default function RulesEditor({ rules = [], onChange = () => {} }: Props) {
  function addRule() {
    const id = Date.now()
    const newRule: CampfireRule = {
      id,
      title: "",
      description: "",
      display_order: rules.length,
    }
    onChange([...rules, newRule])
  }

  function updateRule(id: number, patch: Partial<CampfireRule>) {
    onChange(rules.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  }

  function removeRule(id: number) {
    onChange(rules.filter((r) => r.id !== id).map((r, idx) => ({ ...r, display_order: idx })))
  }

  function move(id: number, dir: "up" | "down") {
    const idx = rules.findIndex((r) => r.id === id)
    if (idx === -1) return
    const newIdx = dir === "up" ? Math.max(0, idx - 1) : Math.min(rules.length - 1, idx + 1)
    if (newIdx === idx) return
    const copy = [...rules]
    const [item] = copy.splice(idx, 1)
    copy.splice(newIdx, 0, item)
    onChange(copy.map((r, i) => ({ ...r, display_order: i })))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">Add up to 10 rules to guide your campfire.</div>
        <Button size="sm" className="gap-2" onClick={addRule} disabled={rules.length >= 10}>
          <Plus className="size-4" />
          Add rule
        </Button>
      </div>

      <div className="space-y-3">
        {rules.map((rule, i) => (
          <Card key={rule.id} className="p-3">
            <div className="grid gap-3 sm:grid-cols-[1fr_120px]">
              <div className="space-y-3">
                <div className="grid gap-2">
                  <Label htmlFor={`title-${rule.id}`}>Rule title</Label>
                  <Input
                    id={`title-${rule.id}`}
                    value={rule.title}
                    onChange={(e) => updateRule(rule.id, { title: e.target.value.slice(0, 100) })}
                    placeholder="Be respectful"
                     className="border-border dark:bg-input/30 rounded-xl border-2 border-dashed bg-transparent"
                  />
                  <p className="text-xs text-muted-foreground">{Math.min(rule.title.length, 100)}/100</p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`desc-${rule.id}`}>Description</Label>
                  <Textarea
                    id={`desc-${rule.id}`}
                    value={rule.description ?? ""}
                    onChange={(e) => updateRule(rule.id, { description: e.target.value.slice(0, 500) })}
                    placeholder="Provide more details about this rule."
                    className={`border-border rounded-xl border-2 border-dashed bg-transparent text-base leading-relaxed transition-all duration-200 focus:border-purple-400 focus:ring-0 focus-visible:ring-0 min-h-[50px]`}
                  />
                  <p className="text-xs text-muted-foreground">
                    {Math.min((rule.description ?? "").length, 500)}/500
                  </p>
                </div>
              </div>

              <div className="flex h-full items-start justify-end gap-2">
                <Button variant="outline" size="icon" onClick={() => move(rule.id, "up")} disabled={i === 0}>
                  <ArrowUp className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => move(rule.id, "down")}
                  disabled={i === rules.length - 1}
                >
                  <ArrowDown className="size-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => removeRule(rule.id)}>
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {rules.length === 0 ? (
        <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
          No rules yet. Click “Add rule” to create one.
        </div>
      ) : null}
    </div>
  )
}
