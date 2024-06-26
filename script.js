// Inject HTML
const MainHTML = `
<head>
<link
  href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap"
  rel="stylesheet"
/>
</head>
<body>
<div id="common">
<div id="toggleButton">
<img class="icon-btn" alt="Logo"  src="${chrome.runtime.getURL(
  "defaultLogo.png"
)}">
</div>
<div class="container" id="a11y-extension" style="display: none;">
    <div class="welcome-box">
        <img class="logo" alt="Logo" id="reload" src="${chrome.runtime.getURL(
          "logo.png"
        )}">
    </div>
    <div class="desc">Our chatbot teaches you how to build Websites and Apps accessible to all. Let's make the digital world welcoming for all. Start your easy-to-follow journey with us today!</div>
    <div class="media-list"></div>
    <div class="chatbox">
        <form id="chatbot-form">
            <input class="input-box" placeholder="Message A11Y..." id="messageText" />
            <button type="submit" title="Send Message" id="chatbot-form-btn">
                <img class="send" src="${chrome.runtime.getURL("send.svg")}">
            </button>
        </form>
    </div>
</div>
</div>
</body>
`;
document.body.insertAdjacentHTML("afterbegin", MainHTML);

// Make the container draggable
const container = document.getElementById("common");

let containerDragging = false;
let containerOffsetX, containerOffsetY;

container.addEventListener("mousedown", startContainerDrag);
document.addEventListener("mouseup", endDrag);

function startContainerDrag(e) {
  containerDragging = true;
  containerOffsetX = e.clientX - container.getBoundingClientRect().left;
  containerOffsetY = e.clientY - container.getBoundingClientRect().top;
}

function adjustContainerPosition() {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const containerRect = container.getBoundingClientRect();

  if (containerRect.left < 0) {
    container.style.left = "0";
  } else if (containerRect.right > windowWidth) {
    container.style.left = `${windowWidth - containerRect.width}px`;
  }

  if (containerRect.top < 0) {
    container.style.top = "0";
  } else if (containerRect.bottom > windowHeight) {
    container.style.top = `${windowHeight - containerRect.height}px`;
  }
}

document.addEventListener("mousemove", (e) => {
  if (containerDragging) {
    container.style.left = `${e.clientX - containerOffsetX}px`;
    container.style.top = `${e.clientY - containerOffsetY}px`;
    container.style.userSelect = "none"; // Prevent text selection during dragging
  }
});

function endDrag() {
  containerDragging = false;
  adjustContainerPosition(); // Call adjustContainerPosition() while dragging
  container.style.userSelect = ""; // Allow text selection after dragging
}

let message = "";

const setMessage = (value) => (message = value);

async function handleSubmit(e) {
  e.preventDefault();
  const message = document.getElementById("messageText").value.trim();
  if (message !== "") {
    try {
      const descElement = document.querySelector(".desc");
      if (descElement) {
        descElement.remove();
      }

      const userMessage = document.getElementById("messageText").value;
      document.getElementById("messageText").value = "";

      const mediaList = document.querySelector(".media-list");
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
        chat_id: "de305d54-75b4-431b-adb2-eb6b9e546014",
      };

      const response = await fetch(
        "https://api.botsonic.ai/v1/botsonic/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: "25f9a329-2f2a-43a8-a5b9-45cddb7d5589",
          },
          body: JSON.stringify(data),
        }
      );

      const responseData = await response.json();
      const answer = responseData.answer;
      let highlightedAnswer;
      if (answer) {
        highlightedAnswer = answer.replace(
          /```(.*?)```/g,
          '<div class="code-con"><div class="code-head"><span class="code-text">Copy code</span></div><div class="code-body">$1</div></div>'
        );
      } else {
        highlightedAnswer = answer;
      }

      document.querySelectorAll(".type").forEach((elem) => elem.remove());

      mediaList.innerHTML += `
                    <li class="media">
                        <div class="answer">
                            <div class="bot"><b> A11Y Chatbot </b><div class='botoutput_box'>${highlightedAnswer}</div></div>
                        </div>
                    </li>
                `;
      document.addEventListener("click", function (event) {
        const clickedElement = event.target;

        // Check if the clicked element is a .code-text element
        if (clickedElement.classList.contains("code-text")) {
          // Find the closest parent element with class .code-con
          const codeContainer = clickedElement.closest(".code-con");

          // If a valid code container is found
          if (codeContainer) {
            // Find the code body within the code container
            const codeBody = codeContainer.querySelector(".code-body");

            // If a valid code body is found
            if (codeBody) {
              // Copy the text inside code body to clipboard
              navigator.clipboard
                .writeText(codeBody.textContent)
                .then(function () {
                  // Once text is copied, update the code-text to "Copied!"
                  clickedElement.textContent = "Copied!";
                  // Reset text to "Copy code" after 2 seconds
                  setTimeout(function () {
                    clickedElement.textContent = "Copy code";
                  }, 2000);
                })
                .catch(function (err) {
                  console.error("Failed to copy text: ", err);
                });
            }
          }
        }
      });
      mediaList.scrollTop = mediaList.scrollHeight;
    } catch (error) {
      console.error(error);
    }
  }
}

document
  .getElementById("chatbot-form")
  .addEventListener("submit", handleSubmit);

// Toggle visibility of container on click
const logo = document.getElementById("a11y-extension");
const toggleButton = document.getElementById("toggleButton");
toggleButton.addEventListener("click", function () {
  if (logo.style.display === "none") {
    logo.style.display = "flex";
  } else {
    logo.style.display = "none";
  }
});
