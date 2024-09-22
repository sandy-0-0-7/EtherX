// Variables for user input
const amountInput = document.getElementById('amount');
const yearsInput = document.getElementById('years');
const yearsSlider = document.getElementById('years-slider');
const interestInput = document.getElementById('interest');
const interestSlider = document.getElementById('interest-slider');
const repaymentInput = document.getElementById('repayment');
const repayBtn = document.getElementById('repay-btn');
const monthlyPaymentOutput = document.getElementById('monthly-payment');
const principalOutput = document.getElementById('principal');
const totalInterestOutput = document.getElementById('total-interest');
const totalPayableOutput = document.getElementById('total-payable');
const errorMessage = document.getElementById('error-message');
const transactionHistory = document.getElementById('transaction-history');

// Initialize chart
const ctx = document.getElementById('paymentBreakdownChart').getContext('2d');
const paymentChart = new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: ['Principal', 'Interest'],
    datasets: [{
      label: 'Payment Breakdown',
      data: [5000000, 6378756], // Initial sample data
      backgroundColor: ['#007bff', '#dc3545']
    }]
  }
});

// Calculate loan data and update values
function calculateLoan() {
  const principal = parseFloat(amountInput.value);
  const years = parseInt(yearsInput.value);
  const interestRate = parseFloat(interestInput.value) / 100;

  const monthlyInterest = interestRate / 12;
  const numberOfPayments = years * 12;

  const monthlyPayment = (principal * monthlyInterest) / (1 - Math.pow(1 + monthlyInterest, -numberOfPayments));
  const totalInterest = (monthlyPayment * numberOfPayments) - principal;
  const totalPayable = principal + totalInterest;

  // Update values
  monthlyPaymentOutput.textContent = `₹${monthlyPayment.toFixed(2)}`;
  principalOutput.textContent = `₹${principal.toLocaleString()}`;
  totalInterestOutput.textContent = `₹${totalInterest.toLocaleString()}`;
  totalPayableOutput.textContent = `₹${totalPayable.toLocaleString()}`;

  // Update chart
  paymentChart.data.datasets[0].data = [principal, totalInterest];
  paymentChart.update();
  
  return monthlyPayment; // Return the calculated monthly payment
}

// Prevent negative values
function preventNegativeValues(inputElement) {
  inputElement.addEventListener('input', () => {
    if (parseFloat(inputElement.value) < 0) {
      inputElement.value = 0;
    }
  });
}

// Apply the preventNegativeValues function to all input fields
preventNegativeValues(amountInput);
preventNegativeValues(interestInput);
preventNegativeValues(repaymentInput);

// Validation for number of years (1-40)
yearsInput.addEventListener('input', () => {
  if (yearsInput.value > 40) {
    errorMessage.textContent = 'Number of years cannot be greater than 40!';
    errorMessage.style.display = 'block';
    yearsInput.value = 40;  // Reset to maximum allowed value
  } else {
    errorMessage.style.display = 'none';
  }
});

// Handle repayment and add timestamp
function handleRepayment() {
  const repaymentAmount = parseFloat(repaymentInput.value);
  const monthlyPayment = calculateLoan(); // Get the current monthly payment

  if (repaymentAmount >= monthlyPayment || repaymentAmount == monthlyPayment) {
    const newPrincipal = parseFloat(amountInput.value) - repaymentAmount;
    amountInput.value = newPrincipal.toFixed(2);

    // Add timestamp and transaction to history
    const now = new Date();
    const timestamp = now.toLocaleString();  // Format: "MM/DD/YYYY, HH:MM:SS"
    const transaction = document.createElement('li');
    transaction.classList.add('list-group-item');
    transaction.textContent = `${timestamp} - Repayment of ₹${repaymentAmount.toLocaleString()} made.`;
    transactionHistory.appendChild(transaction);

    // Recalculate loan details
    calculateLoan();
    errorMessage.style.display = 'none'; // Clear any previous error message
  } else {
    errorMessage.textContent = `Repayment must be greater than or equal to monthly payment of ₹${monthlyPayment.toFixed(2)}!`;
    errorMessage.style.display = 'block';
  }
}

// Event listeners
amountInput.addEventListener('input', calculateLoan);
yearsInput.addEventListener('input', () => {
  yearsSlider.value = yearsInput.value;
  calculateLoan();
});
yearsSlider.addEventListener('input', () => {
  yearsInput.value = yearsSlider.value;
  calculateLoan();
});
interestInput.addEventListener('input', calculateLoan);
interestSlider.addEventListener('input', () => {
  interestInput.value = interestSlider.value;
  calculateLoan();
});
repayBtn.addEventListener('click', handleRepayment);

// Initial calculation
calculateLoan();
