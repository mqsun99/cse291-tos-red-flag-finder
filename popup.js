document.addEventListener("DOMContentLoaded", () => {
  const page_data = document.getElementById("page_data");
  let currentUrl;

  function setCurrentURL(url) {
    page_data.querySelector(".current_url").textContent = url;
  }

  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    currentUrl = tabs[0].url;
    console.log("Current URL:", currentUrl); // Print the current URL to the console
    setCurrentURL(currentUrl);
  });

  document.getElementById("analyze_tos").addEventListener("click", async () => {
    // Remove the previous summary element if it exists
    const oldSummaryElement = document.getElementById("summary");
    if (oldSummaryElement) {
      page_data.removeChild(oldSummaryElement);
    }

    const summary = await analyzeTOS(currentUrl);
    const summaryElement = document.createElement("p");
    summaryElement.id = "summary"; // Assign an ID to the summary element
    summaryElement.textContent = summary;
    page_data.appendChild(summaryElement);
  });

  async function chatGPTRequest(prompt) {
    const apiKey = "YOUR-API-KEY"; // Replace with your actual OpenAI API key

    const response = await fetch(
      "https://api.openai.com/v1/engines/davinci-codex/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          prompt: prompt,
          max_tokens: 50,
          n: 1,
          stop: null,
          temperature: 0.5,
        }),
      }
    );

    const data = await response.json();
    const summary = data.choices[0].text.trim();
    return summary;
  }

  // TODO
  async function analyzeTOS(url) {
    // const extractedTOSContent = extractTOS(url);
    const prompt = `Analyze the Terms of Service of this website: ${url}. List 5 key privacy rights that the website asks from the user in <8 words, starting each bullet point with a number (don't include anything besides the bullets in your response like "Sure, here are 5 key privacy rights...", just give the answer directly!):`;
    console.log("Prompt:", prompt);
    const summary = await chatGPTRequest(prompt);
    console.log("Summary:", summary);
    return summary;
  }
});
