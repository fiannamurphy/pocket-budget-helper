// ========================================
// POCKET BUDGET HELPER
// ========================================


// ========================================
// 1. VARIABLES
// ========================================

let records = [];
let editingId = null;


// ========================================
// 2. GET HTML ELEMENTS
// ========================================

const form = document.querySelector("#record-form");

const typeInput =
  document.querySelector("#record-type");

const amountInput =
  document.querySelector("#amount");

const categoryInput =
  document.querySelector("#category");

const noteInput =
  document.querySelector("#note");

const recordList =
  document.querySelector("#record-list");

const totalIncomeElement =
  document.querySelector("#total-income");

const totalExpensesElement =
  document.querySelector("#total-expenses");

const balanceElement =
  document.querySelector("#balance");

const filterType =
  document.querySelector("#filter-type");

const sortRecords =
  document.querySelector("#sort-records");

const searchRecords =
  document.querySelector("#search-records");

const categorySummary =
  document.querySelector("#category-summary");


// ========================================
// 3. LOAD RECORDS FROM LOCAL STORAGE
// ========================================

function loadRecords() {

  const savedRecords =
    localStorage.getItem(
      "pocketBudgetRecords"
    );

  if (savedRecords) {

    records =
      JSON.parse(savedRecords);

  }

}


// ========================================
// 4. SAVE RECORDS TO LOCAL STORAGE
// ========================================

function saveRecords() {

  localStorage.setItem(
    "pocketBudgetRecords",
    JSON.stringify(records)
  );

}


// ========================================
// 5. ADD OR UPDATE RECORD
// ========================================

form.addEventListener(
  "submit",
  function(event) {

    event.preventDefault();


    // Stop if no category is selected

    if (categoryInput.value === "") {

      alert("Please select a category.");

      return;

    }


    // Stop if amount is invalid

    if (
      amountInput.value === "" ||
      Number(amountInput.value) <= 0
    ) {

      alert(
        "Please enter a valid amount."
      );

      return;

    }


    // If editing an existing record

    if (editingId !== null) {

      updateRecord();

      return;

    }


    // Create new record

    const record = {

      id: Date.now(),

      type:
        typeInput.value,

      amount:
        Number(amountInput.value),

      category:
        categoryInput.value,

      note:
        noteInput.value.trim(),

      createdAt:
        Date.now()

    };


    records.push(record);


    saveRecords();

    renderApp();

    form.reset();

  }
);


// ========================================
// 6. DISPLAY RECORDS
// ========================================

function renderRecords(
  recordsToDisplay
) {

  recordList.innerHTML = "";


  if (
    recordsToDisplay.length === 0
  ) {

    recordList.innerHTML =
      "<p>No records yet.</p>";

    return;

  }


  recordsToDisplay.forEach(
    function(record) {

      const recordElement =
        document.createElement("div");


      recordElement.classList.add(
        "record",
        record.type
      );


      const sign =
        record.type === "expense"
          ? "-"
          : "+";


      // Capitalize category name

      const categoryName =
        record.category
          .charAt(0)
          .toUpperCase() +
        record.category.slice(1);


      recordElement.innerHTML = `

        <div class="record-info">

          <strong>
            ${record.note || categoryName}
          </strong>

          <p>
            ${categoryName}
          </p>

        </div>


        <div class="record-details">

          <strong class="record-amount">

            ${sign}$${record.amount.toFixed(2)}

          </strong>


          <div class="record-actions">

            <button
              type="button"
              class="edit-button"
              data-id="${record.id}"
            >
              Edit
            </button>


            <button
              type="button"
              class="delete-button"
              data-id="${record.id}"
            >
              Delete
            </button>

          </div>

        </div>

      `;


      recordList.appendChild(
        recordElement
      );

    }
  );

}


// ========================================
// 7. CALCULATE TOTALS
// ========================================

function updateSummary() {

  const totalIncome =
    records
      .filter(
        function(record) {

          return (
            record.type ===
            "income"
          );

        }
      )
      .reduce(
        function(total, record) {

          return (
            total +
            record.amount
          );

        },
        0
      );


  const totalExpenses =
    records
      .filter(
        function(record) {

          return (
            record.type ===
            "expense"
          );

        }
      )
      .reduce(
        function(total, record) {

          return (
            total +
            record.amount
          );

        },
        0
      );


  const balance =
    totalIncome -
    totalExpenses;


  totalIncomeElement.textContent =
    "$" +
    totalIncome.toFixed(2);


  totalExpensesElement.textContent =
    "$" +
    totalExpenses.toFixed(2);


  balanceElement.textContent =
    "$" +
    balance.toFixed(2);

}


// ========================================
// 8. FILTER RECORDS
// ========================================

function getFilteredRecords() {

  const selectedType =
    filterType.value;


  if (
    selectedType === "all"
  ) {

    return [...records];

  }


  return records.filter(
    function(record) {

      return (
        record.type ===
        selectedType
      );

    }
  );

}


// ========================================
// 9. SEARCH RECORDS
// ========================================

function searchRecordList(
  recordsToSearch
) {

  const searchTerm =
    searchRecords.value
      .toLowerCase()
      .trim();


  if (!searchTerm) {

    return recordsToSearch;

  }


  return recordsToSearch.filter(
    function(record) {

      return (

        record.note
          .toLowerCase()
          .includes(searchTerm)

        ||

        record.category
          .toLowerCase()
          .includes(searchTerm)

        ||

        record.type
          .toLowerCase()
          .includes(searchTerm)

      );

    }
  );

}


// ========================================
// 10. SORT RECORDS
// ========================================

function sortRecordList(
  recordsToSort
) {

  const sortValue =
    sortRecords.value;


  const sorted =
    [...recordsToSort];


  // Newest record added

  if (
    sortValue === "newest"
  ) {

    sorted.sort(
      function(a, b) {

        return (
          b.createdAt -
          a.createdAt
        );

      }
    );

  }


  // Oldest record added

  if (
    sortValue === "oldest"
  ) {

    sorted.sort(
      function(a, b) {

        return (
          a.createdAt -
          b.createdAt
        );

      }
    );

  }


  // Highest amount first

  if (
    sortValue === "highest"
  ) {

    sorted.sort(
      function(a, b) {

        return (
          b.amount -
          a.amount
        );

      }
    );

  }


  // Lowest amount first

  if (
    sortValue === "lowest"
  ) {

    sorted.sort(
      function(a, b) {

        return (
          a.amount -
          b.amount
        );

      }
    );

  }


  return sorted;

}


// ========================================
// 11. COMBINE FILTER,
// SEARCH AND SORT
// ========================================

function getProcessedRecords() {

  let processed =
    getFilteredRecords();


  processed =
    searchRecordList(
      processed
    );


  processed =
    sortRecordList(
      processed
    );


  return processed;

}


// ========================================
// 12. SPENDING BY CATEGORY
// ========================================

function renderCategorySummary() {

  const totals = {};


  records.forEach(
    function(record) {

      // Only expenses count

      if (
        record.type !==
        "expense"
      ) {

        return;

      }


      if (
        !totals[
          record.category
        ]
      ) {

        totals[
          record.category
        ] = 0;

      }


      totals[
        record.category
      ] += record.amount;

    }
  );


  categorySummary.innerHTML =
    "";


  const categories =
    Object.entries(
      totals
    );


  if (
    categories.length === 0
  ) {

    categorySummary.innerHTML =
      "<p>No expenses yet.</p>";

    return;

  }


  categories.forEach(
    function(
      [category, amount]
    ) {

      const row =
        document.createElement(
          "div"
        );


      row.classList.add(
        "category-row"
      );


      const categoryName =
        category
          .charAt(0)
          .toUpperCase() +
        category.slice(1);


      row.innerHTML = `

        <span>
          ${categoryName}
        </span>

        <strong>
          $${amount.toFixed(2)}
        </strong>

      `;


      categorySummary
        .appendChild(row);

    }
  );

}


// ========================================
// 13. DELETE RECORD
// ========================================

function deleteRecord(id) {

  const confirmed =
    confirm(
      "Are you sure you want to delete this record?"
    );


  if (!confirmed) {

    return;

  }


  records =
    records.filter(
      function(record) {

        return (
          record.id !== id
        );

      }
    );


  saveRecords();

  renderApp();

}


// ========================================
// 14. EDIT RECORD
// ========================================

function editRecord(id) {

  const record =
    records.find(
      function(record) {

        return (
          record.id === id
        );

      }
    );


  if (!record) {

    return;

  }


  editingId = id;


  typeInput.value =
    record.type;


  amountInput.value =
    record.amount;


  categoryInput.value =
    record.category;


  noteInput.value =
    record.note;


  // Optional:
  // move user back to form

  form.scrollIntoView({
    behavior: "smooth"
  });

}


// ========================================
// 15. UPDATE RECORD
// ========================================

function updateRecord() {

  const record =
    records.find(
      function(record) {

        return (
          record.id ===
          editingId
        );

      }
    );


  if (!record) {

    return;

  }


  record.type =
    typeInput.value;


  record.amount =
    Number(
      amountInput.value
    );


  record.category =
    categoryInput.value;


  record.note =
    noteInput.value.trim();


  editingId = null;


  saveRecords();

  renderApp();

  form.reset();

}


// ========================================
// 16. EDIT AND DELETE BUTTONS
// ========================================

recordList.addEventListener(
  "click",
  function(event) {

    const id =
      Number(
        event.target.dataset.id
      );


    if (
      event.target.classList
        .contains(
          "edit-button"
        )
    ) {

      editRecord(id);

    }


    if (
      event.target.classList
        .contains(
          "delete-button"
        )
    ) {

      deleteRecord(id);

    }

  }
);


// ========================================
// 17. FILTER EVENT
// ========================================

filterType.addEventListener(
  "change",
  renderApp
);


// ========================================
// 18. SORT EVENT
// ========================================

sortRecords.addEventListener(
  "change",
  renderApp
);


// ========================================
// 19. SEARCH EVENT
// ========================================

searchRecords.addEventListener(
  "input",
  renderApp
);


// ========================================
// 20. MAIN RENDER FUNCTION
// ========================================

function renderApp() {

  const processedRecords =
    getProcessedRecords();


  renderRecords(
    processedRecords
  );


  updateSummary();


  renderCategorySummary();

}


// ========================================
// 21. START APPLICATION
// ========================================

loadRecords();

renderApp();