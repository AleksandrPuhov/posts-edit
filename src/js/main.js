const listElement = document.querySelector('.posts');
const postTemplate = document.getElementById('single-post');
const form = document.querySelector('#new-post form');
const fetchButton = document.querySelector('#available-posts button');
const postList = document.querySelector('ul');

const sendHttpRequest = (method, url, data) => {
    // const promis = new Promise((resolve, reject) => {
    //     const xhr = new XMLHttpRequest();
    //     xhr.setRequestHeader('Content-Type', 'application/json');
    //     xhr.open(method, url);
    //     xhr.responseType = 'json';
    //     xhr.onload = () => {
    //         if (xhr.status >= 200 && xhr.status < 300) {
    //             resolve(xhr.response);
    //         } else {
    //             reject(new Error('Somthing went wrong!'));
    //         }
    //     };
    //     xhr.onerror = () => {
    //         reject(new Error('Fail to send request!'));
    //     };
    //     xhr.send(JSON.stringify(data));
    // });
    // return promis;
    return fetch(url, {
        method: method,
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
        },
    }).then((response) => {
        if (response.status >= 200 && response.status < 300) {
            return response.json();
        } else {
            return response.json().then((errData) => {
                console.log(errData);
                throw new Error('Somthing went wrong!');
            });
        }
    });
};

const fetchPosts = async () => {
    try {
        const responseData = await sendHttpRequest(
            'GEt',
            'https://jsonplaceholder.typicode.com/posts'
        );
        console.log(responseData);
        responseData.forEach((post) => {
            const postEl = document.importNode(postTemplate.content, true);
            postEl.querySelector('h2').textContent = post.title.toUpperCase();
            postEl.querySelector('p').textContent = post.body;
            postEl.querySelector('li').id = post.id;
            listElement.append(postEl);
        });
    } catch (error) {
        alert(error.message);
    }
};

const createPost = async (title, content) => {
    const userId = Math.random();
    const post = {
        title: title,
        body: content,
        userId: userId,
    };

    sendHttpRequest('POST', 'https://jsonplaceholder.typicode.com/posts', post);
};

fetchButton.addEventListener('click', fetchPosts);

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const inputTitle = event.currentTarget.querySelector('#title').value;
    const inputContent = event.currentTarget.querySelector('#content').value;

    createPost(inputTitle, inputContent);
});

postList.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
        const postId = event.target.closest('li').id;
        sendHttpRequest(
            'DELETE',
            'https://jsonplaceholder.typicode.com/posts/' + postId
        );
    }
});
