// Log a message to the console to ensure the script is linked correctly
console.log('JavaScript file is linked correctly.');

// Select elements
const gameArea = document.getElementById('game-area');
const bucket = document.getElementById('bucket');
const waterCountSpan = document.getElementById('water-count');

// Game variables
let bucketX = 140; // starting left position
const bucketWidth = 70;
const gameWidth = 350;
let waterCount = 0;
let bucketDirection = 1; // 1 for right, -1 for left
let bucketSpeed = 2; // pixels per frame, will change with difficulty
let dropAreaHeight = 120; // will change with difficulty

// Select difficulty dropdown
const difficultySelect = document.getElementById('difficulty');

difficultySelect.addEventListener('change', function() {
    // Change game settings based on selected difficulty
    const value = difficultySelect.value;
    if (value === 'easy') {
        bucketSpeed = 2;
        dropAreaHeight = 120;
    } else if (value === 'medium') {
        bucketSpeed = 4;
        dropAreaHeight = 80;
    } else if (value === 'hard') {
        bucketSpeed = 6;
        dropAreaHeight = 50;
    }
    // Update drop area highlight height
    const dropArea = document.getElementById('drop-area-highlight');
    dropArea.style.height = `${dropAreaHeight}px`;
});

// Set initial drop area height
const dropArea = document.getElementById('drop-area-highlight');
dropArea.style.height = `${dropAreaHeight}px`;

// Move bucket automatically
function moveBucketAutomatically() {
    // Move bucket in the current direction
    bucketX += bucketDirection * bucketSpeed;
    // If bucket hits the left or right edge, reverse direction
    if (bucketX <= 0) {
        bucketX = 0;
        bucketDirection = 1;
    } else if (bucketX >= gameWidth - bucketWidth) {
        bucketX = gameWidth - bucketWidth;
        bucketDirection = -1;
    }
    bucket.style.left = `${bucketX}px`;
    // Call this function again on the next animation frame
    requestAnimationFrame(moveBucketAutomatically);
}
// Start moving the bucket automatically
moveBucketAutomatically();

// Drop water on click/tap at the top area
// Only allow drops in the top dropAreaHeight px of the game area
function handleDrop(event) {
    // Get click/tap position relative to game area
    const rect = gameArea.getBoundingClientRect();
    const y = event.touches ? event.touches[0].clientY : event.clientY;
    if (y - rect.top > dropAreaHeight) {
        // Only allow drops from the top area
        return;
    }
    // X position for the drop
    const x = event.touches ? event.touches[0].clientX - rect.left : event.clientX - rect.left;
    createWaterDrop(x);
}
gameArea.addEventListener('click', handleDrop);
gameArea.addEventListener('touchstart', handleDrop);

// Create a water drop at a given x position
function createWaterDrop(x) {
    // Create the drop element
    const drop = document.createElement('div');
    drop.className = 'water-drop';
    drop.style.left = `${x - 9}px`;
    drop.style.top = `0px`;
    gameArea.appendChild(drop);

    // Animate the drop falling
    let dropY = 0;
    // Increase the speed of falling by increasing the value added to dropY
    const dropInterval = setInterval(() => {
        dropY += 9; 
        drop.style.top = `${dropY}px`;

        // Check if drop reached the bucket
        const bucketTop = gameArea.offsetHeight - 70;
        if (dropY >= bucketTop) {
            // Check if drop is within bucket's x range
            const dropX = x;
            if (dropX > bucketX && dropX < bucketX + bucketWidth) {
                // Drop landed in bucket
                waterCount++;
                waterCountSpan.textContent = waterCount;
                // No water fill effect anymore

                // Create a bigger splash effect
                const splash = document.createElement('div');
                splash.className = 'splash-effect';
                // Position splash at the center of the bucket
                splash.style.left = `${bucketX + bucketWidth / 2 - 30}px`; // Center bigger splash
                splash.style.top = `${bucketTop - 15}px`;
                gameArea.appendChild(splash);
                // Remove splash after animation
                setTimeout(() => splash.remove(), 400);
            }
            // Remove drop
            clearInterval(dropInterval);
            drop.remove();
        }
    }, 16); // about 60 frames per second
}

// Add comments to help beginners
// - Arrow keys move the bucket
// - Click/tap top area to drop water
// - Water drops fall and fill the bucket if caught
