import { useState } from "react";
import styles from "./squareFeeCalculator.module.scss";

const SquareFeeCalculator = () => {
    const [orderTotal, setOrderTotal] = useState("");
    const [feePercentage, setFeePercentage] = useState(2.9);
    const [fixedFee, setFixedFee] = useState(0.30);
    const [taxPercentage, setTaxPercentage] = useState(6.625);
    const [calculatedFee, setCalculatedFee] = useState(null);
    const [totalToCharge, setTotalToCharge] = useState(null);

    const calculateSquareTotal = (orderTotal, feePercentage, fixedFee, taxPercentage) => {
        const feeRate = feePercentage / 100;
        const taxRate = taxPercentage / 100;

        // Apply tax
        const totalWithTax = orderTotal * (1 + taxRate);
        // Calculate total with Square fees
        const finalCharge = (totalWithTax + fixedFee) / (1 - feeRate);
        // Calculate the Square fee amount
        const squareFee = finalCharge - totalWithTax;

        return { squareFee: squareFee.toFixed(2), totalCharge: finalCharge.toFixed(2), fee: calculateFees(orderTotal, feeRate, taxRate)  };
    };

    const calculateFees = (orderTotal, feeRate, taxRate) => {
        const percentageFee = feeRate; // 2.9%
        const fixedFee = taxRate;       // Flat $0.30 fee
    
        // Calculate the correct amount to charge so the fee is covered
        const totalWithFees = (orderTotal + fixedFee) / (1 - percentageFee);
    
        // Extract only the fee
        const processingFee = totalWithFees - orderTotal;
    
        // Round to match Square's behavior
        return Math.round(processingFee * 100) / 100;
    };    

    const handleCalculate = () => {
        if (!orderTotal || isNaN(orderTotal) || orderTotal <= 0) {
            setCalculatedFee("Invalid amount");
            setTotalToCharge(null);
            return;
        }
        const { squareFee, totalCharge, fee } = calculateSquareTotal(
            parseFloat(orderTotal),
            parseFloat(feePercentage),
            parseFloat(fixedFee),
            parseFloat(taxPercentage)
        );
        setCalculatedFee(squareFee);
        setTotalToCharge(totalCharge);
        console.log("fee:", fee)
    };

    return (
        <div className={styles.calculator}>
            <h3>Square Fee Calculator</h3>

            <label>Order Total ($)</label>
            <input
                type="text"
                placeholder="Enter order total"
                value={orderTotal}
                onChange={(e) => setOrderTotal(e.target.value)}
                className={styles.input}
            />

            <label>Square Fee (%)</label>
            <input
                type="text"
                placeholder="Fee percentage"
                value={feePercentage}
                onChange={(e) => setFeePercentage(e.target.value)}
                className={styles.input}
            />

            <label>Fixed Fee ($)</label>
            <input
                type="text"
                placeholder="Fixed fee"
                value={fixedFee}
                onChange={(e) => setFixedFee(e.target.value)}
                className={styles.input}
            />

            <label>Tax Percentage (%)</label>
            <input
                type="text"
                placeholder="Tax percentage"
                value={taxPercentage}
                onChange={(e) => setTaxPercentage(e.target.value)}
                className={styles.input}
            />

            <button onClick={handleCalculate} className={styles.button}>
                Calculate
            </button>

            {calculatedFee !== null && totalToCharge !== null && (
                <div className={styles.result}>
                    <p><strong>Square Fee:</strong> ${calculatedFee}</p>
                    <p><strong>Total to Charge:</strong> ${totalToCharge}</p>
                </div>
            )}
        </div>
    );
};

export default SquareFeeCalculator;
