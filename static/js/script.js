const mainContainer = document.getElementById("main-container");

let blockCount = 0; // Added line to keep track of the block count

const azureVoices = `
        <option value="en-US-AriaNeural">US - Aria</option>
        <option value="en-US-GuyNeural">US - Guy</option>
        <option value="en-GB-AbbiNeural">UK - Abbi</option>
        <option value="en-GB-ElliotNeural">UK - Elliot</option>
        <option value="zh-CN-XiaoqiuNeural">中文 - 晓秋</option>
        <option value="zh-CN-YunfengNeural">中文 - 云风</option>
        <option value="zh-CN-YunyangNeural">中文 - 云扬</option>
    `;

const speedOptions = ["1.0x", "0.9x", "0.8x", "0.7x", "0.6x", "0.5x", "1.1x", "1.2x"];

function createTextBlock(shouldAllowRemove = true) {
    const block = document.createElement("div");
    block.className = "text-block";

    const textarea = document.createElement("textarea");
    textarea.style.height = "150px";
    textarea.style.width = "auto";
    textarea.placeholder = "Enter text";
    block.appendChild(textarea);

    const voiceSelect = document.createElement("select");
    voiceSelect.className = "voice-select";
    voiceSelect.innerHTML = azureVoices;
    block.appendChild(voiceSelect);

    const speedSelect = document.createElement("select");
    speedSelect.className = "speed-select";
    speedSelect.innerHTML = speedOptions.map(option =>
        `<option value="${parseFloat(option.split(' ')[0])}">${option}</option>`
    ).join('');
    block.appendChild(speedSelect);

    if (shouldAllowRemove) {
        const removeBtn = document.createElement("button");
        removeBtn.className = "remove-text-block";
        removeBtn.title = "Remove this block";
        removeBtn.textContent = "×";
        removeBtn.addEventListener("click", () => {
            mainContainer.removeChild(block);
        });
        block.appendChild(removeBtn);
    }

    return block;
}

document.addEventListener("DOMContentLoaded", () => {
    const firstBlock = createTextBlock(false);
    mainContainer.appendChild(firstBlock);
});

document.getElementById("add-block").addEventListener("click", () => {
    const block = createTextBlock();
    mainContainer.appendChild(block);
});

function showLoader() {
  document.getElementById("loader").style.display = "block";
  document.getElementById("party-popper").style.display = "none";
}

function hideLoader() {
  document.getElementById("loader").style.display = "none";
}

function showPartyPopper() {
  document.getElementById("party-popper").style.display = "block";
}

async function synthesizeAudio(data) {
    try {
        const response = await fetch("/synthesize", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const blob = await response.blob();

            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "synthesized_audio.mp3";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            hideLoader();
            showPartyPopper();
        } else {
            const text = await response.text();
            throw new Error(`Error during synthesis: ${text}`);
        }
    } catch (error) {
        console.error(error);

        hideLoader();
    }
}

document.getElementById("synthesize").addEventListener("click", async () => {
    // Show the loader
    showLoader();

    const data = [];

    const textBlocks = document.querySelectorAll(".text-block");
    for (const block of textBlocks) {
        const textarea = block.querySelector("textarea");
        const voiceSelect = block.querySelector(".voice-select");
        const speedSelect = block.querySelector(".speed-select");

        const selectedSpeed = speedSelect.value;
        data.push({ type: "text", text: textarea.value, voice: voiceSelect.value, speed: selectedSpeed });
    }

    // Call synthesizeAudio with a timeout to allow the browser to re-render the page
    setTimeout(() => {
        synthesizeAudio(data);
    }, 100);
});

let audioPlayer = null;  // Added line to keep track of the audio player

async function playAudio(data) {
    try {
        const response = await fetch("/synthesize", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const blob = await response.blob();

            // If there's an existing audio player, stop any playing audio
            if (audioPlayer) {
                audioPlayer.pause();
                audioPlayer = null;
            }

            // Create a new audio player for the synthesized audio
            audioPlayer = new Audio(URL.createObjectURL(blob));
            audioPlayer.play();

            hideLoader();
        } else {
            const text = await response.text();
            throw new Error(`Error during synthesis: ${text}`);
        }
    } catch (error) {
        console.error(error);

        hideLoader();
    }
}

document.getElementById("preview").addEventListener("click", async () => {
    // If there's an existing audio player and it's playing, stop it
    if (audioPlayer && !audioPlayer.paused) {
        audioPlayer.pause();
        return;
    }
    
    showLoader();

    const data = [];

    const textBlocks = document.querySelectorAll(".text-block");
    for (const block of textBlocks) {
        const textarea = block.querySelector("textarea");
        const voiceSelect = block.querySelector(".voice-select");
        const speedSelect = block.querySelector(".speed-select");

        const selectedSpeed = speedSelect.value;
        data.push({ type: "text", text: textarea.value, voice: voiceSelect.value, speed: selectedSpeed });
    }

    // Call playAudio with a timeout to allow the browser to re-render the page
    setTimeout(() => {
        playAudio(data);
    }, 100);
});