/* --- START OF FILE script.js --- */
document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("search-form");
  const signalForm = document.getElementById("signal-form");
  const loader = document.getElementById("loader");
  const loaderText = document.getElementById("loader-text");
  const resultsArea = document.getElementById("results-area");
  const resultsTitle = document.getElementById("results-title");
  const resultsHead = document.getElementById("results-head");
  const resultsBody = document.getElementById("results-body");

  // New element for the helper button
  const useResultsBtn = document.createElement("button");
  useResultsBtn.id = "use-results-btn";
  useResultsBtn.textContent = "↳ Use these URLs for Signal Check";
  resultsArea.parentNode.insertBefore(useResultsBtn, resultsArea.nextSibling);

  let currentLeadUrls = []; // Store URLs from the last search

  // --- Event Listeners ---
  searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    showLoader("Analyzing and scoring new leads...");
    try {
      const response = await fetch("/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          industry: document.getElementById("industry").value,
          location: document.getElementById("location").value,
        }),
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const leads = await response.json();
      currentLeadUrls = leads.map(lead => lead.url); // Save the URLs
      displayLeadScoringResults(leads);
    } catch (error) {
      displayError("An error occurred during lead scoring.");
      console.error("Error fetching leads:", error);
    }
  });

  signalForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    showLoader("Checking companies for growth signals...");
    try {
      const response = await fetch("/check_signals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_title: document.getElementById("job-title").value,
          urls: document.getElementById("company-urls").value,
        }),
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const signals = await response.json();
      displaySignalResults(signals);
    } catch (error) {
      displayError("An error occurred during signal monitoring.");
      console.error("Error fetching signals:", error);
    }
  });
  
  // Event listener for our new helper button
  useResultsBtn.addEventListener('click', () => {
    const companyUrlsTextarea = document.getElementById('company-urls');
    companyUrlsTextarea.value = currentLeadUrls.join('\n');
    companyUrlsTextarea.focus(); // Focus on the textarea for immediate use
  });

  // --- UI Helper Functions ---
  function showLoader(text) {
    loaderText.textContent = text;
    loader.style.display = "block";
    resultsArea.style.display = "none";
    useResultsBtn.style.display = "none";
  }

  function clearResults() {
    resultsHead.innerHTML = "";
    resultsBody.innerHTML = "";
  }

  function displayError(message) {
    loader.style.display = "none";
    resultsArea.style.display = "block";
    resultsTitle.textContent = "Error";
    resultsBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #ff6b6b;">${message} Please try again.</td></tr>`;
  }

  function displayLeadScoringResults(leads) {
    clearResults();
    loader.style.display = "none";
    resultsArea.style.display = "block";
    resultsTitle.textContent = "Lead Scoring Results";
    
    useResultsBtn.style.display = leads.length > 0 ? 'block' : 'none'; // Show the button only if there are results

    resultsHead.innerHTML = `
      <tr>
        <th>Rank</th><th>Rank Score</th><th>Company Name</th><th>URL</th>
        <th>Revenue (M)</th><th>Employees</th><th>BBB Rating</th>
      </tr>`;

    if (leads.length === 0) {
      resultsBody.innerHTML = `<tr><td colspan="7" style="text-align: center;">No leads found.</td></tr>`;
      return;
    }
    leads.forEach((lead, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${index + 1}</td>
        <td class="score">${lead.lead_score.toFixed(4)}</td>
        <td>${lead.name}</td>
        <td><a href="${lead.url}" target="_blank" rel="noopener noreferrer">${lead.url}</a></td>
        <td>${lead.revenue_mil > 0 ? "$" + lead.revenue_mil + "M" : "N/A"}</td>
        <td>${lead.employees}</td>
        <td>${lead.bbb_rating}</td>
      `;
      resultsBody.appendChild(row);
    });
  }

  function displaySignalResults(signals) {
    clearResults();
    loader.style.display = "none";
    resultsArea.style.display = "block";
    resultsTitle.textContent = "Signal Monitoring Results";
    
    useResultsBtn.style.display = 'none'; // Hide the helper button for signal results

    resultsHead.innerHTML = `
      <tr>
        <th class="th-url">Company URL</th>
        <th class="th-signal">Signal Detected?</th>
      </tr>`;

    if (signals.length === 0) {
      resultsBody.innerHTML = `<tr><td colspan="2" style="text-align: center;">No companies provided.</td></tr>`;
      return;
    }
    signals.forEach((signal) => {
      const row = document.createElement("tr");
      const signalClass = signal.signal_detected === "Yes" ? "signal-yes" : "signal-no";
      row.innerHTML = `
        <td><a href="${signal.url}" target="_blank" rel="noopener noreferrer">${signal.url}</a></td>
        <td class="${signalClass}">${signal.signal_detected}</td>
      `;
      resultsBody.appendChild(row);
    });
  }
});