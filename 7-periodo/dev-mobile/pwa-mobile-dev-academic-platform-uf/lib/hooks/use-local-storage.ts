import { useState, useEffect } from 'react';

export function useLocalStorage() {
  // Função para obter valor do localStorage
  const getStoredValue = <T>(key: string): T | null => {
    try {
      if (typeof window === 'undefined') return null;
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading from localStorage [${key}]:`, error);
      return null;
    }
  };

  // Função para definir valor no localStorage
  const setStoredValue = <T>(key: string, value: T): void => {
    try {
      if (typeof window === 'undefined') return;
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage [${key}]:`, error);
    }
  };

  // Função para remover valor do localStorage
  const removeStoredValue = (key: string): void => {
    try {
      if (typeof window === 'undefined') return;
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage [${key}]:`, error);
    }
  };

  // Função para limpar todo o localStorage
  const clearStorage = (): void => {
    try {
      if (typeof window === 'undefined') return;
      window.localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  };

  return {
    getStoredValue,
    setStoredValue,
    removeStoredValue,
    clearStorage
  };
}
