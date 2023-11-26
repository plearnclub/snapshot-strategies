import { calculateScore } from '../src/strategies/plearn';

describe('calculateScore', () => {
  it('should return correct scores for given resultsDict and poolAddresses', () => {
    // Setup
    const resultsDict = {
      '0xAddress1': [
        { amount: '100000000000000000000' },
        { amount: '200000000000000000000' }
      ],
      '0xAddress2': [
        { amount: '150000000000000000000' },
        { amount: '250000000000000000000' }
      ]
    };
    const poolAddresses = [
      { address: '0xPool1', decimals: 18 },
      { address: '0xPool2', decimals: 18 }
    ];

    const balanceKey = 'amount'; // The key in result objects that holds the balance
    const decimals = poolAddresses.map((pool) => pool.decimals); // Extracting decimals from poolAddresses

    // Act
    const scores = calculateScore(
      resultsDict,
      poolAddresses,
      balanceKey,
      decimals
    );

    // Assert
    expect(scores['0xAddress1']).toEqual(300); // 100 + 200
    expect(scores['0xAddress2']).toEqual(400); // 150 + 250
  });

  it('should handle empty results correctly', () => {
    // Setup
    const resultsDict = {};
    const poolAddresses = [];

    const balanceKey = 'amount'; // The key in result objects that holds the balance
    const decimals = poolAddresses.map((pool) => 18); // Extracting decimals from poolAddresses

    // Act
    const scores = calculateScore(
      resultsDict,
      poolAddresses,
      balanceKey,
      decimals
    );

    // Assert
    expect(scores).toEqual({});
  });

  it('should handle null and undefined values in resultsDict', () => {
    // Setup
    const resultsDict = {
      '0xAddress1': [null, undefined],
      '0xAddress2': [{ amount: '150000000000000000000' }, null]
    };
    const poolAddresses = [
      { address: '0xPool1', decimals: 18 },
      { address: '0xPool2', decimals: 18 }
    ];

    const balanceKey = 'amount'; // The key in result objects that holds the balance
    const decimals = poolAddresses.map((pool) => pool.decimals); // Extracting decimals from poolAddresses

    // Act
    const scores = calculateScore(
      resultsDict,
      poolAddresses,
      balanceKey,
      decimals
    );

    // Assert
    expect(scores['0xAddress1']).toEqual(0);
    expect(scores['0xAddress2']).toEqual(150);
  });

  it('should handle zero balances correctly', () => {
    const resultsDict = {
      '0xAddress1': [{ amount: '0' }, { amount: '0' }]
    };
    const poolAddresses = [
      { address: '0xPool1', decimals: 18 },
      { address: '0xPool2', decimals: 18 }
    ];
    const scores = calculateScore(
      resultsDict,
      poolAddresses,
      'amount',
      poolAddresses.map((pool) => pool.decimals)
    );

    expect(scores['0xAddress1']).toEqual(0);
  });

  it('should handle multiple pools with different decimals', () => {
    const resultsDict = {
      '0xAddress1': [{ amount: '1000000000000000000' }, { amount: '2000000' }]
    };
    const poolAddresses = [
      { address: '0xPool1', decimals: 18 },
      { address: '0xPool2', decimals: 6 }
    ];
    const scores = calculateScore(
      resultsDict,
      poolAddresses,
      'amount',
      poolAddresses.map((pool) => pool.decimals)
    );

    expect(scores['0xAddress1']).toBeCloseTo(3); // 1 Ether + 2 of some other token
  });

  it('should handle very large numbers correctly', () => {
    const resultsDict = {
      '0xAddress1': [
        { amount: '1000000000000000000000000' },
        { amount: '2000000000000000000000000' }
      ]
    };
    const poolAddresses = [
      { address: '0xPool1', decimals: 18 },
      { address: '0xPool2', decimals: 18 }
    ];
    const scores = calculateScore(
      resultsDict,
      poolAddresses,
      'amount',
      poolAddresses.map((pool) => pool.decimals)
    );

    expect(scores['0xAddress1']).toBeCloseTo(3000000); // Large number handling
  });

  it('should handle edge cases like empty resultsDict or poolAddresses', () => {
    const resultsDict = {};
    const poolAddresses = [];
    const scores = calculateScore(
      resultsDict,
      poolAddresses,
      'amount',
      poolAddresses.map((pool) => 18)
    );

    expect(scores).toEqual({});
  });
});
