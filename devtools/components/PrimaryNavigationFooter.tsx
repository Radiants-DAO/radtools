'use client';

import { useState, useRef, useEffect } from 'react';
import type { Tab } from '../types';
import { Input } from '@/components/ui/Input';
import { Icon } from '@/components/icons';
import { SEARCH_INDEX, type SearchableItem } from '../tabs/ComponentsTab/DesignSystemTab';
import { TYPOGRAPHY_SEARCH_INDEX, type TypographySearchableItem } from '../lib/searchIndexes';

interface PrimaryNavigationFooterProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  // Search props
  componentSearchQuery?: string;
  onComponentSearchChange?: (query: string) => void;
  typographySearchQuery?: string;
  onTypographySearchChange?: (query: string) => void;
}

const TABS_CONFIG: { id: Tab; label: string; iconName?: string }[] = [
  { id: 'variables', label: 'Variables', iconName: 'settings' },
  { id: 'typography', label: 'Typography', iconName: 'file-written' },
  { id: 'components', label: 'Components', iconName: 'wrench' },
  { id: 'assets', label: 'Assets', iconName: 'folder-open' },
  { id: 'mockStates', label: 'Mock States', iconName: 'wrench' },
];

export function PrimaryNavigationFooter({
  activeTab,
  onTabChange,
  componentSearchQuery = '',
  onComponentSearchChange,
  typographySearchQuery = '',
  onTypographySearchChange,
}: PrimaryNavigationFooterProps) {
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const showSearch = activeTab === 'components' || activeTab === 'typography';
  const searchQuery = activeTab === 'components' ? componentSearchQuery : typographySearchQuery;
  const onSearchChange = activeTab === 'components' ? onComponentSearchChange : onTypographySearchChange;

  // Get matching suggestions
  const suggestions = searchQuery
    ? (activeTab === 'components'
        ? SEARCH_INDEX.filter((item) =>
            item.text.toLowerCase().includes(searchQuery.toLowerCase())
          ).slice(0, 10)
        : TYPOGRAPHY_SEARCH_INDEX.filter((item) => {
            const queryLower = searchQuery.toLowerCase();
            return (
              item.text.toLowerCase().includes(queryLower) ||
              item.aliases.some((alias) => alias.toLowerCase().includes(queryLower)) ||
              item.element.toLowerCase().includes(queryLower)
            );
          }).slice(0, 10))
    : [];

  // Close autocomplete when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowAutocomplete(false);
      }
    };

    if (showSearch) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearchChange) {
      onSearchChange(e.target.value);
    }
    setShowAutocomplete(true);
    setSelectedSuggestionIndex(0);
  };

  const handleSelectSuggestion = (item: SearchableItem | TypographySearchableItem) => {
    if (onSearchChange) {
      onSearchChange(item.text);
    }
    setShowAutocomplete(false);
    
    // Scroll to section for typography
    if (activeTab === 'typography' && 'sectionId' in item) {
      const sectionElement = document.getElementById(`typography-${item.sectionId}`);
      if (sectionElement) {
        sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab' && suggestions.length > 0 && showAutocomplete) {
      e.preventDefault();
      if (suggestions[selectedSuggestionIndex]) {
        handleSelectSuggestion(suggestions[selectedSuggestionIndex] as SearchableItem | TypographySearchableItem);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setShowAutocomplete(true);
      setSelectedSuggestionIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter' && suggestions.length > 0 && showAutocomplete) {
      e.preventDefault();
      if (suggestions[selectedSuggestionIndex]) {
        handleSelectSuggestion(suggestions[selectedSuggestionIndex] as SearchableItem | TypographySearchableItem);
      }
    } else if (e.key === 'Escape') {
      setShowAutocomplete(false);
    }
  };

  const highlightText = (text: string, query: string) => {
    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return text;
    return (
      <>
        {text.substring(0, index)}
        <span className="bg-sun-yellow">{text.substring(index, index + query.length)}</span>
        {text.substring(index + query.length)}
      </>
    );
  };

  return (
    <div className="flex items-center justify-between gap-4 px-2 py-2 bg-warm-cloud border-t border-black">
      {/* Left: Primary Tabs */}
      <div className="flex gap-1 items-center overflow-x-auto">
        {TABS_CONFIG.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center justify-center gap-2 px-4 py-2 font-joystix text-xs uppercase cursor-pointer select-none text-black transition-all duration-200 ease-out relative border border-black rounded-sm flex-none ${
              activeTab === tab.id ? 'bg-sun-yellow' : 'bg-transparent hover:bg-black/5'
            }`}
          >
            {tab.iconName && <Icon name={tab.iconName} size={14} />}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Right: Search (only for Components and Typography) */}
      {showSearch && (
        <div className="relative flex-shrink-0 w-fit" ref={containerRef}>
          <Input
            ref={inputRef}
            type="text"
            iconName="search"
            placeholder={
              activeTab === 'components'
                ? 'Search components...'
                : 'Search typography (H1, Heading 1, P, Paragraph...)'
            }
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowAutocomplete(true)}
          />
          {/* Autocomplete */}
          {showAutocomplete && suggestions.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-warm-cloud border border-black rounded-sm shadow-[4px_4px_0_0_var(--color-black)] max-h-64 overflow-y-auto bottom-full mb-1">
              {suggestions.map((item, index) => {
                if (activeTab === 'components') {
                  const componentItem = item as SearchableItem;
                  const SECTION_TITLES: Record<string, string> = {
                    buttons: 'Buttons',
                    cards: 'Cards',
                    forms: 'Forms',
                    feedback: 'Feedback',
                    navigation: 'Navigation',
                    overlays: 'Overlays',
                  };
                  const sectionTitle = SECTION_TITLES[componentItem.sectionId];
                  const isSubsection = componentItem.subsectionTitle !== undefined;
                  const displayTitle = isSubsection ? componentItem.subsectionTitle : sectionTitle;

                  return (
                    <button
                      key={`${componentItem.sectionId}-${componentItem.text}-${index}`}
                      type="button"
                      onClick={() => {
                        if (onSearchChange) onSearchChange(componentItem.text);
                        setShowAutocomplete(false);
                      }}
                      className={`w-full text-left px-3 py-2 font-mondwest text-sm transition-colors ${
                        index === selectedSuggestionIndex
                          ? 'bg-sun-yellow text-black'
                          : 'bg-warm-cloud text-black hover:bg-black/5'
                      } ${isSubsection ? 'pl-6' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-0.5">
                          {displayTitle && (
                            <span className="font-joystix text-xs font-bold text-black/60 uppercase">
                              {displayTitle}
                            </span>
                          )}
                          <span>{highlightText(componentItem.text, searchQuery)}</span>
                        </div>
                        <span className="text-xs text-black/40 uppercase">{componentItem.type}</span>
                      </div>
                    </button>
                  );
                } else {
                  const typographyItem = item as TypographySearchableItem;
                  return (
                    <button
                      key={`${typographyItem.sectionId}-${typographyItem.text}-${index}`}
                      type="button"
                      onClick={() => handleSelectSuggestion(typographyItem)}
                      className={`w-full text-left px-3 py-2 font-mondwest text-sm transition-colors ${
                        index === selectedSuggestionIndex
                          ? 'bg-sun-yellow text-black'
                          : 'bg-warm-cloud text-black hover:bg-black/5'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-joystix text-xs font-bold text-black/60 uppercase">
                            {typographyItem.sectionId}
                          </span>
                          <span>{highlightText(typographyItem.text, searchQuery)}</span>
                        </div>
                        <span className="text-xs text-black/40 uppercase font-mono">
                          {`<${typographyItem.element}>`}
                        </span>
                      </div>
                    </button>
                  );
                }
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

