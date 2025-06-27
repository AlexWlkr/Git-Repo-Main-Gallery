// Select the overview div where the profile info will appear
const overview = document.querySelector(".overview");

// Store your GitHub username
const username = "AlexWlkr";

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
}

// Call the fetch function when the page loads
getUserInfo();