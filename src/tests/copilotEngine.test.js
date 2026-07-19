import { describe, it, expect } from 'vitest';
import { queryCopilot } from '../services/copilotEngine';

describe('Copilot Engine (Simulated RAG)', () => {
  it('should reply with network status for wifi queries', () => {
    const result = queryCopilot('How is the wifi connection?');
    expect(result.answer).toContain('WiFi mesh network');
    expect(result.citations).toContain('Mesh Status #M-88');
  });

  it('should reply with concessions status for food queries', () => {
    const result = queryCopilot('where can I get food?');
    expect(result.answer).toContain('Concession stands');
    expect(result.citations).toContain('Concessions Log #C-12');
  });

  it('should greet the user for hello queries', () => {
    const result = queryCopilot('hello');
    expect(result.answer).toContain('Decision Support Copilot');
  });

  it('should provide fallback information for unrelated queries', () => {
    const result = queryCopilot('who won the game?');
    expect(result.answer).toContain("couldn't find specific operational records");
    expect(result.citations.length).toBeGreaterThan(0);
  });
});
