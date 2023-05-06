import { isDomElementChild } from '../index';


describe('isDomElementChild', () => {
  const parent = { type: 'div', parentNode: { type: 'body' } };

  test('should return false for empty child', () => {
    expect(isDomElementChild(parent, {})).toBe(false);
  });

  test('should return false for null child', () => {
    expect(isDomElementChild(parent, null)).toBe(false);
    expect(isDomElementChild(parent, undefined)).toBe(false);
  });

  test('should return false for null parent', () => {
    expect(isDomElementChild(null, {})).toBe(false);
    expect(isDomElementChild()).toBe(false);
  });

  test('should return false', () => {
    expect(isDomElementChild(
      parent,
      { parentNode: { parentNode: { parentNode: null } } }
    )).toBe(false);
  });

  test('should return true', () => {
    expect(isDomElementChild(
      parent,
      { parentNode: { parentNode: { parentNode: parent } } }
    )).toBe(true);
  });
});