import { transformResults } from '../src/strategies/plearn';
import { BigNumber } from '@ethersproject/bignumber';

describe('transformResults', () => {
  it('should correctly aggregate balances from different pools for each address', () => {
    // Mock data
    const resultsArray = [
      { amount: BigNumber.from('100000000000000000000') }, // Address 1, Pool 1
      { amount: BigNumber.from('200000000000000000000') }, // Address 2, Pool 1
      { amount: BigNumber.from('150000000000000000000') }, // Address 1, Pool 2
      { amount: BigNumber.from('250000000000000000000') } // Address 2, Pool 2
    ];
    const addresses = ['0xAddress1', '0xAddress2'];
    const balanceKey = 'amount';
    const decimals = 18;

    // Act
    const scores = transformResults(
      resultsArray,
      addresses,
      balanceKey,
      decimals
    );

    // Assert
    expect(scores['0xAddress1']).toEqual(250); // 100 (Pool 1) + 150 (Pool 2)
    expect(scores['0xAddress2']).toEqual(450); // 200 (Pool 1) + 250 (Pool 2)
  });

  it('should return an empty object when resultsArray is empty', () => {
    // Mock data
    const resultsArray = [];
    const addresses = ['0xAddress1', '0xAddress2'];
    const balanceKey = 'amount';
    const decimals = 18;

    // Act
    const scores = transformResults(
      resultsArray,
      addresses,
      balanceKey,
      decimals
    );

    // Assert
    expect(scores).toEqual({});
  });

  it('should correctly handle null and undefined values in resultsArray', () => {
    // Mock data
    const resultsArray = [
      { amount: null }, // Address 1, Pool 1
      { amount: undefined }, // Address 2, Pool 1
      { amount: BigNumber.from('150000000000000000000') }, // Address 1, Pool 2
      { amount: BigNumber.from('0') } // Address 2, Pool 2
    ];
    const addresses = ['0xAddress1', '0xAddress2'];
    const balanceKey = 'amount';
    const decimals = 18;

    // Act
    const scores = transformResults(
      resultsArray,
      addresses,
      balanceKey,
      decimals
    );

    // Assert
    expect(scores['0xAddress1']).toEqual(150); // Only the valid amount is considered
    expect(scores['0xAddress2']).toEqual(0); // Null and undefined values treated as zero
  });
});
