/**
 * Local Storage Utility for CRUD Operations
 * 
 * This utility provides a simple interface for managing data in localStorage
 * with type safety and error handling.
 */

export interface StorageItem {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export class LocalStorageManager<T extends StorageItem> {
  private key: string;

  constructor(key: string) {
    this.key = key;
  }

  // Create
  create(item: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): T {
    const newItem: T = {
      ...item,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as T;

    const items = this.getAll();
    items.push(newItem);
    this.saveAll(items);
    return newItem;
  }

  // Read
  getAll(): T[] {
    try {
      const data = localStorage.getItem(this.key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`Error reading from localStorage (${this.key}):`, error);
      return [];
    }
  }

  getById(id: string): T | null {
    const items = this.getAll();
    return items.find(item => item.id === id) || null;
  }

  // Update
  update(id: string, updates: Partial<Omit<T, 'id' | 'createdAt'>>): T | null {
    const items = this.getAll();
    const index = items.findIndex(item => item.id === id);
    
    if (index === -1) return null;

    items[index] = {
      ...items[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.saveAll(items);
    return items[index];
  }

  // Delete
  delete(id: string): boolean {
    const items = this.getAll();
    const filteredItems = items.filter(item => item.id !== id);
    
    if (filteredItems.length === items.length) {
      return false; // Item not found
    }

    this.saveAll(filteredItems);
    return true;
  }

  // Clear all
  clear(): void {
    localStorage.removeItem(this.key);
  }

  // Helper methods
  private saveAll(items: T[]): void {
    try {
      localStorage.setItem(this.key, JSON.stringify(items));
    } catch (error) {
      console.error(`Error saving to localStorage (${this.key}):`, error);
    }
  }

  // Search and filter
  search(query: string, fields: (keyof T)[]): T[] {
    const items = this.getAll();
    const searchTerm = query.toLowerCase();
    
    return items.filter(item => 
      fields.some(field => {
        const value = item[field];
        return value && String(value).toLowerCase().includes(searchTerm);
      })
    );
  }

  // Get count
  getCount(): number {
    return this.getAll().length;
  }
}

// Predefined storage managers for common use cases
export const createStorageManager = <T extends StorageItem>(key: string) => {
  return new LocalStorageManager<T>(key);
}; 