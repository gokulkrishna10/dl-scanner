// Access the webcam and canvas elements from the HTML document
const webcamElement = document.getElementById('webcam');
const canvasElement = document.getElementById('canvas');
const captureButton = document.getElementById('capture');

// Define video constraints for the webcam feed
const videoConstraints = {
    video: true,
    width: 640,
    height: 480
};

// Access file input and drag-and-drop area elements
const fileInput = document.querySelector('.file-input');
const fileDropArea = document.getElementById('file-drop-area');
const fileInfo = document.getElementById('file-info');


// Access elements for displaying tooltips
const infoIcon = document.getElementById('info-icon');
const infoTooltip = document.getElementById('info-tooltip');


// Initialize the webcam by requesting access to the device's camera
navigator.mediaDevices.getUserMedia(videoConstraints)
    .then(stream => {
        // Assign the media stream to the video element's srcObject to display the feed
        webcamElement.srcObject = stream;
    })
    .catch(err => {
        // Log any errors that occur during this process
        console.log('Error accessing the webcam', err);
    });

// Capture event
captureButton.addEventListener('click', () => {
    // Get the 2D drawing context of the canvas
    const context = canvasElement.getContext('2d');
    // Draw the current frame from the webcam onto the canvas
    context.drawImage(webcamElement, 0, 0, canvasElement.width, canvasElement.height);

    // Convert the canvas content to a Blob and send it to the backend
    canvasElement.toBlob(blob => {
        sendImageToBackend(blob)
    }, 'image/jpeg'); // Specify the image format, if needed
});

// Function to dynamically determine the API base URL based on the hostname
function getApiBaseUrl() {
    const hostname = window.location.hostname;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
        return `http://localhost:8000`; // Use the local server for development
    } else {
        return `https://dl-scanner2.onrender.com`; // Use the production server otherwise
    }
}


// function to call the backend api
function sendImageToBackend(imageBlob) {
    // Show loader
    document.getElementById('loader').style.display = 'block';

    // Create a FormData object and append the blob as 'image'
    const formData = new FormData();
    formData.append('dl', imageBlob, 'driver-license.jpg'); // 'dl' is the field name expected by the backend

    // Define the API endpoint
    const apiEndpoint = `${getApiBaseUrl()}/extract-data`;

    // Send the FormData with the image to the backend
    fetch(apiEndpoint, {
        method: 'POST',
        body: formData,
        // Note: Don't set Content-Type header when using FormData, the browser will set it automatically
    })
        .then(response => response.json())
        .then(data => {
            // Hide loader
            document.getElementById('loader').style.display = 'none';
            displayResults(data);
        })
        .catch(error => {
            // Hide loader and handle error
            document.getElementById('loader').style.display = 'none';
            console.error('Error:', error);
        });
}


// Display the extracted data
function displayResults(data) {
    // Access the modal element and clear any previous results
    const modalResultsElement = document.getElementById('modal-results');
    modalResultsElement.innerHTML = ''; // Clear previous results

    // Iterate over each key-value pair in the data object and create styled elements for display
    for (const [key, value] of Object.entries(data)) {
        // Create a container for each result item
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('result-item');

        // Create and style elements for the label and value
        const labelSpan = document.createElement('span');
        labelSpan.classList.add('result-label');
        labelSpan.textContent = `${key}: `;

        const valueSpan = document.createElement('span');
        valueSpan.classList.add('result-value');
        valueSpan.textContent = value;

        // Append the label and value to the item container, and the container to the modal
        itemDiv.appendChild(labelSpan);
        itemDiv.appendChild(valueSpan);
        modalResultsElement.appendChild(itemDiv);
    }

    // Show the modal
    const modal = document.getElementById('myModal');
    modal.style.display = "block";

    // Get the <span> element that closes the modal
    const span = document.getElementsByClassName("close")[0];

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside the modal, close it
    // window.onclick = function (event) {
    //     if (event.target === modal) {
    //         modal.style.display = "none";
    //     }
    // }
}


// Click on drop area to open file dialog
fileDropArea.addEventListener('click', () => fileInput.click());

// Update message when file is selected
fileInput.addEventListener('change', function () {
    if (this.files && this.files[0]) {
        const file = this.files[0];
        fileInfo.textContent = file.name; // Update the message with the file name
        sendImageToBackend(file); // Send the file to the backend
    } else {
        fileInfo.textContent = 'No file chosen'; // Update the message if no file is selected
    }
});

// Highlight drop area on drag over
fileDropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    fileDropArea.classList.add('active');
});

// Revert drop area style on drag leave
fileDropArea.addEventListener('dragleave', (e) => {
    e.preventDefault();
    fileDropArea.classList.remove('active');
});

// Handle file drop
fileDropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    fileDropArea.classList.remove('active');

    if (e.dataTransfer.files.length) {
        fileInput.files = e.dataTransfer.files;
        fileInfo.textContent = e.dataTransfer.files[0].name;
        sendImageToBackend(e.dataTransfer.files[0])
    }
});


// Tooltip display logic for the info icon
infoIcon.addEventListener('mouseover', () => {
    infoTooltip.style.display = 'block';
});

infoIcon.addEventListener('mouseout', () => {
    infoTooltip.style.display = 'none';
});

// Optional: Toggle on click for mobile users
infoIcon.addEventListener('click', () => {
    const isDisplayed = infoTooltip.style.display === 'block';
    infoTooltip.style.display = isDisplayed ? 'none' : 'block';
});