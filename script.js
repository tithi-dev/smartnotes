// ১. Gemini API কনফিগারেশন (হাইফেন সহ ঠিক করা হয়েছে)
const GEMINI_API_KEY = 'AIzaSyAJaeHsFw46nVWErvOPxtVdTa5jL4_aCdE'; 
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
// ২. ডার্ক/লাইট মোড টগল
function toggleTheme() {
    const html = document.documentElement;
    const icon = document.getElementById('themeIcon');
    if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        icon.innerText = '🌙';
    } else {
        html.classList.add('dark');
        icon.innerText = '☀️';
    }
}

// ৩. AI প্রসেসিং ফাংশন
async function processAI(action) {
    const text = document.getElementById('userInput').value;
    const container = document.getElementById('aiResponseContainer');
    const responseBox = document.getElementById('aiResponse');

    if (!text) return alert("দয়া করে আগে কিছু লিখুন!");

    container.classList.remove('hidden');
    responseBox.innerText = "Gemini চিন্তা করছে...";

    const prompts = {
        'summarize': 'Summarize the following notes concisely in Bengali:',
        'expand': 'Explain the following notes in detail in Bengali:',
        'fix-grammar': 'Correct the grammar and spelling of the following notes in Bengali:',
        'key-points': 'Extract key points from the following notes in Bengali (use bullet points):'
    };

    try {
        const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `${prompts[action]}\n\n${text}`
                    }]
                }]
            })
        });

        const data = await response.json();
        
        // যদি ডাটাবেস বা কী-তে কোনো সমস্যা থাকে, তবে এখানে ধরা পড়বে
        if (data.error) {
            console.error("API Error:", data.error);
            responseBox.innerText = "API Error: " + data.error.message;
            return;
        }

        const result = data.candidates[0].content.parts[0].text;
        responseBox.innerText = result;
    } catch (e) {
        console.error("Fetch Error:", e);
        responseBox.innerText = "Error: API কানেক্ট করা যাচ্ছে না। দয়া করে আপনার ইন্টারনেট চেক করুন।";
    }
}

// ৪. ভয়েস টাইপিং
function startVoice() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'bn-BD';
    
    const btn = document.getElementById('voiceBtn');
    btn.innerText = "🔴 Listening...";
    
    recognition.onresult = (event) => {
        document.getElementById('userInput').value += event.results[0][0].transcript + " ";
        btn.innerText = "🎤 Voice Type";
    };
    
    recognition.onerror = () => { btn.innerText = "🎤 Voice Type"; };
    recognition.start();
}

// ৫. নোট ডাউনলোড করা
function downloadNote() {
    const title = document.getElementById('noteTitle').value || "My_Note";
    const content = document.getElementById('userInput').value;
    const ai = document.getElementById('aiResponse').innerText;

    const blob = new Blob([`Title: ${title}\n\nNote:\n${content}\n\nAI Insights:\n${ai}`], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${title}.txt`;
    a.click();
}

// ৬. রেজাল্ট কপি করা
function copyAIResult() {
    const text = document.getElementById('aiResponse').innerText;
    navigator.clipboard.writeText(text).then(() => alert("Copied to clipboard!"));
}