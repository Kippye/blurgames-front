import { describe, it, expect } from 'vitest';
import { toTitleCase, toCamelCase, toSeparateWords } from '../string-helpers';

describe('toTitleCase', () => {
  it('should convert "this is a TEST" to "This Is A Test"', () => {
    expect(toTitleCase('this is a TEST')).toBe('This Is A Test');
  });

  it('should handle empty string', () => {
    expect(toTitleCase('')).toBe('');
  });

  it('should handle single word', () => {
    expect(toTitleCase('hello')).toBe('Hello');
  });

  it('should handle already title case', () => {
    expect(toTitleCase('Hello World')).toBe('Hello World');
  });

  it('should handle all uppercase', () => {
    expect(toTitleCase('HELLO WORLD')).toBe('Hello World');
  });

  it('should handle all lowercase', () => {
    expect(toTitleCase('hello world')).toBe('Hello World');
  });

  it('should handle mixed case', () => {
    expect(toTitleCase('hELLo wOrLD')).toBe('Hello World');
  });
});

describe('toCamelCase', () => {
  it('should convert "Project Type" to "projectType"', () => {
    expect(toCamelCase('Project Type')).toBe('projectType');
  });

  it('should convert "THIS is a ProjectType" to "thisIsAProjecttype"', () => {
    expect(toCamelCase('THIS is a ProjectType')).toBe('thisIsAProjecttype');
  });

  it('should handle empty string', () => {
    expect(toCamelCase('')).toBe('');
  });

  it('should handle single word', () => {
    expect(toCamelCase('hello')).toBe('hello');
  });

  it('should handle already camelCase', () => {
    expect(toCamelCase('projectType')).toBe('projecttype');
  });

  it('should handle multiple spaces', () => {
    expect(toCamelCase('hello   world')).toBe('helloWorld');
  });

  it('should handle all uppercase', () => {
    expect(toCamelCase('HELLO WORLD')).toBe('helloWorld');
  });
});

describe('toSeparateWords', () => {
  it('should convert ProjectType to Project Type', () => {
    expect(toSeparateWords('ProjectType')).toBe('Project Type');
  });

  it('should convert thisIsATest to this Is A Test', () => {
    expect(toSeparateWords('thisIsATest')).toBe('this Is A Test');
  });

  it('should not change "thisisa test"', () => {
    expect(toSeparateWords('thisisa test')).toBe('thisisa test');
  });

  it('should handle empty string', () => {
    expect(toSeparateWords('')).toBe('');
  });

  it('should handle single word', () => {
    expect(toSeparateWords('hello')).toBe('hello');
  });

  it('should handle already separated words', () => {
    expect(toSeparateWords('Hello World')).toBe('Hello World');
  });

  it('should handle consecutive uppercase letters', () => {
    expect(toSeparateWords('XMLParser')).toBe('XML Parser');
  });
});
