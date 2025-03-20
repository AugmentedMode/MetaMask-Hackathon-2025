import { ApiResponse, GasAnalysis, GasByType, Transaction } from "../types";

const PERIOD_TO_SECONDS: Record<string, number> = {
    day: 86_400,
    week: 604_800,
    month: 2_592_000,
    quarter: 7_776_000
  };

  
export const formatTransactionData = (transactionsData: any[], period: string) : Transaction[] => {
    const now = Math.floor(Date.now() / 1000);
    const periodInSeconds = PERIOD_TO_SECONDS[period] ?? -1;

    // this should go through all transactionsData list, and for each transaction 
    // make sure the object aligns with the Transaction interface
    return transactionsData
    .map((tx) => ({
      hash: tx.hash,
      type: tx.transactionType.toLowerCase(),
      timestamp: tx.timestamp,
      gas_fee_usd: tx.effectiveGasPrice * tx.gasPrice,
      chain: `chain_${tx.chainId}`,
      value_usd: tx.value ? parseFloat(tx.value) * 1e-18 : undefined,
      token: tx.transactionCategory === "TRANSFER" ? tx.readable : undefined,
      from_token: tx.transactionCategory === "SWAP" ? tx.valueTransfers?.[0]?.symbol : undefined,
      to_token: tx.transactionCategory === "SWAP" ? tx.valueTransfers?.[1]?.symbol : undefined,
      amount: tx.valueTransfers?.[0]?.amount ?? undefined,
      to_address: tx.to,
      from_address: tx.from,
      spender: tx.transactionCategory === "APPROVE" ? tx.to : undefined,
    }))
    // filter only transactions not older than periodInSeconds
    .filter((tx) => {
      const txTimestamp = Math.floor(new Date(tx.timestamp).getTime() / 1000);
      return now - txTimestamp <= periodInSeconds;
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