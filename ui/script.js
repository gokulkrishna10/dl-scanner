const webcamElement = document.getElementById('webcam');
const canvasElement = document.getElementById('canvas');
const captureButton = document.getElementById('capture');
const resultsElement = document.getElementById('results');
const videoConstraints = {
    video: true,
    width: 640,
    height: 480
};

// Initialize webcam
navigator.mediaDevices.getUserMedia(videoConstraints)
    .then(stream => {
        webcamElement.srcObject = stream;
    })
    .catch(err => {
        console.log('Error accessing the webcam', err);
    });

// Capture event
captureButton.addEventListener('click', () => {
    const context = canvasElement.getContext('2d');
    context.drawImage(webcamElement, 0, 0, canvasElement.width, canvasElement.height);

    // Convert the canvas content to a Blob
    canvasElement.toBlob(blob => {
        // Create a FormData object and append the blob as 'image'
        const formData = new FormData();
        formData.append('dl', blob, 'driver-license.jpg'); // 'dl' is the field name expected by the backend

        // Send the FormData with the image to the backend
        fetch('http://localhost:8000/extract-data', {
            method: 'POST',
            body: formData, // Send as FormData
            // Note: Don't set Content-Type header when using FormData, the browser will set it automatically
        })
            .then(response => response.json())
            .then(data => {
                resultsElement.style.display = 'block'
                displayResults(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, 'image/jpeg'); // Specify the image format, if needed
});

// Display the extracted data
function displayResults(data) {
    resultsElement.innerHTML = ''; // Clear previous results

    // Iterate over each key-value pair in the data object and create styled elements for display
    for (const [key, value] of Object.entries(data)) {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('result-item');

        const labelSpan = document.createElement('span');
        labelSpan.classList.add('result-label');
        labelSpan.textContent = `${key}: `;

        const valueSpan = document.createElement('span');
        valueSpan.classList.add('result-value');
        valueSpan.textContent = value;

        itemDiv.appendChild(labelSpan);
        itemDiv.appendChild(valueSpan);
        resultsElement.appendChild(itemDiv);
    }
}


