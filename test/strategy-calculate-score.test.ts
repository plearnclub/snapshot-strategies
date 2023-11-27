import { transformResults } from '../src/strategies/plearn';
import { BigNumber } from '@ethersproject/bignumber';
import { formatUnits } from '@ethersproject/units';

describe('transformResults', () => {
  it('should correctly aggregate balances from different pools for each address', () => {
    // Mock data
    const resultsArray = [
      { amount: BigNumber.from('100000000000000000000') }, // Address 1, Pool 1
      { amount: BigNumber.from('200000000000000000000') }, // Address 2, Pool 1
      { amount: BigNumber.from('400000000000000000000') }, // Address 1, Pool 2
      { amount: BigNumber.from('800000000000000000000') } // Address 2, Pool 2
    ];
    const addresses = ['0xAddress1', '0xAddress2'];

    // Act
    const scores = transformResults(resultsArray, addresses, (result) =>
      parseFloat(formatUnits(result.amount.toString(), 18))
    );

    // Assert
    expect(scores['0xAddress1']).toEqual(500); // 500 (Pool 1) + 150 (Pool 2)
    expect(scores['0xAddress2']).toEqual(1000); // 1000 (Pool 1) + 250 (Pool 2)
  });

  it('should return an empty object when resultsArray is empty', () => {
    // Mock data
    const resultsArray = [];
    const addresses = ['0xAddress1', '0xAddress2'];

    // Act
    const scores = transformResults(resultsArray, addresses, (result) =>
      parseFloat(formatUnits(result.amount.toString(), 18))
    );

    // Assert
    expect(scores).toEqual({});
  });
});
