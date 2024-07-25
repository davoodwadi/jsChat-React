let bot_default_message = `To ensure that messages in the chat interface wrap and display as multiline when the text is too long to fit in one line, you need to update the CSS to allow for word wrapping and handling overflow appropriately.

Here’s how you can adjust the CSS to ensure that messages are displayed in multiple lines within the chat interface: `
// get api response
const apiUrl = 'http://192.168.1.44:3000/api/openai/completions'; // API endpoint on your server


document.addEventListener('DOMContentLoaded', function () {
    const messagesContainer = document.getElementById('messages');
    init();

    function init(){
        //  addUserMessage
        messageElement = addUserMessage()
        // console.log(`rendered ${messageElement.renderedAlready}`)
    
        messageElement.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                event.preventDefault(); // Prevent the default behavior of adding a new line
                console.log(`elementID: ${messageElement.id}`)
    
                sendMessage(messageElement);
                if (messageElement.renderedAlready === false){
                    init();
                }
            }
        });
    } 
    // the main function
    async function sendMessage(messageElement) { 
        // count the length of messagesContainer
        // console.log(`messagesContainer: ${messagesContainer.children.length}`)
        //  display user message
        const messageText = messageElement.value.trim();
        if (messageText !== '') {
            
            messageElement.blur()
            autoResizeTextarea();
            scrollToTopOfLastMessage();
            console.log(`showed: ${messageText}`);
            // try to get gpt message
            try {
                // const responseGPT = await makeApiCall(messageText);
                // const final_text = responseGPT.message.content;
                const final_text = bot_default_message
                addMessage('bot', final_text);
                scrollToTopOfLastMessage();
                // console.log(`added: ${final_text}`);
            } catch (error) {
                console.error('Error fetching bot response:', error);
                addMessage('bot', 'Sorry, an error occurred.');
            }
        }
        
        // console.log(`rendered inner ${messageElement.renderedAlready}`);
        // console.log(`class user ${messageElement.classList.contains('user')}`);
    }


    function addMessage(sender, text) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);
        messageElement.textContent = text;
        messagesContainer.appendChild(messageElement);
        messageElement.id = getID('bot')
    }
    function addUserMessage(){
        // render past user convo false
        for (me of messagesContainer.children){
            me.renderedAlready = true
            // console.log(`*checking the render of past convo: ${me.renderedAlready}`)
        }
        // 
        const messageElement = document.createElement('textarea');
        messageElement.classList.add('message', 'user');
        messagesContainer.appendChild(messageElement);
        messageElement.id = getID('user')
        // console.log(`elementID inner: ${messageElement.id}`)
        messageElement.renderedAlready = false
        // Ensure the textarea is visible in the DOM before focusing it
        // setTimeout(() => {
        //     messageElement.focus();
        // }, 0);

        return messageElement
        
    }
    function scrollToTopOfLastMessage() {
        const lastMessage = messagesContainer.lastElementChild;
        lastMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function autoResizeTextarea() {
        // const textarea = document.getElementById('message-input');
        messageElement.style.height = 'auto'; // Reset the height to auto
        messageElement.style.height = Math.min(messageElement.scrollHeight, 200) + 'px'; // Set the height to match the scrollHeight, up to a max of 200px
    }
    // Function to set the `renderedAlready` property
    function renderTrue() {
        // Get all children of messagesContainer
        const children = messagesContainer.children;

        // Loop through each child
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            
            // Check if the child has the property and update it
            if (child.renderedAlready !== undefined) {
                child.renderedAlready = true;
            }
        }
    }
    function getID(role){
        const integer = messagesContainer.children.length
        id = role + '-' + integer
        return id
    }
    // give userMessage and get data as array
    async function makeApiCall(userMessage) {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messages: [
                        { role: "system", content: "You are a helpful assistant." },
                        { role: "user", content: userMessage},
                    ],
                    model: "gpt-4o-mini",
                    max_tokens: 10
                })
            });
        
            const data = await response.json();
            console.log(data);
            return data
        } catch (error) {
            console.error('Error:', error);
            console.error(error);
        }
    }
});
