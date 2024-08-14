const chatContainer = document.querySelector('#chat-container');
const chatBox = document.getElementById('chat-box');
const messages = document.querySelector('#messages')

const zoomFactor = 4

// console.log(fontSize)
let fontSize = window.getComputedStyle(document.body).fontSize
fontSize = parseInt(fontSize, 10)
console.log(fontSize)
chatBox.style.fontSize = `${fontSize}px`
console.log(chatBox.style.fontSize)

document.addEventListener('DOMContentLoaded', function() {
    
chatBox.addEventListener('click', function() {
    if (parseInt(this.style.fontSize, 10)===fontSize){ //original size
        this.style.fontSize = `${fontSize/zoomFactor}px`
    } else { //zommed out
        this.style.fontSize = `${fontSize}px`
    }   
});

});



function getOffsetHeight(el){
    el.style.display = 'none'; // Hide the element
    el.offsetHeight; // Access to trigger reflow
    el.style.display = ''; // Show the element again
    console.log(el)
    return el.offsetHeight
}

function removeMessages(){
    for (const message of Array.from(messages.children)){
        console.log(message)
        messages.removeChild(message)
    }    
}
function removeOneMessage() {
    const allMessages = Array.from(messages.children)
    const messageToRemove = allMessages[0]
    // console.log(messageToRemove)
    messages.removeChild(messageToRemove)
}