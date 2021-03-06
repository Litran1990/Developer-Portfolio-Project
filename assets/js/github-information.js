// Second we built the userInformationHTMML inserted in the first function
function userInformationHTML(user) {
    return `
            <h2>${user.name}
                <span class="small-name">
                    (@<a href="${user.html_url}" target="_blank">${user.login}</a>)
                </span>
            </h2>
            <div class="gh-content">
                <div class="gh-avatar">
                    <a href="${user.html_url}" target="_blank">
                        <img src="${user.avatar_url}" width="80" height="80" alt="${user.login}"/>
                    </a>
                </div>
                <p>Followers: ${user.followers} - Following: ${user.following} <br> Repos: ${user.public_repos}</p>
            </div>`;
}


// Finally, the third function is inserted in order to display the user repo data info
function repoInformationHTML(repos) {
    if(repos.length === 0) {
        return `<div class="clearfix repo-list">No Repos!</div>`;
    } 
    
    var listItemsHTML = repos.map(function(repos) {
        return `
            <li>
                <a href="${repos.html_url}" target="_blank">${repos.name}</a>
            </li>`;
    });
    
    return `<div class="clearfix repo-list">
                <p>
                    <strong>Repo List:</strong>
                </p>
                <ul>
                ${listItemsHTML.join("\n")}
                </ul>
            </div>`;
}

// First we built the fetchGitHubInformation function
function fetchGitHubInformation(event) {

    // Now, in order to have the repo-data div cleared after each search, we must perform the following action
    $("#gh-user-data").html("");
    $("#gh-repo-data").html("");
    
    var username = $("#gh-username").val();
    if (!username) {
        $("#gh-user-data").html(`<h2>Please enter a github username</h2>`);
        return;
    }

    // Loader in place
    $("#gh-user-data").html(`<div id="loader"><img src="assets/css/loader.gif" alt="loading..."></div>`);

    // Issue the promises
    $.when(
        $.getJSON(`https://api.github.com/users/${username}`),
        $.getJSON(`https://api.github.com/users/${username}/repos`)
    ).then(
            function(firstResponse, secondResponse) {
                var userData = firstResponse[0];
                var repoData = secondResponse[0];
                $("#gh-user-data").html(userInformationHTML(userData)),
                $("#gh-repo-data").html(repoInformationHTML(repoData));
            },
            function(errorResponse) {
                if (errorResponse.status === 404) {
                    $("#gh-user-data").html(`<h2>No info found for user ${username}</h2>`);
                } else if(errorResponse.status === 403) {
                    var resetTime = new Date(errorResponse.getResponseHeader('X-RateLimit-Reset')*1000); // In order for it to be readable it must be turned into a date object
                    $("#gh-user-data").html(`<h4>Too many requests, please wait until ${resetTime.toLocaleTimeString()}</h4>`);
                } else {
                    console.log(errorResponse);
                    $("#gh-user-data").html(`<h2>Error: ${errorResponse.responseJSON.message}</h2>`);
                }
            }
    );

}

// To have the Octocat profile displayed once the page is loaded
$(document).ready(fetchGitHubInformation);
