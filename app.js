document.getElementById('uploadForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    // Retrieve file input and transformation type
    const fileInput = document.getElementById('fileInput');
    const transformation = document.getElementById('transformation').value;

    // Collect parameter values, defaulting to null if not provided
    const params = {
        scale_factor: parseFloat(document.getElementById('scaleInput').value) || 1,
        angle: parseFloat(document.getElementById('angleInput').value) || 0,
        offset_x: parseInt(document.getElementById('offsetXInput').value) || 0,
        offset_y: parseInt(document.getElementById('offsetYInput').value) || 0,
        shear_x: parseFloat(document.getElementById('shearXInput')?.value) || 0,
        shear_y: parseFloat(document.getElementById('shearYInput')?.value) || 0
    };

    // Prepare form data to send to the server
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    formData.append('transformation', transformation);
    formData.append('params', JSON.stringify(params)); // Serialize params to JSON format

    // Display loader and hide the image
    const loader = document.createElement('div');
    loader.id = 'loader';
    loader.style.width = '50px';
    loader.style.height = '50px';
    loader.style.border = '5px solid #f3f3f3';
    loader.style.borderTop = '5px solid #007BFF';
    loader.style.borderRadius = '50%';
    loader.style.animation = 'spin 1s linear infinite';
    loader.style.margin = '20px auto';

    const resultSection = document.getElementById('result');
    const resultImage = document.getElementById('resultImage');
    resultImage.style.display = 'none'; // Hide the image initially
    resultSection.appendChild(loader); // Add loader to the result section

    try {
        // Send the form data to the server via a POST request
        const response = await fetch('https://affine-transformer.onrender.com/upload', {
            method: 'POST',
            body: formData
        });

        // Check if the response is ok, if not throw an error
        if (!response.ok) {
            throw new Error(await response.text());
        }

        // Convert the response to a blob (image)
        const imageBlob = await response.blob();
        const imageURL = URL.createObjectURL(imageBlob);

        // Display the processed image in the result section
        resultImage.src = imageURL;
        resultImage.style.display = 'block'; // Show the image
    } catch (error) {
        // Handle any errors that occur during the fetch request
        console.error('Error:', error);
        alert('An error occurred: ' + error.message);
    } finally {
        // Remove the loader
        loader.remove();
    }
});

// Add CSS for loader animation
const style = document.createElement('style');
style.innerHTML = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);
