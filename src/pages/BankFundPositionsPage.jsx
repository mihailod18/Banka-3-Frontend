import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import { getBankInvestmentFundPositions } from "../services/BankProfitService.js";
import "./BankFundPositionsPage.css";

function formatRSD(amount) {
    return new Intl.NumberFormat("sr-RS", {
        style: "currency",
        currency: "RSD",
        minimumFractionDigits: 2,
    }).format(Number(amount) || 0);
}

function formatPercent(value) {
    return `${Number(value || 0).toFixed(2)}%`;
}

export default function BankFundPositionsPage() {
    const [positions, setPositions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function loadPositions() {
        setLoading(true);
        setError("");

        try {
            const data = await getBankInvestmentFundPositions();
            setPositions(Array.isArray(data) ? data : []);
        } catch {
            setError("Greška pri učitavanju pozicija banke u investicionim fondovima.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadPositions();
    }, []);

    const totals = useMemo(() => {
        return positions.reduce(
            (acc, item) => {
                acc.value += Number(item.positionValueRsd) || 0;
                acc.invested += Number(item.investedAmountRsd) || 0;
                acc.profit += Number(item.profitRsd) || 0;
                return acc;
            },
            { value: 0, invested: 0, profit: 0 }
        );
    }, [positions]);

    return (
        <div className="bank-funds-page">
            <Sidebar />

            <main className="bank-funds-wrapper">
                <section className="bank-funds-card">
                    <div className="bank-funds-header">
                        <div>
                            <p className="bank-funds-eyebrow">PROFIT BANKE</p>
                            <h1 className="bank-funds-title">Pozicije u investicionim fondovima</h1>
                            <p className="bank-funds-subtitle">
                                Pregled fondova u kojima banka ima udeo, sa procentom učešća i ostvarenim profitom.
                            </p>
                        </div>

                        <button
                            className="bank-funds-refresh-btn"
                            onClick={loadPositions}
                            disabled={loading}
                        >
                            {loading ? "Osvežavanje..." : "Osveži"}
                        </button>
                    </div>

                    <div className="bank-funds-summary">
                        <div className="bank-funds-summary-item">
                            <span className="bank-funds-summary-label">Ukupna vrednost pozicija</span>
                            <span className="bank-funds-summary-value">{formatRSD(totals.value)}</span>
                        </div>

                        <div className="bank-funds-summary-item">
                            <span className="bank-funds-summary-label">Ukupno uloženo</span>
                            <span className="bank-funds-summary-value">{formatRSD(totals.invested)}</span>
                        </div>

                        <div className="bank-funds-summary-item">
                            <span className="bank-funds-summary-label">Ukupan profit</span>
                            <span className={totals.profit >= 0 ? "bank-funds-profit" : "bank-funds-loss"}>
                                {formatRSD(totals.profit)}
                            </span>
                        </div>
                    </div>

                    {error && <p className="bank-funds-error">{error}</p>}

                    <div className="bank-funds-table-wrap">
                        <table className="bank-funds-table">
                            <thead>
                            <tr>
                                <th>Naziv fonda</th>
                                <th>Menadžer</th>
                                <th>Udeo banke</th>
                                <th>Vrednost udela</th>
                                <th>Uloženo</th>
                                <th>Profit</th>
                            </tr>
                            </thead>

                            <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="bank-funds-empty">Učitavanje...</td>
                                </tr>
                            ) : positions.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="bank-funds-empty">
                                        Banka trenutno nema pozicije u investicionim fondovima.
                                    </td>
                                </tr>
                            ) : (
                                positions.map((position) => {
                                    const profit = Number(position.profitRsd) || 0;

                                    return (
                                        <tr key={position.id}>
                                            <td className="bank-funds-name">{position.fundName}</td>
                                            <td className="bank-funds-muted">{position.managerName}</td>
                                            <td>
                                                    <span className="bank-funds-percent">
                                                        {formatPercent(position.ownershipPercent)}
                                                    </span>
                                            </td>
                                            <td className="bank-funds-amount">
                                                {formatRSD(position.positionValueRsd)}
                                            </td>
                                            <td className="bank-funds-muted">
                                                {formatRSD(position.investedAmountRsd)}
                                            </td>
                                            <td className={profit >= 0 ? "bank-funds-profit" : "bank-funds-loss"}>
                                                {formatRSD(profit)}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </div>
    );
}