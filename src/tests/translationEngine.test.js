import { describe, it, expect } from 'vitest';
import { translate, getDir, LANGUAGES } from '../services/translationEngine';

describe('Translation Engine', () => {
  it('should list supported languages', () => {
    expect(LANGUAGES).toBeDefined();
    expect(LANGUAGES.en).toBeDefined();
    expect(LANGUAGES.hi).toBeDefined();
  });

  it('should return original text for English (en)', () => {
    const text = 'Where is the nearest exit?';
    expect(translate(text, 'en')).toBe(text);
  });

  it('should return translated text for supported languages', () => {
    const text = 'Where is the nearest exit?';
    expect(translate(text, 'hi')).toBe('निकटतम निकास कहाँ है?');
    expect(translate(text, 'fr')).toBe('Où se trouve la sortie la plus proche?');
  });

  it('should fallback to original text for untranslated strings', () => {
    const text = 'This is a random sentence';
    expect(translate(text, 'hi')).toBe(text);
  });

  it('should determine correct text direction (LTR vs RTL)', () => {
    expect(getDir('en')).toBe('ltr');
    expect(getDir('hi')).toBe('ltr');
    expect(getDir('ur')).toBe('rtl');
    expect(getDir('ar')).toBe('rtl');
  });
});
