const form = document.querySelector("form");
const input = document.querySelector("input");
const reposContainer = document.querySelector(".repos");
const mainContainer = document.querySelector(".main-container");

const API_URL = "https://api.github.com/users/";

async function getUserData(username) {
  try {
    const response = await fetch(`${API_URL}${username}`);
    if (!response.ok) throw new Error(response.statusText);

    const {
      avatar_url,
      bio,
      blog,
      company,
      followers,
      following,
      location,
      login,
      twitter_username,
    } = await response.json();

    const userHtml = `
      <div class="user-avatar" style="background-image: url(${avatar_url});"></div>
      <p class="user-name">${login}</p>
      <button class="follow">Follow</button>
      <p class="user-bio">${bio}</p>
      <div class="followers-info">
        <a href="#"><i class="fa-solid fa-person"></i> <span class="followers">${followers}</span> followers</a>
        <a href="#"><span class="following">${following}</span> following</a>
      </div>
      <div class="icon-container">
        <i class="fa-regular fa-building"></i> <a href="#">${company}</a>
      </div>
      <div class="icon-container">
        <i class="fa-sharp fa-solid fa-location-dot"></i> <a href="#">${location}</a>
      </div>
      <div class="icon-container">
        <i class="fa-regular fa-solid fa-link"></i> <a href="#">${blog}</a>
      </div>
      <div class="icon-container">
        <i class="fa-brands fa-twitter"></i> <a href="#">@${twitter_username}</a>
      </div>
    `;

    const userSection = document.createElement("section");
    userSection.classList.add("about-user");
    userSection.innerHTML = userHtml;
    mainContainer.prepend(userSection);
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
}

async function getUserRepos(username) {
  try {
    const response = await fetch(`${API_URL}${username}/subscriptions`);
    if (!response.ok) throw new Error(response.statusText);

    const repos = await response.json();

    repos.forEach(repo => {
      const { name, description, forks_count, language, watchers_count, git_url } = repo;
      const repoUrl = git_url.replace(/^git:/, 'http:').replace(/\.git$/, '');

      const repoHtml = `
        <div class="repo-card">
          <a href="${repoUrl}" class="repo-title">${name}</a>
          <p class="repo-subtitle">${description}</p>
          <div class="popularity">
            <p class="technology-used">${language}</p>
            <p class="stars"><i class="fa-regular fa-star"></i> ${watchers_count}</p>
            <img src="./git-fork_1.svg" alt="Fork icon" class="fork-svg">
            <span class="forked">${forks_count}</span>
          </div>
          <p class="pill">Public</p>
        </div>
      `;

      const repoElement = document.createElement("div");
      repoElement.innerHTML = repoHtml;
      reposContainer.appendChild(repoElement);
    });
  } catch (error) {
    console.error('Error fetching user repositories:', error);
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const username = input.value.trim();

  if (username) {
    mainContainer.innerHTML = '';
    reposContainer.innerHTML = '';
    try {
      await getUserData(username);
      await getUserRepos(username);
    } catch (error) {
      console.error('Error handling form submission:', error);
    }
    input.value = '';
  }
});

input.addEventListener("focus", () => location.reload());
