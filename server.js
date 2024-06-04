// server.js
const express = require('express');
const path = require('path');
const xlsx = require('xlsx');
const fs = require('fs');
const app = express();

app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.static('/Users/david/Desktop/KRED-Line non-cloud hosted')); // Serve static files

// Main route to serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'home_page.html'));
});

app.post('/submit-loan', (req, res) => {
    const { secretKey, collateralAsset, collateralAmount, loanAmount, loanDuration } = req.body;

    const wb = xlsx.utils.book_new(); // Create a new workbook
    const ws_data = [
        ["Secret Key", "Collateral Asset", "Collateral Amount", "Loan Amount", "Loan Duration"],
        [secretKey, collateralAsset, collateralAmount, loanAmount, loanDuration]
    ];
    const ws = xlsx.utils.aoa_to_sheet(ws_data); // Create a worksheet
    xlsx.utils.book_append_sheet(wb, ws, "Loan Request"); // Append worksheet to workbook

    const dirPath = path.join(__dirname, 'loan_sheets');
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
    }
    const filePath = path.join(dirPath, `loan_${Date.now()}.xlsx`);
    xlsx.writeFile(wb, filePath); // Write the workbook to a file

    res.send("Loan request submitted and saved!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
