import { User, UserData } from '../types';

const DB_KEY = 'filmia_user_db';

export const defaultUserData: UserData = {
  name: '',
  theme: 'dark',
  fontFamily: 'lexend',
  navbarLayout: 'horizontal',
  pinnedItems: [],
  timetableEntries: [],
  appLinks: [],
  socialAccounts: [],
  journalEntries: [],
  visibleTabs: { 'media-studies': true, 'film-studies': true },
  studiedSubjects: [],
  studyLog: [],
  focusItems: [],
  unlockedAchievements: [],
  dailySpark: null,
  aiInteractionCounts: { summaryCount: 0, sparkCount: 0 },
  notesPanelState: {
    isOpen: false,
    position: { x: window.innerWidth - 520, y: 100 },
    size: { width: 500, height: 400 },
    tabs: [{ id: '1', title: 'General Notes', content: '' }],
    activeTabId: '1',
  },
  setupCompleted: false,
  hasCompletedTour: false,
};

// Gets all users from localStorage
export const getAllUsers = (): Record<string, User> => {
  try {
    const db = localStorage.getItem(DB_KEY);
    return db ? JSON.parse(db) : {};
  } catch (e) {
    console.error("Failed to parse user DB from localStorage", e);
    return {};
  }
};

// Gets a single user by username
export const getUser = (username: string): User | null => {
  const users = getAllUsers();
  return users[username] || null;
};

// Saves a user object, overwriting if exists
export const saveUser = (user: User) => {
  try {
    const users = getAllUsers();
    users[user.username] = user;
    localStorage.setItem(DB_KEY, JSON.stringify(users));
  } catch (e) {
    console.error("Failed to save user to localStorage", e);
  }
};