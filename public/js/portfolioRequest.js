async function sendDelete(url, filename) {
    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            name: filename
        })
    });

    const resData = 'resource deleted...';
    location.reload() // reloads the web page
    return resData;
}

async function sendPost(url, data) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    const resData = await response.json();
    if (resData.success) {
        console.log('Resource added:', resData.message);
    } else {
        console.error('Error adding resource:', resData.message);
    }
    location.reload() // reloads the web page
    return resData;
}

/*
The sendPost function waits for the server's response before reloading 
the page. The server-side code uses await to ensure that the image download 
is completed before updating the JSON file and sending the response.

The download function returns a promise that resolves when the image download 
is complete, allowing the server to wait for the download to finish before 
proceeding.

By following this flow, the sendPost function ensures that the image is 
downloaded and the JSON file is updated before reloading the page, 
allowing the new image and data to be displayed immediately.
*/