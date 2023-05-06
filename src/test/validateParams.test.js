import { validateParams } from '../index';


describe('validateParams', () => {
  const falseTestCases = [
    [
      'for missing onBlur with default requirements',
      {},
      undefined,
      '`onBlur` is required'
    ],
    [
      'for incorrect onBlur with default requirements',
      { onBlur: 'onBlur' },
      undefined,
      '`onBlur` should be callback function'
    ],
    [
      'for incorrect NOT REQUIRED onBlur',
      { onBlur: 'onBlur' },
      { onBlur: false },
      '`onBlur` should be callback function'
    ],


    [
      'for missing checkInOutside',
      {},
      { checkInOutside: true },
      '`checkInOutside` is required'
    ],
    [
      'for incorrect checkInOutside',
      { checkInOutside: 'checkInOutside' },
      { checkInOutside: true },
      '`checkInOutside` should be function(node)'
    ],
    [
      'for incorrect NOT REQUIRED checkInOutside',
      { checkInOutside: 'checkInOutside' },
      { checkInOutside: false },
      '`checkInOutside` should be function(node)'
    ],


    [
      'for missing getRootNode',
      {},
      { getRootNode: true },
      '`getRootNode` is required'
    ],
    [
      'for incorrect getRootNode',
      { getRootNode: 'getRootNode' },
      { getRootNode: true },
      '`getRootNode` should be function(this)'
    ],
    [
      'for incorrect NOT REQUIRED getRootNode',
      { getRootNode: 'getRootNode' },
      { getRootNode: false },
      '`getRootNode` should be function(this)'
    ],
  ];

  const trueTestCases = [
    [
      'for correct onBlur with default requirements',
      { onBlur: () => null },
      undefined,
    ],

    [
      'for empty params without requirements',
      {},
      {},
    ],

    [
      'for correct checkInOutside',
      { checkInOutside: () => null },
      { checkInOutside: true },
    ],

    [
      'for correct getRootNode',
      { getRootNode: () => null },
      { getRootNode: true },
    ],


    [
      'for all correct params',
      { onBlur: () => null, checkInOutside: () => null, getRootNode: () => null },
      { getRootNode: true, checkInOutside: true, onBlur: true  },
      '`getRootNode` is required'
    ],
  ];

  beforeEach(() => {
    global.console.error = jest.fn();
  });

  test.each(falseTestCases)('should return false %s', (title, params, requirements, message) => {
    const result = validateParams(params, requirements);
    expect(result).toBe(false);
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenLastCalledWith(message);
  });

  test.each(trueTestCases)('should return true %s', (title, params, requirements) => {
    const result = validateParams(params, requirements);
    expect(result).toBe(true);
    expect(console.error).toHaveBeenCalledTimes(0);
  });
});