
const page_data = document.getElementById("page_data")
chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    let url = tabs[0].url;
    // use `url` here inside the callback because it's asynchronous!
    page_data.querySelector('.current_url').textContent = url;
});
