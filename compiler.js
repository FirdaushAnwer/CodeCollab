// Default code snippets
const snippets = {
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <style>
        body { 
            font-family: sans-serif; 
            text-align: center; 
            margin-top: 50px;
            color: #333;
        }
        h1 { color: #f04e36; }
    </style>
</head>
<body>
    <h1>Hello, Code Collab!</h1>
    <p>This is a live HTML/CSS preview.</p>
</body>
</html>`,
    python: `def greet(name):
    print(f"Hello, {name}! Welcome to the Code Collab Compiler.")

greet("Developer")

# Try running this Python code!
for i in range(1, 4):
    print(f"Counting: {i}")`,
    c: `#include <stdio.h>

int main() {
    printf("Hello, Code Collab!\\n");
    printf("This is compiled and executed securely via the Piston API.\\n");
    return 0;
}`,
    java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from Java!");
        System.out.println("Code Collab Online Compiler is running.");
    }
}`
};

// Monaco language maps
const monacoMap = {
    html: 'html',
    python: 'python',
    c: 'c',
    java: 'java'
};

// Icons map
const iconMap = {
    html: '<i class="fa-brands fa-html5" style="color: #e34f26;"></i> index.html',
    python: '<i class="fa-brands fa-python" style="color: #3776ab;"></i> main.py',
    c: '<i class="fa-brands fa-c" style="color: #a8b9cc;"></i> main.c',
    java: '<i class="fa-brands fa-java" style="color: #b07219;"></i> Main.java'
};

document.addEventListener('DOMContentLoaded', () => {

    // UI Elements
    const langSelect = document.getElementById('language-select');
    const explorerFilename = document.getElementById('explorer-filename');
    const tabFilename = document.getElementById('tab-filename');
    const runBtn = document.getElementById('run-btn');
    const outputTerminal = document.getElementById('output-terminal');
    const previewFrame = document.getElementById('preview-frame');
    const tabOutput = document.getElementById('tab-output');
    const tabPreview = document.getElementById('tab-preview');
    const clearOutput = document.getElementById('clear-output');
    const panelArea = document.getElementById('panel-area');
    const closePanel = document.getElementById('close-panel');

    let editor;

    // Load Monaco Editor dynamically via AMD (RequireJS)
    require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' } });

    window.MonacoEnvironment = {
        getWorkerUrl: function (workerId, label) {
            return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
                self.MonacoEnvironment = {
                    baseUrl: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/'
                };
                importScripts('https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs/base/worker/workerMain.js');`
            )}`;
        }
    };

    require(['vs/editor/editor.main'], function () {
        // Wait for the fonts to be fully loaded before initializing Monaco
        // This prevents the cursor position mismatch bug caused by font metric changes
        document.fonts.ready.then(() => {
            // Initialize Monaco Editor
            editor = monaco.editor.create(document.getElementById('monaco-container'), {
                value: snippets.html,
                language: 'html',
                theme: 'hc-black',
                automaticLayout: true,
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "'Fira Code', Consolas, monospace",
                formatOnPaste: true,
                // Enhanced Intellisense Configuration
                quickSuggestions: true,
                suggestOnTriggerCharacters: true,
                wordBasedSuggestions: true,
                parameterHints: { enabled: true },
                snippetSuggestions: "inline"
            });

            // Setup real-time preview updating for HTML mode
            editor.onDidChangeModelContent(() => {
                if (langSelect.value === 'html') {
                    updatePreview();
                }
            });

            // Initial preview load
            updatePreview();
        });
    });

    // Language Change Event
    langSelect.addEventListener('change', (e) => {
        const lang = e.target.value;

        // Update Editor
        if (editor) {
            monaco.editor.setModelLanguage(editor.getModel(), monacoMap[lang]);
            editor.setValue(snippets[lang]);
        }

        // Update UI Labels
        explorerFilename.innerHTML = iconMap[lang];
        tabFilename.innerHTML = iconMap[lang];

        // Toggle Output vs Preview
        if (lang === 'html') {
            tabPreview.classList.add('active');
            tabOutput.classList.remove('active');
            previewFrame.style.display = 'block';
            outputTerminal.style.display = 'none';
            updatePreview();
        } else {
            tabOutput.classList.add('active');
            tabPreview.classList.remove('active');
            outputTerminal.style.display = 'block';
            previewFrame.style.display = 'none';
        }

        // Open panel if closed
        panelArea.style.display = 'flex';
    });

    // Run Button (Trigger execution via Judge0 / Piston proxy)
    runBtn.addEventListener('click', async () => {
        const lang = langSelect.value;
        const code = editor.getValue();

        // Open panel
        panelArea.style.display = 'flex';

        if (lang === 'html') {
            // It's already live previewing, just ensure tab is focused
            tabPreview.click();
            return;
        }

        // Switch to Output Tab
        tabOutput.click();
        outputTerminal.innerHTML = '<span style="color: var(--accent);">Running Code...</span>\n';

        // Wandbox API Mapping (Free, No Keys Required)
        const wandboxLangMap = {
            python: 'cpython-3.14.0',
            c: 'gcc-13.2.0-c',
            java: 'openjdk-jdk-22+36'
        };

        const executePayload = {
            compiler: wandboxLangMap[lang] || 'cpython-3.14.0',
            code: code,
            save: false
        };

        try {
            outputTerminal.innerHTML += '<span style="color: var(--accent);">Compiling and Executing remotely...</span>\n\n';

            // Call Wandbox API
            const response = await fetch('https://wandbox.org/api/compile.json', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(executePayload)
            });

            if (!response.ok) {
                throw new Error(`API returned status ${response.status}`);
            }

            const result = await response.json();

            // Display output
            const isSuccess = result.status == 0;

            if (isSuccess) {
                // Success
                if (result.program_message) {
                    outputTerminal.innerHTML += escapeHtml(result.program_message);
                } else if (result.program_out) {
                    outputTerminal.innerHTML += escapeHtml(result.program_out);
                }
                outputTerminal.innerHTML += `\n<span style="color: #27c93f;">[Process completed with exit code ${result.status}]</span>`;
            } else {
                // Error (Compilation or Runtime)
                const errorMsg = result.compiler_error || result.program_error || result.program_message || "Unknown Code Execution Error";
                outputTerminal.innerHTML += `<span class="error">${escapeHtml(errorMsg)}</span>`;
                outputTerminal.innerHTML += `\n<span style="color: #f14c4c;">[Process failed with exit code ${result.status}]</span>`;
            }

        } catch (error) {
            outputTerminal.innerHTML += `<span class="error">Execution Engine Error: Cannot connect to compilation API.\n${error.message}</span>`;
        }
    });

    // Utility: Live Preview Update
    function updatePreview() {
        if (!editor) return;
        const code = editor.getValue();
        previewFrame.srcdoc = code;
    }

    // Utility: Escape HTML for Terminal
    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Click Handlers for Tabs
    tabOutput.addEventListener('click', () => {
        tabOutput.classList.add('active');
        tabPreview.classList.remove('active');
        outputTerminal.style.display = 'block';
        previewFrame.style.display = 'none';
        panelArea.style.display = 'flex';
    });

    tabPreview.addEventListener('click', () => {
        tabPreview.classList.add('active');
        tabOutput.classList.remove('active');
        previewFrame.style.display = 'block';
        outputTerminal.style.display = 'none';
        panelArea.style.display = 'flex';
    });

    clearOutput.addEventListener('click', () => {
        outputTerminal.innerHTML = '';
    });

    closePanel.addEventListener('click', () => {
        panelArea.style.display = 'none';
    });
});
