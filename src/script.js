
const postTableBody = document.getElementById('post-table-body');

// Get the Instagram link query parameter from the URL
const urlParams = new URLSearchParams(window.location.search);
const instagramLink = urlParams.get('link');

// Display the Instagram link in the page
document.title = `Archive - ${instagramLink}`;

function saveInstagramLink() {
    var link = document.getElementById("instagram-link").value;
    if (link === "https://www.instagram.com/p/CrtQquuveOO/") {
        // display post 1 information
        var picture = "Frog3.jpg";
        var author = "frog_world_";
        var likes = "15,984";
        var comments = "16";
    } else if (link === "https://www.instagram.com/p/CrlAV_MMutO/") {
        // display post 2 information
        var picture = "Frog2.jpg";
        var author = "frog_world_";
        var likes = "18,417";
        var comments = "42";
    } else if (link === "https://www.instagram.com/p/CrgCUspvr_m/") {
        // display post 3 information
        var picture = "Frog1.jpg";
        var author = "frog_world_";
        var likes = "6,608";
        var comments = "10";
    } else {
        alert("Invalid Instagram Post Link");
        return;
    }

    var params = "?picture=" + encodeURIComponent(picture) +
        "&author=" + encodeURIComponent(author) +
        "&likes=" + encodeURIComponent(likes) +
        "&comments=" + encodeURIComponent(comments);
    window.location.href = "postsave.html" + params;
}

function getSavedInstagramLink() {
    return localStorage.getItem("instagram-link");
}
function openArchivePage() {
    const archiveURL = "Archive.html";
    window.open(archiveURL, "_blank");
}

function getPostSaveData() {
    const searchParams = new URLSearchParams(window.location.search);
    const picture = searchParams.get('picture') || '';
    const author = searchParams.get('author') || '';
    const likes = searchParams.get('likes') || '';
    const comments = searchParams.get('comments') || '';
    const tagsInput = document.getElementById("tags");
    console.log(tagsInput); // Check if element is correctly selected
    console.log(tagsInput.value); // Check the value of the input

    const archiverInput = document.getElementById("archiver-name");
    return {
        picture,
        author,
        likes,
        comments,
        tags: tagsInput.value,
        archiver: archiverInput.value,
    };
}

function savePostData(data) {
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    const index = posts.length + 1; // get the index for the new post
    const existingPostIndex = posts.findIndex((post) => post.index === index); // check if post with same index already exists

    if (existingPostIndex >= 0) {
        // if post with same index already exists, replace it with the new post
        posts[existingPostIndex] = {...data, index};
    } else {
        // otherwise, add the new post to the end of the list
        posts.push({...data, index});
    }
    localStorage.setItem("posts", JSON.stringify(posts));
}
function displaySavedPosts() {
    const savedPosts = JSON.parse(localStorage.getItem("posts")) || [];

    const postTableBody = document.getElementById("post-table-body");
    postTableBody.innerHTML = "";

    savedPosts.forEach((post) => {
        const row = document.createElement("tr");

        const previewCell = document.createElement("td");
        const previewImg = document.createElement("img");
        previewImg.src = post.picture;
        previewImg.alt = "Post preview";
        previewImg.classList.add("post-preview");
        previewCell.appendChild(previewImg);
        row.appendChild(previewCell);

        const authorCell = document.createElement("td");
        authorCell.innerText = post.author;
        row.appendChild(authorCell);

        const likesCell = document.createElement("td");
        likesCell.innerText = post.likes;
        row.appendChild(likesCell);

        const commentsCell = document.createElement("td");
        commentsCell.innerText = post.comments;
        row.appendChild(commentsCell);

        const tagsCell = document.createElement("td");
        console.log(post.tags); // check if tags are being correctly retrieved
        tagsCell.innerText = post.tags.split(",").map((tag) => tag.trim()).join(", ");
        row.appendChild(tagsCell);

        const archiverCell = document.createElement("td");
        archiverCell.innerText = post.archiver;
        row.appendChild(archiverCell);

        postTableBody.appendChild(row);
    });
}
function loadPostData() {
    const urlParams = new URLSearchParams(window.location.search);
    const link = urlParams.get('link');
    const savedLink = getSavedInstagramLink();

    if (link) {
        document.getElementById("instagram-link").value = link;
        saveInstagramLink();
    } else if (savedLink) {
        document.getElementById("instagram-link").value = savedLink;
        saveInstagramLink();
    }

    const postPreview = document.getElementById("post-preview");
    const postLikes = document.getElementById("post-likes");
    const postComments = document.getElementById("post-comments");

    const picture = urlParams.get('picture');
    const author = urlParams.get('author');
    const likes = urlParams.get('likes');
    const comments = urlParams.get('comments');

    postPreview.src = picture;
    postLikes.innerHTML = likes;
    postComments.innerHTML = comments;
    document.getElementById("author").innerHTML = author;
}
// Save post information to archive
function saveArchive() {
    const postSaveData = getPostSaveData();
    savePostData(postSaveData);
    alert("Post saved successfully!");
    window.location.href = "Home.html";
}

// Clear archive list
function clearArchive() {
    localStorage.clear(); // clear all saved posts from localStorage
    displaySavedPosts(); // re-populate the table with the updated data
}
function savePost() {
    const post = getPostSaveData();
    const savedPosts = JSON.parse(localStorage.getItem("posts")) || [];
    const archivedPosts = JSON.parse(localStorage.getItem("archive")) || [];

    // Check if post already exists in archive
    for (let i = 0; i < archivedPosts.length; i++) {
        if (archivedPosts[i].link === post.link) {
            alert("Post already in archive!");
            window.location.href = "archive.html";
            return;
        }
    }

    // Check if post already exists in saved posts
    for (let i = 0; i < savedPosts.length; i++) {
        if (savedPosts[i].link === post.link) {
            alert("Post already saved!");
            window.location.href = "archive.html";
            return;
        }
    }

    // If post is not in archive or saved posts, save it
    savedPosts.push(post);
    localStorage.setItem("posts", JSON.stringify(savedPosts));
    alert("Post saved!");
    window.location.href = "archive.html";
}

function filterArchiveByTag() {
    const tagInput = document.getElementById("tag-input");
    const tag = tagInput.value.toLowerCase().trim();

    const archivedPosts = JSON.parse(localStorage.getItem("archive")) || [];

    let filteredPosts;
    if (tag) {
        filteredPosts = archivedPosts.filter(post => {
            const tags = post.tags.map(tag => tag.toLowerCase());
            return tags.includes(tag);
        });
    } else {
        // If tag input is empty, show all the posts
        displaySavedPosts(archivedPosts, "post-table-body");
        return;
    }

    displayFilteredPosts(filteredPosts, "post-table-body");
}
function displayFilteredPosts(filteredPosts, containerId) {
    const postTableBody = document.getElementById(containerId);
    postTableBody.innerHTML = "";

    filteredPosts.forEach((post) => {
        const row = document.createElement("tr");

        const previewCell = document.createElement("td");
        const previewImg = document.createElement("img");
        previewImg.src = post.picture;
        previewImg.alt = "Post preview";
        previewImg.classList.add("post-preview");
        previewCell.appendChild(previewImg);
        row.appendChild(previewCell);

        const authorCell = document.createElement("td");
        authorCell.innerText = post.author;
        row.appendChild(authorCell);

        const likesCell = document.createElement("td");
        likesCell.innerText = post.likes;
        row.appendChild(likesCell);

        const commentsCell = document.createElement("td");
        commentsCell.innerText = post.comments;
        row.appendChild(commentsCell);

        const tagsCell = document.createElement("td");
        console.log(post.tags); // check if tags are being correctly retrieved
        tagsCell.innerText = post.tags.split(",").map((tag) => tag.trim().toLowerCase()).join(", ");
        row.appendChild(tagsCell);

        const archiverCell = document.createElement("td");
        archiverCell.innerText = post.archiver;
        row.appendChild(archiverCell);

        postTableBody.appendChild(row);
    });
}
