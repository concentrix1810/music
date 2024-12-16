let lastActiveCell = null; // Declare lastActiveCell outside to retain its state

function copyText(value, cell) {
  // Kiểm tra chỉ số cột để không sao chép ở các cột 0, 1, 5, 12
  const excludedColumns = [0, 1, 5, 12];
  const columnIndex = cell.cellIndex;

  // Nếu ô hiện tại là 1 trong những ô không cho phép sao chép, thì không thay đổi con trỏ và return
  if (excludedColumns.includes(columnIndex)) {
    cell.classList.remove("copyable-cell"); // Bỏ lớp copyable-cell nếu có
    cell.classList.add("non-copyable-cell"); // Thêm lớp non-copyable-cell
    return;
  }

  // Tách phần tiếng Anh (trước dấu ngoặc vuông) từ giá trị
  const englishText = value.replace(/\s*\[.*?\]$/, "").trim();

  // Xử lý việc gỡ và thêm lớp active cho ô
  if (lastActiveCell) {
    lastActiveCell.classList.remove("active-cell"); // Gỡ lớp active khỏi ô trước đó
  }

  cell.classList.add("active-cell"); // Thêm lớp active cho ô hiện tại
  lastActiveCell = cell; // Cập nhật ô cuối cùng được chọn

  // Tạo textarea để sao chép nội dung
  const textArea = document.createElement("textarea");
  textArea.value = englishText; // Chỉ đặt nội dung tiếng Anh
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("copy");
  document.body.removeChild(textArea);

  // Hiển thị thông báo Toast
  Toastify({
    text: "Copied: " + englishText,
    duration: 1000,
    close: false,
    gravity: "bottom",
    position: "right",
    backgroundColor: "rgb(0, 128, 74)",
    className: "custom-toast",
    stopOnFocus: true,
  }).showToast();

  // Đảm bảo con trỏ chuột kiểu pointer khi sao chép được phép
  cell.classList.remove("non-copyable-cell");
  cell.classList.add("copyable-cell");
}

// Đảm bảo áp dụng đúng lớp cho các ô khi trang được tải
document.querySelectorAll("td").forEach((cell) => {
  const excludedColumns = [0, 1, 5, 12];
  if (excludedColumns.includes(cell.cellIndex)) {
    cell.classList.add("non-copyable-cell"); // Không cho phép sao chép, thêm lớp non-copyable-cell
  } else {
    cell.classList.add("copyable-cell"); // Cho phép sao chép, thêm lớp copyable-cell
  }
});

function loadDataFromSheet(sheetName) {
  const loadingSpinner = document.getElementById("loading");
  loadingSpinner.style.display = "block"; // Show loading spinner before data is fetched

  google.script.run
    .withSuccessHandler((data) => {
      loadingSpinner.style.display = "none"; // Hide loading spinner once data is loaded
      loadData(data); // Load and display the data in the table
    })
    .getData(sheetName); // Fetch data for the selected sheet
}

document.addEventListener("DOMContentLoaded", () => {
  const sheetTabsContainer = document.getElementById("sheet-tabs");

  // Kiểm tra nếu phần tử tồn tại
  if (!sheetTabsContainer) {
    console.error("Element with id 'sheet-tabs' not found.");
    return;
  }

  const sheetOptions = [
    "Topic GFM",
    "Topic Transport",
    "Topic GE",
    "Problem Encountered/Disposition",
    "P3-P5 GFM",
    "P3-P5 Non GFM",
  ];

  sheetOptions.forEach((sheet) => {
    const tab = document.createElement("button");
    tab.textContent = sheet;
    tab.value = sheet;
    tab.classList.add("sheet-tab");

    tab.addEventListener("click", () => {
      // Nếu tab đã active, không thực hiện gì
      if (tab.classList.contains("active-tab")) return;

      localStorage.setItem("selectedSheet", sheet);
      loadDataFromSheet(sheet);

      // Bỏ active trên các tab khác
      document
        .querySelectorAll(".sheet-tab")
        .forEach((t) => t.classList.remove("active-tab"));
      tab.classList.add("active-tab");
    });

    sheetTabsContainer.appendChild(tab);
  });

  const savedSelection = localStorage.getItem("selectedSheet");
  if (savedSelection) {
    loadDataFromSheet(savedSelection);
    const activeTab = document.querySelector(
      `.sheet-tab[value="${savedSelection}"]`
    );
    if (activeTab) activeTab.classList.add("active-tab");
  } else {
    const firstSheet = sheetOptions[0];
    loadDataFromSheet(firstSheet);
    document
      .querySelector(`.sheet-tab[value="${firstSheet}"]`)
      .classList.add("active-tab");
  }
});

function loadData(data) {
  const tableBody = document.getElementById("data-body");
  tableBody.innerHTML = ""; // Clear current table data
  // Loop through the data and populate the table and dropdown
  data.forEach((row) => {
    const tr = document.createElement("tr");
    row.forEach((cell, index) => {
      const td = document.createElement("td");
      td.innerText = cell;

      td.onclick = () => copyText(cell, td); // Add click event to copy cell value
      tr.appendChild(td);
    });
    tableBody.appendChild(tr);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const loadingSpinner = document.getElementById("loading");
  loadingSpinner.style.display = "block"; // Show loading spinner before data is fetched
  google.script.run.withSuccessHandler(loadData).getData();
});

function removeVietnameseTones(str) {
  const accents = [
    {
      base: "a",
      letters: [
        "á",
        "à",
        "ạ",
        "ả",
        "ã",
        "â",
        "ấ",
        "ầ",
        "ậ",
        "ẩ",
        "ẫ",
        "ă",
        "ắ",
        "ằ",
        "ặ",
        "ẳ",
        "ẵ",
      ],
    },
    {
      base: "e",
      letters: ["é", "è", "ẹ", "ẻ", "ẽ", "ê", "ế", "ề", "ệ", "ể", "ễ"],
    },
    { base: "i", letters: ["í", "ì", "ị", "ỉ", "ĩ"] },
    {
      base: "o",
      letters: [
        "ó",
        "ò",
        "ọ",
        "ỏ",
        "õ",
        "ô",
        "ố",
        "ồ",
        "ộ",
        "ổ",
        "ỗ",
        "ơ",
        "ớ",
        "ờ",
        "ợ",
        "ở",
        "ỡ",
      ],
    },
    {
      base: "u",
      letters: ["ú", "ù", "ụ", "ủ", "ũ", "ư", "ứ", "ừ", "ự", "ử", "ữ"],
    },
    { base: "y", letters: ["ý", "ỳ", "ỵ", "ỷ", "ỹ"] },
    { base: "d", letters: ["đ"] },
  ];

  accents.forEach((accent) => {
    accent.letters.forEach((letter) => {
      str = str.replace(new RegExp(letter, "g"), accent.base);
    });
  });

  return str;
}

let debounceTimeout; // Declare debounceTimeout globally

function filterTable() {
  const searchInput = document.getElementById("search-input");
  const clearIcon = document.querySelector(".clear-icon"); // Get the clear icon (X) element
  const loadingIcon = document.querySelector(".loading-icon"); // Get the loading spinner icon
  // const loadingIconCenter = document.getElementById("loading");

  // Show the loading icon (spinner)
  loadingIcon.style.display = "inline-block";
  // loadingIconCenter.style.display = "inline-block";
  clearIcon.style.display = "none"; // Hide the clear icon initially

  // Clear previous timeout if it's still running
  if (debounceTimeout) {
    clearTimeout(debounceTimeout);
  }

  // Use debounce to delay the filter operation by 1 second after the user stops typing
  debounceTimeout = setTimeout(() => {
    const filterText = removeVietnameseTones(
      searchInput.value.toLowerCase().trim()
    ); // Get the filter text (trimmed)
    const rows = document.querySelectorAll("#data-body tr");

    let topDispositionResults = [];

    // Reset all rows visibility before applying filter
    rows.forEach((row) => {
      row.style.display = ""; // Make sure all rows are visible before applying filter
    });

    rows.forEach((row) => {
      // Get the cell values and convert them to lowercase for case-insensitive comparison
      const topDisposition = removeVietnameseTones(
        normalizeText(row.cells[0].innerText)
      );
      const diengiai = removeVietnameseTones(
        normalizeText(row.cells[1].innerText)
      );
      const problemL1 = removeVietnameseTones(
        normalizeText(row.cells[2].innerText)
      );
      const problemL2 = removeVietnameseTones(
        normalizeText(row.cells[3].innerText)
      );
      const problemL3 = removeVietnameseTones(
        normalizeText(row.cells[4].innerText)
      );
      const rootcaseL1 = removeVietnameseTones(
        normalizeText(row.cells[9].innerText)
      );
      const rootcaseL2 = removeVietnameseTones(
        normalizeText(row.cells[10].innerText)
      );
      const rootcaseL3 = removeVietnameseTones(
        normalizeText(row.cells[11].innerText)
      );
      const remark = removeVietnameseTones(
        normalizeText(row.cells[5].innerText)
      );
      const additionalField = removeVietnameseTones(
        normalizeText(row.cells[12].innerText)
      );

      // Check if the filter text matches any part of the cell content
      const matchesFilter =
        topDisposition.includes(filterText) ||
        diengiai.includes(filterText) ||
        problemL1.includes(filterText) ||
        problemL2.includes(filterText) ||
        problemL3.includes(filterText) ||
        rootcaseL1.includes(filterText) ||
        rootcaseL2.includes(filterText) ||
        rootcaseL3.includes(filterText) ||
        remark.includes(filterText) ||
        additionalField.includes(filterText);

      // If the filter matches the top disposition, store it for later display
      if (topDisposition.includes(filterText)) {
        topDispositionResults.push(topDisposition);
      }

      // Show or hide rows based on whether they match the filter text
      row.style.display = matchesFilter ? "" : "none";
    });

    // Hide loading icon and show the clear icon after search
    loadingIcon.style.display = "none";
    // loadingIconCenter.style.display = "none";
    clearIcon.style.display = "inline-block"; // Show the clear icon after search is done

    // Display the search results (e.g., in a separate results list)
    displaySearchResults(topDispositionResults);

    // Toggle clear icon visibility based on input
    toggleClearIcon(filterText);
  }, 1000); // 1-second debounce delay
}

// Helper function to normalize text (remove line breaks, extra spaces, etc.)
function normalizeText(text) {
  return text.replace(/\s+/g, " ").toLowerCase().trim(); // Replace multiple spaces/newlines with a single space
}

function displaySearchResults(results) {
  const historyContainer = document.getElementById("history-list");
  historyContainer.innerHTML = ""; // Clear previous search results

  results = [...new Set(results)]; // Remove duplicates

  // Loop through the search results and add them to the history container
  results.forEach((item) => {
    const div = document.createElement("div");
    div.className = "history-item";
    div.textContent = item; // Display the original search term (with accents)

    div.onclick = () => {
      document.getElementById("search-input").value = item; // Set the selected history item in the input
      filterTable(); // Re-filter the table with the selected history term
      saveToHistory(item); // Re-save to history if clicked
      historyContainer.style.display = "none"; // Hide history dropdown
    };

    historyContainer.appendChild(div); // Add the history item to the container
  });

  // Show history container if there are results, else hide it
  historyContainer.style.display = results.length > 0 ? "block" : "none";
}

function saveToHistory(query) {
  let history = JSON.parse(localStorage.getItem("searchHistory")) || [];

  // If the query is not already in history, add it
  if (!history.includes(query)) {
    // Add the new query to the front of the array
    history.unshift(query);

    // If the history exceeds 10 items, remove the last one
    if (history.length > 20) {
      history.pop();
    }

    // Save the updated history back to localStorage
    localStorage.setItem("searchHistory", JSON.stringify(history));
  }
}

function renderHistory() {
  const historyContainer = document.getElementById("history-list");
  historyContainer.innerHTML = "";
  const history = JSON.parse(localStorage.getItem("searchHistory")) || [];

  history.forEach((item) => {
    const div = document.createElement("div");
    div.className = "history-item";
    div.textContent = item;
    div.onclick = () => {
      document.getElementById("search-input").value = item;
      filterTable();
      historyContainer.style.display = "none";
    };
    historyContainer.appendChild(div);
  });

  historyContainer.style.display = history.length > 0 ? "block" : "none";
}

function toggleClearIcon(filterText) {
  const clearIcon = document.querySelector(".clear-icon");
  clearIcon.style.display = filterText ? "block" : "none"; // Show icon if there's text
}

function clearSearch() {
  const searchInput = document.getElementById("search-input");
  searchInput.value = "";
  searchInput.focus(); // Focus back to input
  filterTable(); // Call filter to update results
}

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search-input");
  const historyContainer = document.getElementById("history-list");

  // When search input is focused, show history list if there are any previous searches
  searchInput.addEventListener("focus", () => {
    if (!searchInput.value) renderHistory();
    historyContainer.style.display = "block"; // Show history list
  });

  // When the input value changes, filter the table and update the history list
  searchInput.addEventListener("input", filterTable);

  // Toggle the clear icon visibility when typing in the search input
  toggleClearIcon(searchInput.value);

  // Close the history list when clicking outside of the input or history container
  document.addEventListener("click", (e) => {
    if (
      !searchInput.contains(e.target) &&
      !historyContainer.contains(e.target)
    ) {
      historyContainer.style.display = "none"; // Hide history list
    }
  });

  // Clear search input and history list when the clear icon is clicked
  document.querySelector(".clear-icon").addEventListener("click", clearSearch);

  // Handle pressing Enter key to select the first search history item
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const firstResult = historyContainer.querySelector(".history-item");
      if (firstResult) {
        firstResult.click(); // Trigger the click event on the first history item
      }
    }
  });
});
