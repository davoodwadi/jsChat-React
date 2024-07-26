import markdownIt from 'https://cdn.jsdelivr.net/npm/markdown-it@14.1.0/+esm'

const botResponse = ``
async function handleDOMContentLoaded() {
    let fileText
    const log = console.log
    const textBox = document.getElementById('bot-message');
    // const textBoxVanilla = document.getElementById('vanilla');
    textBox.textContent = 'Hello'

    document.getElementById('fileInput').addEventListener('change', function(event) {
        const file = event.target.files[0]; // Get the selected file
        if (file) {
            const reader = new FileReader(); // Create a FileReader object

            reader.onload = function(e) {
                const text = e.target.result; // Get the text from the file

                fileText = text; // Display the text in the <pre> element
        
                const md = markdownIt({
                    highlight: function (str, lang) {
                      if (lang && hljs.getLanguage(lang)) {
                        try {
                          return '<pre><code class="hljs">' +
                                 hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
                                 '</code></pre>';
                        } catch (__) {}
                      }
                  
                      return '<pre><code class="hljs">' + md.utils.escapeHtml(str) + '</code></pre>';
                    }
                  });
                
                const html = md.render(fileText);
                const cleanHTML = DOMPurify.sanitize(html);
                console.log(cleanHTML)
                textBox.innerHTML = cleanHTML
                // textBoxVanilla.innerHTML = html
            };

            reader.onerror = function(e) {
                console.error('Error reading file', e);
            };

            reader.readAsText(file); // Read the file as text
        } else {
            console.log('No file selected');
        }
    });
    
    
    
};


// Add event listener for DOMContentLoaded and call the async function
document.addEventListener("DOMContentLoaded", handleDOMContentLoaded);