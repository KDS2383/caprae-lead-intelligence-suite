# AI-Powered Lead Intelligence Suite

### A Submission for the Caprae Capital Intern Interview Pre-Work

This project is a fully functional web application designed to solve two critical business problems: **lead prioritization** and **outreach timing**. It's a comprehensive suite that empowers a sales team with a decisive competitive advantage.

1.  **Lead Scoring Engine:** Instead of just scraping companies, this tool uses a Learning-to-Rank (LTR) machine learning model to analyze and rank real-world leads in real-time.
2.  **Growth Signal Monitor:** It then takes high-priority targets and checks them for active buying signals (like key job postings) to identify the perfect moment for outreach.

This dual-pronged solution directly addresses the core challenge of moving beyond data collection to providing actionable intelligence, embodying the Caprae philosophy of using technology to drive operational efficiency and growth.

---

### Live Demo

[](https://your-live-app-url.com)

*(**Action Item:** Create a GIF showing both the lead scoring and signal monitoring features. Upload it to [Imgur](https://imgur.com/upload) and replace the `YOUR_GIF_ID.gif` part of the URL.)*

---

### Key Features & Technical Architecture

The architecture is designed as a two-stage intelligence pipeline:

1.  **Stage 1: Lead Scoring & Prioritization**
    *   **Data Acquisition:** A user enters an `Industry` and `Location`. The backend queries the **Google Custom Search API** to retrieve a list of relevant company websites.
    *   **Concurrent Scraping:** A multi-threaded scraper using **BeautifulSoup** visits each URL to heuristically extract firmographic features (revenue, employees) from unstructured HTML.
    *   **LTR Inference:** The scraped data is fed into a pre-trained **XGBoost `XGBRanker` model**, which predicts a relevance score for each lead, providing a prioritized list.

2.  **Stage 2: Growth Signal Monitoring**
    *   **Targeted Check:** The user provides a list of high-priority company URLs (which can be populated from the results of Stage 1).
    *   **Robust Signal Detection:** The backend uses **Selenium** to automate a real browser, performing targeted searches on Google for job postings on platforms like LinkedIn. This provides a reliable "Yes/No" answer to whether a company is actively hiring for a key "trigger" role.

---

### Tech Stack

*   **Backend:** Python, Flask
*   **Machine Learning:** Scikit-learn, XGBoost, NumPy
*   **Web Scraping & Automation:** Requests, BeautifulSoup4, Selenium
*   **Data Acquisition:** Google Custom Search API
*   **Frontend:** HTML5, CSS3, JavaScript (Fetch API)

---

### Setup and Running the Application

Follow these steps to run the project locally.

#### 1. Prerequisites
- Python 3.9+
- Git
- Google Chrome (for Selenium)

#### 2. Clone the Repository
```bash
git clone https://github.com/KDS2383/caprae-lead-intelligence-suite.git
cd caprae-lead-intelligence-suite