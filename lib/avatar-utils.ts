import { FEMALE_NAMES } from './departments-data';

// In-memory cache for avatar URLs
const avatarCache = new Map<string, string>();

// Session storage key for persistent caching
const STORAGE_KEY = 'enactus_avatar_cache';

// Load cache from sessionStorage on initialization
function loadCacheFromStorage(): void {
  if (typeof window === 'undefined') return;
  
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      Object.entries(parsed).forEach(([key, value]) => {
        avatarCache.set(key, value as string);
      });
    }
  } catch (error) {
    console.warn('Failed to load avatar cache:', error);
  }
}

// Save cache to sessionStorage
function saveCacheToStorage(): void {
  if (typeof window === 'undefined') return;
  
  try {
    const cacheObj = Object.fromEntries(avatarCache.entries());
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cacheObj));
  } catch (error) {
    console.warn('Failed to save avatar cache:', error);
  }
}

// Determine if a name is female based on predefined list
function isFemale(name: string): boolean {
  const nameLower = name.toLowerCase();
  return FEMALE_NAMES.some(femaleName => nameLower.includes(femaleName));
}

/**
 * Generate avatar URL with caching
 * Uses in-memory cache and sessionStorage for optimal performance
 */
export function getAvatar(name: string): string {
  // Check in-memory cache first
  if (avatarCache.has(name)) {
    return avatarCache.get(name)!;
  }
  
  // Generate avatar URL
  const params = isFemale(name)
    ? "&beardProbability=0&hatProbability=0&hair=long01,long02,long03,long04,long05"
    : "&hatProbability=0&hair=short01,short02,short03,short04,short05";
  
  const url = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(name)}${params}`;
  
  // Cache the URL
  avatarCache.set(name, url);
  saveCacheToStorage();
  
  return url;
}

/**
 * Preload avatars for given names
 * Useful for eager loading all department member avatars
 */
export function preloadAvatars(names: string[]): void {
  names.forEach(name => getAvatar(name));
}

/**
 * Clear avatar cache (useful for testing or memory management)
 */
export function clearAvatarCache(): void {
  avatarCache.clear();
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(STORAGE_KEY);
  }
}

// Initialize cache on module load
if (typeof window !== 'undefined') {
  loadCacheFromStorage();
}
