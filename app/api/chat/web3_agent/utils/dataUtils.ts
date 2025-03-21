import { AGENT_CONFIG } from "../config";
import { ApiResponse, GasAnalysis, GasByType, PricesAPIMarketData, SpotPriceResponse, Transaction } from "../types";

const PERIOD_TO_SECONDS: Record<string, number> = {
    day: 86_400,
    week: 604_800,
    month: 2_592_000,
    quarter: 7_776_000
  };

  async function fetchETHPrice() {
    const response = await fetch(
        `${AGENT_CONFIG.endpoints.prices}/1/spot-prices?includeMarketData=false&tokenAddresses=0x0000000000000000000000000000000000000000`,
    );
    const data : SpotPriceResponse = await response.json();

    if (response.status !== 200)
        throw new Error("Failed to fetch ETH price");

    const price = data['0x0000000000000000000000000000000000000000']["usd"];    
    return price;
  }


  export async function fetchAllTransactions(address: string, chainId: number = 1): Promise<Transaction[]> {
    const allTransactions: Transaction[] = [];
    let cursor: string | null = null;
    let hasNextPage = true;
  
    while (hasNextPage) {
      const url = new URL(`${AGENT_CONFIG.endpoints.transactions}/${address}/transactions`);
      url.searchParams.append('includeTxMetadata', 'true');
      url.searchParams.append('networks', chainId.toString());
      if (cursor) {
        url.searchParams.append('cursor', cursor); 
      }
  
      const response = await fetch(url.toString());
      const result: ApiResponse<Transaction[]> = await response.json();
  
      if (response.status !== 200) {
        throw new Error(response.statusText + ' - Failed to fetch transactions list');
      }
  
      if (result.data) {
        allTransactions.push(...result.data);
      }
  
      cursor = result.pageInfo?.cursor ?? result.pageInfo?.endcursor ?? null;
      hasNextPage = !!(result.pageInfo?.hasNextPage && cursor)
    }
  
    return allTransactions;
  }
  


 // TODO: 
 // find a way to dynamically compute timeframe so it can work with whatever period the user enters
 // check that the tx type is taken into consideration and show it in the analysis
export const formatTransactionData =  async (address: string, transactionsData: any[], period: string) : Promise<Transaction[]> => {
    const now = Math.floor(Date.now() / 1000);
    const periodInSeconds = PERIOD_TO_SECONDS[period] ?? -1;
    const ethPrice = await fetchETHPrice();

    // this should go through all transactionsData list, and for each transaction it will
    // make sure the object aligns with the Transaction interface
    return transactionsData
    .map((tx) => ({
      hash: tx.hash,
      type: tx.transactionType.toLowerCase(),
      timestamp: tx.timestamp,
      gas_fee_usd: tx.effectiveGasPrice * tx.gasUsed * ethPrice * 1e-18,
      chain: tx.chainId,
      value_usd: tx.value ? parseFloat(tx.value) * 1e-18 * ethPrice : undefined,
      token: tx.transactionCategory === "TRANSFER" ? tx.readable : undefined,
      from_token: tx.transactionCategory === "SWAP" ? tx.valueTransfers?.[0]?.symbol : undefined,
      to_token: tx.transactionCategory === "SWAP" ? tx.valueTransfers?.[1]?.symbol : undefined,
      amount: tx.valueTransfers?.[0]?.amount ?? undefined,
      to_address: tx.to as string,
      from_address: tx.from as string,
      spender: tx.transactionCategory === "APPROVE" ? tx.to : undefined,
    }))
    // filter only transactions not older than periodInSeconds and sent FROM the user
    .filter((tx) => {
      const txTimestamp = Math.floor(new Date(tx.timestamp).getTime() / 1000);
      return (now - txTimestamp <= periodInSeconds) && (tx.from_address.toLowerCase() === address.toLowerCase());
    });
};


export const analyzeGasFees = (transactionsList : Transaction[]) : GasAnalysis=> {
    if (transactionsList.length === 0)
        console.log("There were no transactions found in the given timeframe for analyzing the gas fees.");
    
    let total_gas_spent_usd = 0;
    let transaction_count = 0;
    let average_gas_per_tx_usd = 0;
    let highest_gas_tx : Transaction = {hash: "", gas_fee_usd: 0, timestamp: "", type: "", chain: ""};
    let gas_by_type : Record<string, GasByType> = {};

    for (const transaction of transactionsList){
        const gasFeeUsd = transaction.gas_fee_usd ?? 0;

        if (gasFeeUsd > (highest_gas_tx.gas_fee_usd ?? 0)){
            highest_gas_tx = transaction;
        }

        transaction_count += 1;
        total_gas_spent_usd += gasFeeUsd;

        if (!gas_by_type[transaction.type]) {
            gas_by_type[transaction.type] = { count: 0, total_usd: 0, average_usd: 0 };
        }

        gas_by_type[transaction.type].count += 1;
        gas_by_type[transaction.type].total_usd += gasFeeUsd;
    }

    if (transaction_count > 0)
        average_gas_per_tx_usd = total_gas_spent_usd / transaction_count;

    return {
        total_gas_spent_usd,
        transaction_count,
        average_gas_per_tx_usd,
        highest_gas_tx,
        gas_by_type
    };
};