import { consoleDebug } from '../index';

describe('consoleDebug', () => {
  beforeEach(() => {
    global.console.debug = jest.fn();
  });

  test('should call console.debug', () => {
    consoleDebug(10);
    consoleDebug(20, 99, 100);
    expect(console.debug.mock.calls.length).toBe(2);
    expect(console.debug.mock.calls[0][0]).toBe('react-onblur::');
    expect(console.debug.mock.calls[1][0]).toBe('react-onblur::');

    expect(console.debug.mock.calls[0][1]).toBe(10);
    expect(console.debug.mock.calls[1][1]).toBe(20);
    expect(console.debug.mock.calls[1][2]).toBe(99);
    expect(console.debug.mock.calls[1][3]).toBe(100);
  });
});
