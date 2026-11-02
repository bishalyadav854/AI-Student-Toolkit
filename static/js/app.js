const tools = [
    ['01', 'Resume Builder', 'Create a professional resume', 'resume'],
    ['02', 'Notes Generator', 'Turn study text into structured notes', 'notes'],
    ['03', 'PPT Generator', 'Generate six presentation slides', 'ppt'],
    ['04', 'Mind Map', 'Visualize a syllabus hierarchy', 'mindmap'],
    ['05', 'Google Sheets', 'Read a live sheet as a web table', 'sheets'],
    ['06', 'AI Quiz', 'Generate and play MCQs', 'quiz'],
    ['07', 'Doubt Solver', 'Chat with a subject tutor', 'chat'],
    ['08', 'Flashcards', 'Create flip cards for revision', 'flashcards'],
    ['09', 'Study Planner', 'Build a seven-day study plan', 'planner'],
    ['10', 'Photo Summarizer', 'OCR notes and summarize them', 'ocr']
];

const nav = document.getElementById('nav');
const app = document.getElementById('app');
const title = document.getElementById('title');

let chatHistory = [];
let currentPptData = null;

function esc(v) {
    return String(v ?? '').replace(/[&<>"']/g, c => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    }[c]));
}

function toast(t) {
    let x = document.getElementById('toast');
    if (!x) return;
    x.textContent = t;
    x.style.display = 'block';
    setTimeout(() => {
        x.style.display = 'none';
    }, 2200);
}

async function ai(task, data) {
    let r = await fetch('/api/ai/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task, data })
    });
    let j = await r.json();
    if (!r.ok || j.error) throw Error(j.error || 'AI request failed');
    return j.result;
}

function makeNav(active = 'dashboard') {
    nav.innerHTML = '<button class="nav ' + (active === 'dashboard' ? 'active' : '') + '" onclick="openPage(\'dashboard\')">⌂ Dashboard</button>' +
        tools.map(t => `<button class="nav ${active === t[3] ? 'active' : ''}" onclick="openPage('${t[3]}')"><span>${t[0]}</span>${t[1]}</button>`).join('');
}

function openPage(id) {
    title.textContent = id === 'dashboard' ? 'Dashboard' : tools.find(x => x[3] === id)?.[1] || id;
    makeNav(id);
    render(id);
    window.scrollTo(0, 0);
}

function render(id) {
    if (id === 'dashboard') {
        app.innerHTML = `
            <section class="hero">
                <small class="eyebrow">ONE WEBSITE · TEN AI WORKFLOWS</small>
                <h2>Study smarter with <em>AI.</em></h2>
                <p class="muted">A single student workspace for resumes, notes, presentations, mind maps, quizzes, tutoring, flashcards, planning and OCR.</p>
            </section>
            <div class="grid">
                ${tools.map(t => `
                    <article class="tool" onclick="openPage('${t[3]}')">
                        <div class="num">${t[0]}</div>
                        <h3>${t[1]}</h3>
                        <p>${t[2]}</p>
                        <b>Open →</b>
                    </article>
                `).join('')}
            </div>
        `;
        return;
    }
    let fn = views[id];
    app.innerHTML = fn ? fn() : 'Not found';
}

const views = {
    resume: () => `
        <div class="layout">
            <div class="panel">
                <h2>ATS Resume Builder</h2>
                <input id="rn" placeholder="Full Name (e.g. Vishal Kumar Yadav)">
                <input id="rc" placeholder="Contact Info (Email | Phone | LinkedIn | GitHub)">
                <textarea id="ro" placeholder="Career Objective / Professional Summary..."></textarea>
                <textarea id="rs" placeholder="Technical Skills (e.g. Python, Django, React, AI/ML, PostgreSQL, Git)"></textarea>
                <textarea id="re" placeholder="Education (Degree, College/University, Years, Marks/GPA)"></textarea>
                <textarea id="rx" placeholder="Experience & Projects (Bullet points with technologies and impact)"></textarea>
                <button class="btn" onclick="generateResume()">Generate ATS Resume</button>
            </div>
            <div class="panel">
                <div class="headrow">
                    <h3>ATS Live Preview</h3>
                    <button class="btn alt" onclick="resumePdf()">Download PDF</button>
                </div>
                <div id="atsScoreContainer" style="display:none; margin: 14px 0; padding: 12px; border-radius: 8px; background: #151f32; border: 1px solid var(--line);">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <b style="color: var(--ok);">ATS Match Score: <span id="atsScoreValue">85%</span></b>
                        <small class="eyebrow" style="color: #79aaff;">COMPANY READY</small>
                    </div>
                    <div style="height: 6px; background: #243044; border-radius: 4px; margin-top: 8px; overflow: hidden;">
                        <div id="atsScoreBar" style="width: 85%; height: 100%; background: linear-gradient(90deg, var(--p), var(--ok)); transition: width 0.4s ease;"></div>
                    </div>
                </div>
                <div id="rr" class="result" style="background:#ffffff; color:#111111; padding:24px; border-radius:8px; font-family:'Times New Roman', serif; min-height:420px; box-shadow: 0 4px 15px rgba(0,0,0,0.3); overflow-x:auto;">
                    Fill in your details on the left and click "Generate ATS Resume" to produce your preview.
                </div>
            </div>
        </div>
    `,
    notes: () => `
        <div class="layout">
            <div class="panel">
                <h2>Notes Generator</h2>
                <textarea id="ni" class="big" placeholder="Paste textbook text, lecture notes or a topic..."></textarea>
                <button class="btn" onclick="notes()">Generate Notes</button>
            </div>
            <div class="panel">
                <div class="headrow">
                    <h3>Study Notes</h3>
                    <button class="btn alt" onclick="copy('nr')">Copy</button>
                </div>
                <div id="nr" class="result markdown">Generated notes will appear here.</div>
            </div>
        </div>
    `,
    ppt: () => `
        <div class="panel">
            <h2>PPT Generator</h2>
            <input id="pt" placeholder="Presentation topic (e.g. Artificial Intelligence in Healthcare)">
            <button class="btn" onclick="ppt()">Generate Slides</button>
        </div>
        <div id="pr"></div>
    `,
    mindmap: () => `
        <div class="panel">
            <h2>Syllabus Mind Map</h2>
            <textarea id="mi" class="big" placeholder="Paste your syllabus..."></textarea>
            <button class="btn" onclick="mind()">Generate Mind Map</button>
        </div>
        <div class="panel" id="mm">Mind map will appear here.</div>
    `,
    sheets: () => `
        <div class="panel">
            <h2>Google Sheets</h2>
            <p class="muted">Paste your deployed Apps Script Web App URL.</p>
            <input id="su" placeholder="https://script.google.com/macros/s/.../exec">
            <button class="btn" onclick="sheets()">Load Data</button>
        </div>
        <div class="panel" id="sr"></div>
    `,
    quiz: () => `
        <div class="panel">
            <h2>AI Quiz</h2>
            <textarea id="qi" class="big" placeholder="Paste notes or enter a topic..."></textarea>
            <button class="btn" onclick="quiz()">Generate Quiz</button>
        </div>
        <div id="qr"></div>
    `,
    chat: () => `
        <div class="panel chat">
            <div id="msgs" class="messages"></div>
            <div class="chatbar">
                <input id="cq" placeholder="Ask your doubt, request workflows or diagrams..." onkeydown="if(event.key==='Enter')chat()">
                <button class="btn" onclick="chat()">Send</button>
            </div>
        </div>
    `,
    flashcards: () => `
        <div class="panel">
            <h2>Flashcards</h2>
            <textarea id="fi" class="big" placeholder="Paste chapter notes..."></textarea>
            <button class="btn" onclick="flashcards()">Generate Cards</button>
        </div>
        <div id="fr" class="cards"></div>
    `,
    planner: () => `
        <div class="panel">
            <h2>Study Planner</h2>
            <input id="ps" placeholder="Subjects: DSA, DBMS, OS, AI">
            <input id="ph" placeholder="Hours available per day: 4">
            <input id="pd" placeholder="Exam dates / targets">
            <button class="btn" onclick="planner()">Generate Plan</button>
        </div>
        <div class="panel" id="pl"></div>
    `,
    ocr: () => `
        <div class="panel">
            <h2>Photo Notes Summarizer</h2>
            <input type="file" id="oi" accept="image/*" onchange="ocr()">
            <p id="op" class="muted"></p>
            <textarea id="ot" class="big" placeholder="OCR text will appear here; edit it before summarizing."></textarea>
            <button class="btn" onclick="ocrSummary()">Summarize with Gemini</button>
        </div>
        <div class="panel">
            <div id="os" class="result markdown"></div>
        </div>
    `
};

async function generateResume() {
    let b = document.getElementById('rr');
    b.textContent = 'Generating ATS formatted resume...';
    try {
        let resumePayload = {
            name: document.getElementById('rn').value,
            contact: document.getElementById('rc').value,
            objective: document.getElementById('ro').value,
            skills: document.getElementById('rs').value,
            education: document.getElementById('re').value,
            experience: document.getElementById('rx').value
        };

        let aiResult = await ai('resume', resumePayload);

        let score = 70;
        if (resumePayload.name.trim()) score += 5;
        if (resumePayload.contact.includes('@') || resumePayload.contact.includes('linkedin')) score += 10;
        if (resumePayload.skills.length > 25) score += 8;
        if (resumePayload.experience.length > 40) score += 5;
        score = Math.min(score, 98);

        let scoreContainer = document.getElementById('atsScoreContainer');
        if (scoreContainer) {
            scoreContainer.style.display = 'block';
            document.getElementById('atsScoreValue').textContent = score + '%';
            document.getElementById('atsScoreBar').style.width = score + '%';
        }

        b.innerHTML = `
            <div style="text-align: center; border-bottom: 2px solid #222; padding-bottom: 8px; margin-bottom: 14px;">
                <h1 style="margin: 0; font-size: 22px; color: #111; text-transform: uppercase; font-family:'Times New Roman', serif;">${esc(resumePayload.name || 'YOUR NAME')}</h1>
                <p style="margin: 4px 0 0; font-size: 13px; color: #333;">${esc(resumePayload.contact || 'email@example.com | +91 9876543210 | linkedin.com/in/profile')}</p>
            </div>
            
            <div style="margin-bottom: 12px;">
                <h3 style="margin: 0 0 4px; font-size: 14px; text-transform: uppercase; border-bottom: 1px solid #444; color: #111; letter-spacing: 0.5px;">Professional Summary</h3>
                <p style="margin: 0; font-size: 12.5px; color: #222; line-height: 1.5;">${esc(resumePayload.objective || 'Goal-driven engineer passionate about building reliable software and machine learning applications.')}</p>
            </div>

            <div style="margin-bottom: 12px;">
                <h3 style="margin: 0 0 4px; font-size: 14px; text-transform: uppercase; border-bottom: 1px solid #444; color: #111; letter-spacing: 0.5px;">Technical Skills</h3>
                <p style="margin: 0; font-size: 12.5px; color: #222; line-height: 1.5;">${esc(resumePayload.skills || 'Python, JavaScript, Django, SQL, Git, REST APIs')}</p>
            </div>

            <div style="margin-bottom: 12px;">
                <h3 style="margin: 0 0 4px; font-size: 14px; text-transform: uppercase; border-bottom: 1px solid #444; color: #111; letter-spacing: 0.5px;">Projects & Experience</h3>
                <div style="font-size: 12.5px; color: #222; line-height: 1.5; white-space: pre-wrap;">${esc(resumePayload.experience || aiResult)}</div>
            </div>

            <div style="margin-bottom: 12px;">
                <h3 style="margin: 0 0 4px; font-size: 14px; text-transform: uppercase; border-bottom: 1px solid #444; color: #111; letter-spacing: 0.5px;">Education</h3>
                <p style="margin: 0; font-size: 12.5px; color: #222; line-height: 1.5;">${esc(resumePayload.education || 'Bachelor of Technology in Computer Science & Engineering')}</p>
            </div>
        `;
    } catch (e) {
        b.textContent = e.message;
    }
}

function resumePdf() {
    let target = document.getElementById('rr');
    if (!target) return;
    let { jsPDF } = window.jspdf;
    let d = new jsPDF({
        unit: 'pt',
        format: 'a4'
    });
    let text = target.innerText;
    let split = d.splitTextToSize(text, 520);
    d.setFont('times', 'normal');
    d.setFontSize(11);
    d.text(split, 40, 50);
    d.save('StudentAI-Resume.pdf');
}

async function notes() {
    let b = document.getElementById('nr');
    b.textContent = 'Generating...';
    try {
        b.innerHTML = marked.parse(await ai('notes', { text: document.getElementById('ni').value }));
    } catch (e) {
        b.textContent = e.message;
    }
}

async function ppt() {
    let b = document.getElementById('pr');
    let topic = document.getElementById('pt').value.trim();
    if (!topic) {
        toast('Please enter a presentation topic');
        return;
    }
    b.innerHTML = '<p class="muted">Generating slides with Gemini...</p>';
    try {
        let r = await ai('ppt', { topic: topic });
        currentPptData = r;

        b.innerHTML = r.slides.map((s, i) => `
            <div class="slide">
                <small class="eyebrow">SLIDE ${i + 1}</small>
                <h2>${esc(s.title)}</h2>
                <ul>${s.bullets.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
            </div>
        `).join('') + `<button class="btn" id="downloadPptBtn" onclick="triggerPptDownload()">Download PPTX</button>`;
    } catch (e) {
        b.textContent = e.message;
    }
}

async function triggerPptDownload() {
    if (!currentPptData || !currentPptData.slides) {
        toast('No presentation slides found to download.');
        return;
    }

    let PptxConstructor = window.pptxgen || (window.PptxGenJS ? window.PptxGenJS : null);
    if (!PptxConstructor) {
        toast('PPT generation library is loading. Please wait 2 seconds.');
        return;
    }

    try {
        let p = new PptxConstructor();
        p.layout = 'LAYOUT_WIDE';

        currentPptData.slides.forEach((s, idx) => {
            let slide = p.addSlide();
            slide.background = { color: '080D17' };

            slide.addText(`SLIDE ${idx + 1}`, {
                x: 0.8,
                y: 0.5,
                w: 11.5,
                h: 0.3,
                fontSize: 10,
                color: '78AAFF',
                bold: true
            });

            slide.addText(s.title, {
                x: 0.8,
                y: 0.8,
                w: 11.5,
                h: 0.8,
                fontSize: 24,
                bold: true,
                color: 'FFFFFF'
            });

            slide.addText(s.bullets.map(v => '•  ' + v).join('\n\n'), {
                x: 1.0,
                y: 1.8,
                w: 11.0,
                h: 4.5,
                fontSize: 15,
                color: 'DFE6F1',
                lineSpacing: 24
            });
        });

        let topicName = (document.getElementById('pt')?.value.trim() || 'AI_Presentation').replace(/[^a-zA-Z0-9_-]/g, '_');
        await p.writeFile({ fileName: `${topicName}.pptx` });
        toast('PPTX downloaded successfully!');
    } catch (err) {
        console.error(err);
        toast('Failed to export PPT: ' + err.message);
    }
}

async function mind() {
    let b = document.getElementById('mm');
    b.textContent = 'Generating...';
    try {
        let r = await ai('mindmap', { text: document.getElementById('mi').value });
        let g = 'mindmap\n  root((' + r.title + '))\n' + r.branches.map(x => '    ' + x.name + '\n' + x.children.map(c => '      ' + c).join('\n')).join('\n');
        b.innerHTML = '<pre class="mermaid">' + g + '</pre>';
        if (window.mermaid) {
            mermaid.initialize({ startOnLoad: false, theme: 'dark' });
            await mermaid.run();
        }
    } catch (e) {
        b.textContent = e.message;
    }
}

async function sheets() {
    let b = document.getElementById('sr');
    b.textContent = 'Loading...';
    try {
        let r = await fetch(document.getElementById('su').value);
        let d = await r.json();
        if (!d.length) {
            b.textContent = 'No rows found.';
            return;
        }
        let h = Object.keys(d[0]);
        b.innerHTML = '<table class="table"><thead><tr>' + h.map(x => '<th>' + esc(x) + '</th>').join('') + '</tr></thead><tbody>' + d.map(row => '<tr>' + h.map(x => '<td>' + esc(row[x]) + '</td>').join('') + '</tr>').join('') + '</tbody></table>';
    } catch (e) {
        b.textContent = 'Could not load sheet: ' + e.message;
    }
}

async function quiz() {
    let b = document.getElementById('qr');
    b.innerHTML = 'Generating...';
    try {
        let r = await ai('quiz', { text: document.getElementById('qi').value });
        b.innerHTML = r.questions.map((q, i) => `
            <div class="quiz">
                <h3>${i + 1}. ${esc(q.question)}</h3>
                ${q.options.map((o, j) => `<button class="option" onclick="answer(this,${j},${q.answer})">${esc(o)}</button>`).join('')}
                <p class="muted">${esc(q.explanation)}</p>
            </div>
        `).join('');
    } catch (e) {
        b.textContent = e.message;
    }
}

function answer(btn, j, a) {
    let card = btn.parentElement;
    if (card.dataset.done) return;
    card.dataset.done = '1';
    card.querySelectorAll('.option').forEach((x, i) => {
        if (i === a) x.classList.add('correct');
    });
    if (j !== a) btn.classList.add('wrong');
}

async function chat() {
    let qElem = document.getElementById('cq');
    let q = qElem.value.trim();
    if (!q) return;

    addMsg('user', q);
    qElem.value = '';

    try {
        let r = await ai('chat', {
            question: q,
            subject: 'Computer Science & Engineering',
            history: chatHistory
        });

        chatHistory.push({ role: 'student', content: q }, { role: 'tutor', content: r });
        await addMsg('ai', r);
    } catch (e) {
        await addMsg('ai', 'Error: ' + e.message);
    }
}

async function addMsg(role, text) {
    let b = document.getElementById('msgs');
    if (!b) return;

    let x = document.createElement('div');
    x.className = 'msg ' + (role === 'user' ? 'user' : 'markdown');

    if (role === 'user') {
        x.textContent = text;
        b.appendChild(x);
    } else {
        x.innerHTML = marked.parse(text);
        b.appendChild(x);

        let mermaidCodeBlocks = x.querySelectorAll('code.language-mermaid, pre code.language-mermaid');

        for (let i = 0; i < mermaidCodeBlocks.length; i++) {
            let codeElem = mermaidCodeBlocks[i];
            let rawCode = codeElem.textContent.trim();
            let parentPre = codeElem.closest('pre') || codeElem;

            let diagramDiv = document.createElement('div');
            diagramDiv.className = 'mermaid-container';
            diagramDiv.style.margin = '16px 0';
            diagramDiv.style.textAlign = 'center';
            diagramDiv.style.overflowX = 'auto';

            if (window.mermaid) {
                try {
                    mermaid.initialize({
                        startOnLoad: false,
                        theme: 'dark',
                        securityLevel: 'loose'
                    });

                    let uniqueId = 'mermaid-svg-' + Date.now() + '-' + i;
                    let { svg } = await mermaid.render(uniqueId, rawCode);
                    diagramDiv.innerHTML = svg;
                    parentPre.replaceWith(diagramDiv);
                } catch (err) {
                    console.error("Mermaid Render Error:", err);
                    diagramDiv.innerHTML = `<pre class="mermaid" style="color:#ff6b6b; background:#1b1018; padding:10px; border-radius:8px;">${esc(rawCode)}</pre>`;
                    parentPre.replaceWith(diagramDiv);
                }
            }
        }
    }

    b.scrollTop = b.scrollHeight;
}

async function flashcards() {
    let b = document.getElementById('fr');
    b.innerHTML = 'Generating...';
    try {
        let r = await ai('flashcards', { text: document.getElementById('fi').value });
        b.innerHTML = r.cards.map(c => `
            <div class="flash" onclick="this.classList.toggle('flip')">
                <div class="inner">
                    <div class="front">
                        <small class="eyebrow">QUESTION</small>
                        <h3>${esc(c.question)}</h3>
                    </div>
                    <div class="back">
                        <small class="eyebrow">ANSWER</small>
                        <p>${esc(c.answer)}</p>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (e) {
        b.textContent = e.message;
    }
}

async function planner() {
    let b = document.getElementById('pl');
    b.textContent = 'Generating...';
    try {
        let r = await ai('planner', {
            subjects: document.getElementById('ps').value,
            hours: document.getElementById('ph').value,
            dates: document.getElementById('pd').value
        });
        b.innerHTML = '<table class="table"><tr><th>Day</th><th>Time</th><th>Subject</th><th>Activity</th></tr>' +
            r.schedule.map(x => `<tr><td>${esc(x.day)}</td><td>${esc(x.time)}</td><td>${esc(x.subject)}</td><td>${esc(x.activity)}</td></tr>`).join('') +
            '</table>';
    } catch (e) {
        b.textContent = e.message;
    }
}

async function ocr() {
    let fileInput = document.getElementById('oi');
    let f = fileInput.files[0];
    if (!f) return;
    let p = document.getElementById('op');
    try {
        let r = await Tesseract.recognize(f, 'eng', {
            logger: m => {
                if (m.status === 'recognizing text') {
                    p.textContent = 'OCR ' + Math.round(m.progress * 100) + '%';
                }
            }
        });
        document.getElementById('ot').value = r.data.text;
        p.textContent = 'OCR complete. Review/edit the text, then summarize.';
    } catch (e) {
        p.textContent = e.message;
    }
}

async function ocrSummary() {
    let b = document.getElementById('os');
    b.textContent = 'Summarizing...';
    try {
        b.innerHTML = marked.parse(await ai('notes', { text: document.getElementById('ot').value }));
    } catch (e) {
        b.textContent = e.message;
    }
}

function copy(id) {
    let el = document.getElementById(id);
    if (!el) return;
    navigator.clipboard.writeText(el.innerText);
    toast('Copied');
}

makeNav();
render('dashboard');

document.addEventListener("DOMContentLoaded", function () {
    const button = document.getElementById("mobileMenuToggle");
    const navMenu = document.getElementById("nav");

    if (!button || !navMenu) return;

    button.addEventListener("click", function (e) {
        e.stopPropagation();

        if (window.innerWidth > 850) {
            document.body.classList.toggle("sidebar-collapsed");
        } else {
            const isOpen = navMenu.classList.toggle("mobile-nav-open");
            button.classList.toggle("active", isOpen);
            button.setAttribute("aria-expanded", String(isOpen));
            button.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
        }
    });

    navMenu.addEventListener("click", function (event) {
        if (event.target.closest(".nav")) {
            navMenu.classList.remove("mobile-nav-open");
            button.classList.remove("active");
            button.setAttribute("aria-expanded", "false");
            button.setAttribute("aria-label", "Open navigation menu");
        }
    });

    document.addEventListener("click", function (event) {
        if (!navMenu.contains(event.target) && !button.contains(event.target) && navMenu.classList.contains("mobile-nav-open")) {
            navMenu.classList.remove("mobile-nav-open");
            button.classList.remove("active");
            button.setAttribute("aria-expanded", "false");
            button.setAttribute("aria-label", "Open navigation menu");
        }
    });
});