

(async () => {
    const errorMessage = document.getElementById("error-message");
    const promptInput = document.getElementById("codeInput");
    const responseArea = document.getElementById("reviewOutput");
    const codeReviewPrompt = "You are a code review assistant, please review the following code. Give feed back on how the code can be improved and give credit when credit is due. ";
    const pseudoCodePrompt = "You are a code assistant, please review the following code. Explain what the code is doing in psuedo code. ";
    const breakdownCodePrompt = "You are a code assistant, breakdown the following code, explain the code. Include explanation of any key features of the coding language used. ";

    const convertCodePrompt = "You are a code assistant, the following code is in the coding language of [fromCode], convert the code to the coding language of [destCode]. ";

    const jsonToCodePrompt = "You are a code assistant, create an object that represents the json input in the language of [lang]. ";
    const codeToJsonPrompt = "You are a code assistant, based on the code given output a json representation. ";

    const freeFormPrompt = "You are a code assistant, help users with only requests that related to code. ";

    document.getElementById('jsonLangGroup').style.display = 'none';
    let session = null;

    if (!self.ai || !self.ai.languageModel) {
        errorMessage.style.display = "block";
        errorMessage.innerHTML = `Your browser doesn't support the Prompt API. If you're on Chrome, join the <a href="https://developer.chrome.com/docs/ai/built-in#get_an_early_preview">Early Preview Program</a> to enable it.`;
        return;
      }

    const promptModel = async (systemPrompt, highlight = false) => {
        
        const p = document.createElement("p");
        const prompt = systemPrompt + promptInput.value.trim();
        if (!prompt) return;
        
        responseArea.append(p);
        let fullResponse = "";

        try {
                if (!session) {
                    await updateSession();
                }

                const stream = await session.promptStreaming(prompt);

                for await (const chunk of stream) {
                    fullResponse = chunk.trim();
                    p.innerHTML = DOMPurify.sanitize(marked.parse(fullResponse));
                }

            } catch (error) {
                p.textContent = `Error: ${error.message}`;
            } finally {
            }
    };

    const updateSession = async () => {
        session = await self.ai.languageModel.create();
        if(!session) alert("failed to create");
      };          

    document.getElementById('reviewButton').addEventListener('click', async (e) => {
        const button = document.getElementById("reviewButton");
        button.textContent = "Reviewing...";
        button.disabled = true;
        const code = document.getElementById('codeInput').value;
        
        const reviewOutput = document.getElementById('reviewOutput');

        if (!code) {
            suggestions = 'Please provide some code to review.';
            reviewOutput.innerText = suggestions;
        } else {
            
            reviewOutput.innerText = "";
            await promptModel(codeReviewPrompt);
        }
        button.textContent = "Review Code";
        button.disabled = false;
    })

    document.getElementById('pseudoButton').addEventListener('click', async (e) => {
        const button = document.getElementById("pseudoButton");
        button.textContent = "Psuedoing...";
        button.disabled = true;
        const code = document.getElementById('codeInput').value;            
        const reviewOutput = document.getElementById('reviewOutput');

        if (!code) {
            suggestions = 'Please provide some code.';
            reviewOutput.innerText = suggestions;
        } else {
            reviewOutput.innerText = "";
            await promptModel(pseudoCodePrompt);

        }
        button.textContent = "Psuedo Code";
        button.disabled = false;
    })

    document.getElementById('explainButton').addEventListener('click', async (e) => {
        const button = document.getElementById("explainButton");
        button.textContent = "Explaining...";
        button.disabled = true;
        const code = document.getElementById('codeInput').value;
        const reviewOutput = document.getElementById('reviewOutput');

        if (!code) {
            suggestions = 'Please provide some code.';
            reviewOutput.innerText = suggestions;
        } else {
            reviewOutput.innerText = "";
            await promptModel(breakdownCodePrompt);

        }
        button.textContent = "Explain Code";
        button.disabled = false;
    })

        document.getElementById('convertButton').addEventListener('click', async (e) => {
            const button = document.getElementById("convertButton");
            button.textContent = "Converting...";
            button.disabled = true;
            const code = document.getElementById('convertInput').value;
            const fromLang = document.getElementById('fromInput').value;
            const destLang = document.getElementById('toInput').value;
            const reviewOutput = document.getElementById('reviewOutput');
    
            if (!code) {
                suggestions = 'Please provide some code.';
                reviewOutput.innerText = suggestions;
            } else {                
                reviewOutput.innerText = "";
                await promptModel(convertCodePrompt.replace("[fromCode]", fromLang).replace("[destCode]", destLang) + " Code: " + code);
    
            }

            button.textContent = "Convert";
            button.disabled = false;
        })

        document.getElementById('jsonButton').addEventListener('click', async (e) => {
            const button = document.getElementById("jsonButton");
            button.textContent = "Converting...";
            button.disabled = true;
            const code = document.getElementById('jsonGenInput').value;
            const convertType = document.getElementById('inputGenType').value;
            const inputLang = document.getElementById('jsonLangInput').value;
            const reviewOutput = document.getElementById('reviewOutput');
    
            if (!code) {
                suggestions = 'Please provide some code/JSON.';
                reviewOutput.innerText = suggestions;
            } else {
                reviewOutput.innerText = "";

                if(convertType == "toJSON")
                    await promptModel(codeToJsonPrompt + " Code: " + code);
                else
                    await promptModel(jsonToCodePrompt.replace("[lang]", inputLang) + " json: " + code);
    
            }           

            button.textContent = "Convert";
            button.disabled = false;
        })

            document.getElementById('runButton').addEventListener('click', async (e) => {
                const button = document.getElementById("runButton");                
                button.textContent = "Running...";
                button.disabled = true;
                const userInput = document.getElementById('freeCodeInput').value;
                const reviewOutput = document.getElementById('reviewOutput');
        
                if (!userInput) {
                    suggestions = 'A question is required.';
                    reviewOutput.innerText = suggestions;
                } else {
                    
                    reviewOutput.innerText = "";
                    await promptModel(freeFormPrompt + " User: " + userInput);        
                }

                button.textContent = "Run";
                button.disabled = false;
            })

            document.getElementById('inputGenType').addEventListener('change', async (e) => {
                
                const convertType = document.getElementById('inputGenType').value;
                const inputLang = document.getElementById('jsonLangGroup');
            
                if(convertType === "toCode"){
                    inputLang.style.display = 'block';
                }
                else {
                    inputLang.style.display = 'none';
                }
            })
        
})();

