interface WalletBalance {
    currency: string;
    amount: number;
  }
  interface FormattedWalletBalance {
    currency: string;
    amount: number;
    formatted: string;
  }
  
  interface Props extends BoxProps {
  
  }

  const WalletPage: React.FC<Props> = (props: Props) => {
    // Error 1/////
    // The "children" is destructured from "props" but never used
    const { children, ...rest } = props;
    // Error 1/////
    const balances = useWalletBalances();
    const prices = usePrices();
  
    // Error 2/////
    // - The 'Blockchain' use the 'any' type which is not type-safe
    // - This function could be replace with a constant lookup to avoid multiple comparisons
      const getPriority = (blockchain: any): number => {
        switch (blockchain) {
          case 'Osmosis':
            return 100
          case 'Ethereum':
            return 50
          case 'Arbitrum':
            return 30
          case 'Zilliqa':
            return 20
          case 'Neo':
            return 20
          default:
            return -99
        }
      }
    // Error 2/////

    // Error 3/////
    // - The 'lhsPriority' is undefined and likely a typo that should reference 'balancePriority'
    // - The 'prices' in dependency array are not used directly in the sorting/filtering logic, causing unnecessary re-computation
    const sortedBalances = useMemo(() => {
      return balances.filter((balance: WalletBalance) => {
            const balancePriority = getPriority(balance.blockchain);
            if (lhsPriority > -99) {
               if (balance.amount <= 0) {
                 return true;
               }
            }
            return false
          }).sort((lhs: WalletBalance, rhs: WalletBalance) => {
              const leftPriority = getPriority(lhs.blockchain);
            const rightPriority = getPriority(rhs.blockchain);
            if (leftPriority > rightPriority) {
              return -1;
            } else if (rightPriority > leftPriority) {
              return 1;
            }
      });
    }, [balances, prices]);
    // Error 3/////

    // Error 4/////
    // - This can be combined with the sortedBalances above
    const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
      return {
        ...balance,
        formatted: balance.amount.toFixed()
      }
    })
    // Error 4/////
  
    // Error 5////
    // - This rows should use the 'formattedBalances' above with the same type 'FormattedWalletBalance'
    const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow 
          className={classes.row}
          key={index}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      )
    })
   // Error 5////
    return (
      <div {...rest}>
        {rows}
      </div>
    )
  }