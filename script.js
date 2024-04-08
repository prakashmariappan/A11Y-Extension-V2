document.addEventListener("DOMContentLoaded", function() {
    // Inject HTML
    const MainHTML = `
    <head>
    <link
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap"
      rel="stylesheet"
    />
    </head>
    <div class="container" id="a11y-extension">
        <div class="welcome-box">
            <img class="logo" alt="Logo" id="reload" src="chrome-extension://afgmghpdkdfhegeojiboikocdmhcojon/logo.png">
        </div>
        <div class="desc">Our chatbot teaches you how to build Websites and Apps accessible to all. Let's make the digital world welcoming for all. Start your easy-to-follow journey with us today!</div>
        <div class="media-list"></div>
        <div class="chatbox">
            <form id="chatbot-form">
                <input class="input-box" placeholder="Message A11Y..." id="messageText" />
                <button type="submit" title="Send Message" id="chatbot-form-btn">
                    <img class="send" src="chrome-extension://afgmghpdkdfhegeojiboikocdmhcojon/send.svg" alt="Send">
                </button>
            </form>
        </div>
    </div>
    `;
    document.body.insertAdjacentHTML('afterbegin', MainHTML);

    // Make the container draggable
    const container = document.getElementById('a11y-extension');

    let isDragging = false;
    let offsetX, offsetY;

    container.addEventListener('mousedown', startDrag);
    container.addEventListener('mouseup', endDrag);

    function startDrag(e) {
        isDragging = true;
        offsetX = e.clientX - container.getBoundingClientRect().left;
        offsetY = e.clientY - container.getBoundingClientRect().top;
    }

    function endDrag() {
        isDragging = false;
    }

    document.addEventListener('mousemove', e => {
        if (isDragging) {
            container.style.left = `${e.clientX - offsetX}px`;
            container.style.top = `${e.clientY - offsetY}px`;
        }
    });

    function handleReload() {
        window.location.reload();
    }

    let message = "";

    const setMessage = (value) => {
        message = value;
    };

    async function handleSubmit(e) {
        e.preventDefault();
        const message = document.getElementById('messageText').value.trim();
        if (message !== "") {
            try {
                const descElement = document.querySelector('.desc');
                if (descElement) {
                    descElement.remove();
                }

                const userMessage = document.getElementById('messageText').value;
                document.getElementById('messageText').value = '';

                const mediaList = document.querySelector('.media-list');
                mediaList.innerHTML += `
                    <li class="media">
                        <div class="usermessage">
                            <div class="author"><b> You </b><div class='userinput_box'>${userMessage}</div></div>
                        </div>
                    </li>
                    <li class="type media">
                        <div class="answer">
                            <div class="bot"><b> A11Y Chatbot </b><div class='botoutput_typing'>Generating...</div></div>
                        </div>
                    </li>
                `;

                mediaList.scrollTop = mediaList.scrollHeight;

                const data = {
                    input_text: userMessage,
                    chat_id: "de305d54-75b4-431b-adb2-eb6b9e546014"
                };

                const response = await fetch("https://api.botsonic.ai/v1/botsonic/generate", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "token": "25f9a329-2f2a-43a8-a5b9-45cddb7d5589"
                    },
                    body: JSON.stringify(data)
                });

                const responseData = await response.json();
                const answer = responseData.answer;
                let contentAnswer;
                if (answer.includes('**Answer:**')) {
                    contentAnswer = answer.split('**Answer:**')[1].trim();
                } else {
                    contentAnswer = answer;
                }

                document.querySelectorAll('.type').forEach(elem => elem.remove());

                mediaList.innerHTML += `
                    <li class="media">
                        <div class="answer">
                            <div class="bot"><b> A11Y Chatbot </b><div class='botoutput_box'>${contentAnswer}</div></div>
                        </div>
                    </li>
                `;

                mediaList.scrollTop = mediaList.scrollHeight;
            } catch (error) {
                console.error(error);
            }
        }
    }

    document.getElementById('chatbot-form').addEventListener('submit', handleSubmit);
});
