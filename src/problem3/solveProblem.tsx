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
    const { ...rest } = props;
    // Error 1/////
    const balances = useWalletBalances();
    const prices = usePrices();
  
    // Error 2/////
    // - The 'Blockchain' use the 'any' type which is not type-safe
    // - This function could be replace with a constant lookup to avoid multiple comparisons
    const priorityMap: Record<string, number> = {
        Osmosis: 100,
        Ethereum: 50,
        Arbitrum: 30,
        Zilliqa: 20,
        Neo: 20,
      };
    
      const getPriority = (blockchain: string): number => {
        return priorityMap[blockchain] ?? -99;
      };
    // Error 2/////

    // Error 3/////
    // - The 'lhsPriority' is undefined and likely a typo that should reference 'balancePriority'
    // - The 'prices' in dependency array are not used directly in the sorting/filtering logic, causing unnecessary re-computation
    const sortedBalances = useMemo(() => {
      return balances.filter((balance: WalletBalance) => {
            const balancePriority = getPriority(balance.blockchain);
            if (balancePriority > -99) {
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
      }).map((balance: WalletBalance) => { // Solve for Error 4
        const usdValue = prices[balance.currency] * balance.amount;
        return {
          ...balance,
          formatted: balance.amount.toFixed(2), // Assuming two decimal places are desired
          usdValue,
        };
      })
    }, [balances]);
    // Error 3/////

    // Error 4/////
    // - This can be combined with the sortedBalances above
    // const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    //   return {
    //     ...balance,
    //     formatted: balance.amount.toFixed()
    //   }
    // })
    // Error 4/////
  
    // Error 5////
    // - Still classes is undefined too
    const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow 
        //   className={classes.row}Ư
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