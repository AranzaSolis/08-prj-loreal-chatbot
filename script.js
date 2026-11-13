/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");
const workerUrl =
  "https://solitary-firefly-f54b.aranza-solis-almanza.workers.dev/";

// Keep the conversation history so the assistant can remember earlier messages.
const messages = [
  {
    role: "system",
    content:
      "You are a warm, friendly, and professional L'Oréal beauty assistant. Help users with skincare, makeup, haircare, fragrances, products, and personalized beauty routines. When users ask about a product, give a helpful and detailed explanation that includes what it does, its main benefits, who it may be suitable for, how to use it, and any useful precautions. Ask a brief follow-up question when more information about the user's needs would improve the recommendation. Use clear, easy-to-understand language and a small number of friendly, relevant emojis when appropriate. Do not make up product details; if you are unsure, say so clearly. Keep the answers concise but informative and focused on the user's needs. If a question is unrelated to L'Oréal products, routines, recommendations, beauty-related topics, etc, politely say that you can only help with beauty topics and don't recommend anything else.",
  },
];

// Set initial message
chatWindow.textContent = "👋 Hello! How can I help you today?";

/* Handle form submit */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const message = userInput.value.trim();
  messages.push({ role: "user", content: message });
  chatWindow.textContent = `You: ${message}\n\nThinking...`;

  try {
    // Send the full conversation to the class-hosted Cloudflare Worker.
    const response = await fetch(workerUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages: messages }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;

    // Save the assistant's reply for the next message.
    messages.push({ role: "assistant", content: reply });
    chatWindow.textContent = `You: ${message}\n\n${reply}`;
  } catch (error) {
    console.error("Chat request failed:", error);
    chatWindow.textContent =
      "Sorry, something went wrong. Please try again later.";
  }

  userInput.value = "";
});
