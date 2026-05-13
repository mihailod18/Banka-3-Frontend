export async function getBankInvestmentFundPositions() {
    // MOCK za sada
    return [
        {
            id: 1,
            fundName: "Alpha Growth Fund",
            managerName: "Marko Petrović",
            ownershipPercent: 12.5,
            positionValueRsd: 3250000,
            investedAmountRsd: 2800000,
            profitRsd: 450000,
        },
        {
            id: 2,
            fundName: "Banka Stability Fund",
            managerName: "Jelena Marković",
            ownershipPercent: 8.75,
            positionValueRsd: 1750000,
            investedAmountRsd: 1900000,
            profitRsd: -150000,
        },
        {
            id: 3,
            fundName: "Tech Index Fund",
            managerName: "Nikola Jovanović",
            ownershipPercent: 21.3,
            positionValueRsd: 6420000,
            investedAmountRsd: 5100000,
            profitRsd: 1320000,
        },
    ];
}