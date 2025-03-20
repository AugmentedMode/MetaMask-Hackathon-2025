import { GasAnalysis, GasByType, Transaction } from "../types";

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