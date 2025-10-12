import { ReactNode } from "react";

// Fix: Define all necessary types for the application.

export interface Term {
    term: string;
    definition: string;
}

export interface Theorist {
    id: string;
    title: string;
    whatItSays: string;
    keyTerms: Term[];
    additionalTerms?: Term[];
    example: string;
    youtubeVideoId?: string;
}

export interface TheoristCategory {
    id:string;
    title: string;
    theorists: Theorist[];
}

export interface CSP {
    id: string;
    title: string;
    year: number;
    category: string;
    imageUrl: string;
    synopsis: string;
    keyFacts: { [key: string]: string };
    applicableTheorists: string[];
    revisionNotes?: string[];
    youtubeVideoIds?: string[];
}

export interface CSPCategory {
    id: string;
    title: string;
    csps: CSP[];
}

export interface ResourceItem {
    id: string;
    title: string;
    overview: string;
    youtubeVideoId: string;
}

export interface ProjectMediaItem {
    id: number;
    title: string;
    category: 'Music' | 'Gaming' | 'Politics' | 'Film';
    sourceUrl: string;
    imageUrl: string;
}

export interface Post {
    id: string;
    platform: string;
    user: string;
    userProfileUrl: string;
    time: string;
    content: string;
}

export interface SocialAccount {
    url: string;
    username: string;
    platform: string;
}

export interface LayoutItem {
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
}

export interface NoteTab {
  id: string;
  title: string;
  content: string;
}

export interface NotesPanelState {
  isOpen: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  tabs: NoteTab[];
  activeTabId: string | null;
}

export interface PinnedItem {
    id: string;
    title: string;
    type: 'theorist' | 'csp';
    category: string;
}

export interface TimetableEntry {
    id: string;
    day: string;
    time: string;
    subject: string;
}

export interface AppLink {
    id: string;
    name: string;
    url: string;
}

export interface JournalEntry {
    id: string;
    title: string;
    type: 'Film' | 'TV Show' | 'Game' | 'Book';
    rating: number; // 0-5
    review: string;
    date: string; // ISO string
}

export type FontFamily = 'lora' | 'merriweather' | 'playfair-display' | 'inter' | 'lato' | 'lexend' | 'inconsolata';

export type SearchResult =
  | { type: 'theorist'; item: Theorist; category: string }
  | { type: 'csp'; item: CSP; category: string }
  | { type: 'journal'; item: JournalEntry }
  | { type: 'note'; item: NoteTab };