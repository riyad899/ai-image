const generateForm = document.querySelector(".generate-form");
const imageGallery = document.querySelector(".image-gallery");
const OPENAI_API_KEY = "sk-Q2Uewy8mGoJgWjbwXDwMQX8fhwifaEV5xdCZgOd6Q1T3BlbkFJFM8J7uhc49_7NMxFpMdyWvg3jETzkF1s8GOgN8_soA";

// Function to update image cards with AI-generated images
const updateImageCard = (imgDataArray) => {
    imgDataArray.forEach((imgObject, index) => {
        const imageCard = imageGallery.querySelectorAll(".img-card")[index];
        const imgElement = imageCard.querySelector("img");
        const downloadBtn = imageCard.querySelector(".download-btn");

        const aiGeneratedImg = `data:image/jpeg;base64,${imgObject.b64_json}`;
        imgElement.src = aiGeneratedImg;
        downloadBtn.href = aiGeneratedImg;
        downloadBtn.download = `generated-image-${index + 1}.jpg`;

        imgElement.onload = () => {
            imageCard.classList.remove("loading");
        };
    });
};

// Function to call OpenAI API to generate AI images
const generateAiImage = async (userPrompt, userImgQuantity) => {
    try {
        const response = await fetch("https://api.openai.com/v1/images/generations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                "prompt": userPrompt,
                "n": parseInt(userImgQuantity),
                "size": "512x512",
                "response_format": "b64_json"
            })
        });

        if (!response.ok) throw new Error("Failed to generate images! Please try again.");

        const { data } = await response.json();
        updateImageCard([...data]);
    } catch (error) {
        console.error(error);
    }
};

// Handle form submission
const handleFormSubmission = (e) => {
    e.preventDefault();

    const userPrompt = e.target[0].value;
    const userImgQuantity = parseInt(e.target[1].value);

    if (isNaN(userImgQuantity) || userImgQuantity <= 0) {
        alert("Please enter a valid number of images.");
        return;
    }

    // Generate dynamic image cards based on the quantity
    const imgCardMarkup = Array.from({ length: userImgQuantity }, (_, index) =>
        `<div class="img-card loading">
            <img src="" alt="AI-generated image">
            <a href="#" class="download-btn">
                <img src="image/download.svg" alt="download-icon">
            </a>
        </div>`
    ).join("");

    // Inject the generated markup into the image gallery
    imageGallery.innerHTML = imgCardMarkup;

    // Generate the AI images and update the UI
    generateAiImage(userPrompt, userImgQuantity);
};

generateForm.addEventListener("submit", handleFormSubmission);
