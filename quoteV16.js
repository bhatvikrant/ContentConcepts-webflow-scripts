// @ts-check

const costMultipliersPerWord = {
  proofreading: {
    inr: 1.3,
    usd: 0.018,
  },
  "substantive-editing": {
    inr: 1.6,
    usd: 0.021,
  },
  "plagiarism-editing": {
    inr: 2.5,
    usd: 0.045,
  },
};

const daysMultiplier = [
  {
    minWords: 0,
    maxWords: 3000,
    days: 3,
  },
  {
    minWords: 3000,
    maxWords: 5000,
    days: 4,
  },
  {
    minWords: 5000,
    maxWords: Infinity,
    days: 5,
  },
];

// ------------------------------------- DOM NODES -------------------------------------------

// Word Count Input
const wordCountInputNode = document.getElementById("field-2");

// Service Radios
const proofreadingNode = document.getElementById("node");
const substantiveEditingNode = document.getElementById("node-2");
const plagiarismEditingNode = document.getElementById("node-3");

// Currency selectors
const inrNode = document.getElementById("inr-tab");
const usdNode = document.getElementById("usd-tab");

// ------------------------------------- Helper Functions -------------------------------------------
/**
 *
 * @param {Date} date - base Date
 * @param {number} days - days to add
 * @returns {Date}
 */
function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 *
 * @param {Date} inputDate
 * @returns {String}
 */
function formatDate(inputDate) {
  // const date = inputDate.getDate();
  // const month = inputDate.getMonth() + 1; // Months are zero based
  // const year = inputDate.getFullYear();

  // return `${date}/${month}/${year}`;

  return dayjs(inputDate).format("dddd, MMMM D, YYYY");
}

/**
 *
 * @param {String} string
 * @returns {String}
 */
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// ------------------------------------- Functions --------------------------------------------------

function preSelectCurrencyBasedOnTimezone() {
  if (Intl.DateTimeFormat().resolvedOptions().timeZone === "Asia/Calcutta") {
    inrNode?.classList.add("w--current");
    inrNode?.setAttribute("aria-selected", "true");

    usdNode?.classList.remove("w--current");
    usdNode?.setAttribute("aria-selected", "false");
  } else {
    usdNode?.classList.add("w--current");
    usdNode?.setAttribute("aria-selected", "true");

    inrNode?.classList.remove("w--current");
    inrNode?.setAttribute("aria-selected", "false");
  }
}

/**
 * Selected Values Type
 * @typedef {Object} SelectedValues
 * @property {number} enteredWordCount
 * @property {'proofreading' | 'substantive-editing' | 'plagiarism-editing' | null} serviceType
 * @property {'inr' | 'usd' | null} currency
 */

/**
 * @returns {SelectedValues}
 */
function getSelectedValues() {
  // Words Input
  const enteredWordCount = +document.getElementById("field-2").value;

  // Service Radios
  const proofreadingSelected = document.getElementById("node").checked;
  const substantiveEditingSelected = document.getElementById("node-2").checked;
  const plagiarismEditingSelected = document.getElementById("node-3").checked;

  // Currency selectors
  const inrSelected =
    document.getElementById("inr-tab").getAttribute("aria-selected") === "true";
  const usdSelected =
    document.getElementById("usd-tab").getAttribute("aria-selected") === "true";

  /**
   * @type {SelectedValues['serviceType']}
   */
  let serviceType = null;
  if (proofreadingSelected) {
    serviceType = "proofreading";
  } else if (substantiveEditingSelected) {
    serviceType = "substantive-editing";
  } else if (plagiarismEditingSelected) {
    serviceType = "plagiarism-editing";
  }

  /**
   * @type {SelectedValues['currency']}
   */
  let currency = null;
  if (inrSelected) {
    currency = "inr";
  } else if (usdSelected) {
    currency = "usd";
  }

  return {
    enteredWordCount,
    serviceType,
    currency,
  };
}

/**
 * Calculate Price and Date based on word count, service and currency
 * @param {SelectedValues} param0
 * @returns {void}
 */
function calculatePriceDateAndUpdateUI({
  enteredWordCount,
  serviceType,
  currency,
}) {
  if (enteredWordCount && serviceType && currency) {
    // DOM nodes
    // STEP 1
    const totalPriceINRNode = document.getElementById("total-price-inr");
    const totalPriceUSDNode = document.getElementById("total-price-usd");
    const estimatedDateINRNode = document.getElementById("estimated-date-inr");
    const estimatedDateUSDNode = document.getElementById("estimated-date-usd");
    // STEP 4
    const step4_totalWordCountNode = document.getElementById(
      "STEP4-total-word-count"
    );
    const step4_selectedServiceNode = document.getElementById(
      "STEP4-selected-service"
    );
    const step4_totalPriceNode = document.getElementById("STEP4-total-price");
    const step4_returnDateNode = document.getElementById("STEP4-return-date");
    const step4_rzpPaymentBtn = document.querySelector(
      "#rzp-submit-btn  script"
    );

    // Calculate
    const calculatedTotalPriceINR = (
      enteredWordCount * costMultipliersPerWord[serviceType]["inr"]
    ).toLocaleString();
    const calculatedTotalPriceUSD = (
      enteredWordCount * costMultipliersPerWord[serviceType]["usd"]
    ).toLocaleString();

    let calculatedReturnDate = "";
    for (let index = 0; index < daysMultiplier.length; index++) {
      const { minWords, maxWords, days } = daysMultiplier[index];
      if (enteredWordCount > minWords && enteredWordCount <= maxWords) {
        const expectedDateObject = addDays(new Date(), days);

        calculatedReturnDate = formatDate(expectedDateObject);
      }
    }

    // Update the DOM

    // STEPPER Step 1
    // INR
    totalPriceINRNode.innerText = `₹ ${calculatedTotalPriceINR}`;
    estimatedDateINRNode.innerText = calculatedReturnDate;

    // USD
    totalPriceUSDNode.innerText = `$ ${calculatedTotalPriceUSD}`;
    estimatedDateUSDNode.innerText = calculatedReturnDate;

    // STEPPER Step 4
    step4_totalWordCountNode.innerText = `Total word count - ${enteredWordCount}`;
    step4_selectedServiceNode.innerText = `Selected service - ${capitalizeFirstLetter(
      serviceType.split("-").join(" ")
    )}`;
    if (currency === "inr") {
      step4_totalPriceNode.innerText = `₹ ${calculatedTotalPriceINR}`;
    } else if (currency === "usd") {
      step4_totalPriceNode.innerText = `$ ${calculatedTotalPriceUSD}`;
    }
    step4_returnDateNode.innerText = calculatedReturnDate;

    if (currency === "inr") {
      // RZP payment btn
      step4_rzpPaymentBtn.setAttribute(
        "data-prefill.amount.amount",
        calculatedTotalPriceINR
      );
    }
  }
}

/**
 *
 * @param {Event} event
 */
function handleEvent(event) {
  const selectedValues = getSelectedValues();
  console.log(selectedValues);

  calculatePriceDateAndUpdateUI(selectedValues);
}

// ------------------------------------- MAIN CALLs --------------------------------------------

preSelectCurrencyBasedOnTimezone();

wordCountInputNode.addEventListener("input", handleEvent);

document
  .getElementById("next-step-btn")
  ?.addEventListener("click", handleEvent);

[
  proofreadingNode,
  substantiveEditingNode,
  plagiarismEditingNode,
  inrNode,
  usdNode,
].forEach((node) => {
  node?.addEventListener("click", handleEvent);
});
