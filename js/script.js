const backToGallery = document.querySelector(".view-repos");
const filterInput = document.querySelector(".filter-repos");
// Select the repos list
const repoList = document.querySelector(".repo-list");

// Select the overview div where the profile info will appear
const overview = document.querySelector(".overview");

// Store your GitHub username
const username = "AlexWlkr";
const repoSection = document.querySelector(".repos");
const repoData = document.querySelector(".repo-data");
// Async function to fetch GitHub profile info
async function getUserInfo() {
  const res = await fetch(`https://api.github.com/users/${username}`);
  const data = await res.json();
  console.log(data); // This will log your GitHub profile data
  displayUserInfo(data); // Call the function to display info on the page
}

// Function to display fetched user info on the page
function displayUserInfo(data) {
  const userDiv = document.createElement("div");
  userDiv.classList.add("user-info");

  userDiv.innerHTML = `
    <figure>
      <img alt="user avatar" src="${data.avatar_url}" />
    </figure>
    <div>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Bio:</strong> ${data.bio}</p>
      <p><strong>Location:</strong> ${data.location}</p>
      <p><strong>Number of public repos:</strong> ${data.public_repos}</p>
    </div>
  `;

  overview.appendChild(userDiv);

  // place to fetch repos AFTER profile shows
  getRepos();
}

// Async function to fetch GitHub repos
async function getRepos() {
  const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
  const repoData = await res.json();
  console.log(repoData); // Check to make sure it's working

  displayRepos(repoData); // Call the display function (defined next)
}

// Function to display each repo
function displayRepos(repos) {
  repoList.innerHTML = ""; // Optional cleanup to prevent duplicates
  filterInput.classList.remove("hide");
  repoSection.classList.remove("hide");

  for (const repo of repos) {
    const li = document.createElement("li");
    li.classList.add("repo");
    li.innerHTML = `<h3>${repo.name}</h3>`;
    repoList.appendChild(li);
  }
}

//  Call the initial profile fetch when the page loads
getUserInfo();
repoList.addEventListener("click", function (e) {
  if (e.target.matches("h3")) {
    const repoName = e.target.innerText;
    console.log(repoName); 
    getSpecificRepo(repoName); 
  }
});

async function getSpecificRepo(repoName) {
  const res = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
  const repoInfo = await res.json();
  console.log("Repo info:", repoInfo);

  //   grab the langages using a nother fetch
  const fetchLanguages = await fetch(repoInfo.languages_url);
  const languageData = await fetchLanguages.json();
  console.log("Language data:", languageData);

  //  Convert the object of languages into an array
  const languages = [];
  for (const language in languageData) {
    languages.push(language);
  }

  // is it working?
  console.log("Languages array:", languages);

  // Show the repo info on the page
  displaySpecificRepo(repoInfo, languages);
  backToGallery.classList.remove("hide");
}
function displaySpecificRepo(repoInfo, languages) {
  // Clear old info
  repoData.innerHTML = "";
  
  const div = document.createElement("div");
  div.innerHTML = `
    <h3>Name: ${repoInfo.name}</h3>
    <p>Description: ${repoInfo.description || "No description provided"}</p>
    <p>Default Branch: ${repoInfo.default_branch}</p>
    <p>Languages: ${languages.join(", ")}</p>
    <a class="visit" href="${repoInfo.html_url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>
  `;

  repoData.appendChild(div);

  // Show the repo detail section, hide the repo list
  repoData.classList.remove("hide");
  repoSection.classList.add("hide");
}

backToGallery.addEventListener("click", function () {
  repoSection.classList.remove("hide"); // show list of repos
  repoData.classList.add("hide");       // hide the individual repo view
  backToGallery.classList.add("hide");  // hide the back button
});

filterInput.addEventListener("input", function (e) {
  const searchText = e.target.value.toLowerCase();
  const repos = document.querySelectorAll(".repo");

  for (const repo of repos) {
    const repoText = repo.innerText.toLowerCase();
    if (repoText.includes(searchText)) {
      repo.classList.remove("hide");
    } else {
      repo.classList.add("hide");
    }
  }
});