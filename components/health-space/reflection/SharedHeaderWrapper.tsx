'use client'
import React from 'react'
import SharedHeader from '@/components/health-space/reflection/shared-header'

interface SharedHeaderWrapperProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

export default function SharedHeaderWrapper({ 
  searchQuery, 
  onSearchChange, 
  selectedFilter, 
  onFilterChange 
}: SharedHeaderWrapperProps) {
  return (
    <SharedHeader
      searchQuery={searchQuery}
      onSearchChange={onSearchChange}
      selectedFilter={selectedFilter}
      onFilterChange={onFilterChange}
    />
  )
}