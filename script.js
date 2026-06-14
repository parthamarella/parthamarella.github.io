/* ==========================================================================
   INTERACTIVE SCRIPTING - PARTHA MARELLA PORTFOLIO
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Scroll Progress Indicator
    const progressBar = document.getElementById("scroll-progress-bar");
    window.addEventListener("scroll", () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0) {
            const progress = (window.scrollY / totalHeight) * 100;
            progressBar.style.width = `${progress}%`;
        }
    });

    // Handle Scroll Header shadow & blur
    const header = document.getElementById("site-header");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.style.backgroundColor = "rgba(0, 0, 0, 0.85)";
            header.style.borderBottomColor = "rgba(255, 255, 255, 0.1)";
        } else {
            header.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
            header.style.borderBottomColor = "rgba(255, 255, 255, 0.05)";
        }
    });

    /* ==========================================================================
       HERO BACKGROUND CANVAS PARTICLE SYSTEM
       ========================================================================== */
    const heroCanvas = document.getElementById("hero-canvas");
    const heroCtx = heroCanvas.getContext("2d");
    let heroParticles = [];
    let heroMouse = { x: null, y: null, radius: 150 };

    function resizeHeroCanvas() {
        heroCanvas.width = heroCanvas.parentElement.clientWidth;
        heroCanvas.height = heroCanvas.parentElement.clientHeight;
    }
    resizeHeroCanvas();
    window.addEventListener("resize", resizeHeroCanvas);

    heroCanvas.addEventListener("mousemove", (e) => {
        const rect = heroCanvas.getBoundingClientRect();
        heroMouse.x = e.clientX - rect.left;
        heroMouse.y = e.clientY - rect.top;
    });

    heroCanvas.addEventListener("mouseleave", () => {
        heroMouse.x = null;
        heroMouse.y = null;
    });

    class HeroParticle {
        constructor() {
            this.x = Math.random() * heroCanvas.width;
            this.y = Math.random() * heroCanvas.height;
            this.size = Math.random() * 2 + 1;
            this.baseX = this.x;
            this.baseY = this.y;
            this.density = (Math.random() * 30) + 10;
            this.speedX = (Math.random() * 0.4) - 0.2;
            this.speedY = (Math.random() * 0.4) - 0.2;
        }

        update() {
            // Drift slightly
            this.x += this.speedX;
            this.y += this.speedY;

            // Bounce on boundaries
            if (this.x < 0 || this.x > heroCanvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > heroCanvas.height) this.speedY *= -1;

            // Mouse interaction (push away)
            if (heroMouse.x !== null && heroMouse.y !== null) {
                let dx = heroMouse.x - this.x;
                let dy = heroMouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < heroMouse.radius) {
                    let force = (heroMouse.radius - distance) / heroMouse.radius;
                    let directionX = dx / distance;
                    let directionY = dy / distance;
                    this.x -= directionX * force * 5;
                    this.y -= directionY * force * 5;
                }
            }
        }

        draw() {
            heroCtx.fillStyle = "rgba(255, 255, 255, 0.4)";
            heroCtx.beginPath();
            heroCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            heroCtx.closePath();
            heroCtx.fill();
        }
    }

    function initHeroParticles() {
        heroParticles = [];
        const count = Math.min(60, Math.floor(heroCanvas.width / 20));
        for (let i = 0; i < count; i++) {
            heroParticles.push(new HeroParticle());
        }
    }
    initHeroParticles();

    function animateHeroBackground() {
        heroCtx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
        
        // Draw connection lines
        for (let i = 0; i < heroParticles.length; i++) {
            for (let j = i + 1; j < heroParticles.length; j++) {
                let dx = heroParticles[i].x - heroParticles[j].x;
                let dy = heroParticles[i].y - heroParticles[j].y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 120) {
                    let opacity = (120 - dist) / 120 * 0.15;
                    heroCtx.strokeStyle = `rgba(0, 113, 227, ${opacity})`;
                    heroCtx.lineWidth = 0.8;
                    heroCtx.beginPath();
                    heroCtx.moveTo(heroParticles[i].x, heroParticles[i].y);
                    heroCtx.lineTo(heroParticles[j].x, heroParticles[j].y);
                    heroCtx.stroke();
                }
            }
        }

        heroParticles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animateHeroBackground);
    }
    animateHeroBackground();

    /* ==========================================================================
       GSAP SCROLL TRIGGER ANIMATIONS
       ========================================================================== */
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Section 1 - Hero Entrance Animations
        const heroTimeline = gsap.timeline();
        heroTimeline
            .to(".hero-title", { opacity: 1, y: 0, duration: 1, ease: "power4.out" })
            .to(".hero-tagline", { opacity: 1, y: 0, duration: 1, ease: "power4.out" }, "-=0.7")
            .to(".hero-roles", { opacity: 1, y: 0, duration: 0.8, ease: "power4.out" }, "-=0.7")
            .to(".hero-cta", { opacity: 1, y: 0, duration: 0.8, ease: "power4.out" }, "-=0.6")
            .to(".scroll-indicator", { opacity: 0.7, duration: 0.5 }, "-=0.2");

        // Section 2 - About Me: Bio paragraph scroll-reveal highlight
        const aboutParas = gsap.utils.toArray(".scroll-reveal-text");
        aboutParas.forEach((para) => {
            gsap.fromTo(para, 
                { color: "rgba(161, 161, 170, 0.15)" }, 
                {
                    color: "rgba(255, 255, 255, 1)",
                    scrollTrigger: {
                        trigger: para,
                        start: "top 80%",
                        end: "top 50%",
                        scrub: true,
                    }
                }
            );
        });

        // About section highlight cards stagger in
        const highlightCards = gsap.utils.toArray(".about-highlight-card");
        highlightCards.forEach((card, i) => {
            gsap.from(card, {
                x: 30,
                opacity: 0,
                duration: 0.7,
                delay: i * 0.1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: "#about",
                    start: "top 70%",
                    toggleActions: "play none none reverse"
                }
            });
        });

        // Section 3 - Experience cards slide up
        const expCards = gsap.utils.toArray(".exp-card");
        expCards.forEach((card, i) => {
            gsap.from(card, {
                y: 60,
                opacity: 0,
                duration: 0.9,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: card,
                    start: "top 88%",
                    toggleActions: "play none none reverse"
                }
            });
        });

        // Section 4 - Education cards slide up
        const eduCards2 = gsap.utils.toArray(".education-card");
        eduCards2.forEach((card, i) => {
            gsap.from(card, {
                y: 40,
                opacity: 0,
                duration: 0.8,
                delay: i * 0.12,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: "#education",
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            });
        });

        // Section 5 - Projects Card Reveal (slide up)
        const productCards = gsap.utils.toArray(".product-card");
        productCards.forEach((card) => {
            gsap.from(card, {
                y: 100,
                opacity: 0,
                scale: 0.95,
                duration: 1.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            });
        });

        // Section 7 - Impact Metrics Number Counter Trigger
        ScrollTrigger.create({
            trigger: "#impact",
            start: "top 75%",
            onEnter: () => animateMetrics()
        });

        // Testimonials marquee wrapper slide up
        const marqueeWrapper = document.querySelector(".testimonials-marquee-wrapper");
        if (marqueeWrapper) {
            gsap.from(marqueeWrapper, {
                y: 50,
                opacity: 0,
                duration: 1,
                scrollTrigger: {
                    trigger: marqueeWrapper,
                    start: "top 90%",
                    toggleActions: "play none none reverse"
                }
            });
        }
    }

    /* ==========================================================================
       INTERACTIVE PROJECTS LOGIC
       ========================================================================== */

    // 1. Starburst AI Portal Simulation (Text-to-SQL Chat Demo)
    const chatThread = document.getElementById("chat-thread-content");
    const sqlCard = document.getElementById("card-sql");

    const sqlChatSessions = {
        sales: {
            prompt: "Show me monthly sales growth for 2025",
            sql: "<span>SELECT</span> DATE_TRUNC('month', date) <span>AS</span> month,<br>       <span>SUM</span>(sales_amount) <span>AS</span> revenue<br><span>FROM</span> transactions<br><span>WHERE</span> year = 2025<br><span>GROUP BY</span> 1 <span>ORDER BY</span> 1;",
            time: "12ms",
            chartTitle: "Monthly Sales Growth ($)",
            chartBars: [
                { label: "Jan", val: "$45.2K", pct: 45, color: "" },
                { label: "Feb", val: "$52.1K", pct: 52, color: "" },
                { label: "Mar", val: "$61.8K", pct: 61, color: "" },
                { label: "Apr", val: "$58.4K", pct: 58, color: "" },
                { label: "May", val: "$68.9K", pct: 68, color: "" },
                { label: "Jun", val: "$74.1K", pct: 74, color: "" }
            ],
            insight: "<ul><li style=\"margin-left: 15px; margin-bottom: 2px;\">Revenue shows a steady upward trajectory, growing from $45.2K in January to $74.1K in June.</li><li style=\"margin-left: 15px;\">The 64% total growth is driven primarily by the Q2 marketing campaign.</li></ul>"
        },
        users: {
            prompt: "Find count of active monthly users",
            sql: "<span>SELECT</span> DATE_TRUNC('month', login_time) <span>AS</span> month,<br>       <span>COUNT</span>(<span>DISTINCT</span> user_id) <span>AS</span> active_users<br><span>FROM</span> user_sessions<br><span>WHERE</span> status = 'active'<br><span>GROUP BY</span> 1 <span>ORDER BY</span> 1;",
            time: "8ms",
            chartTitle: "Quarterly Active Users (MAU)",
            chartBars: [
                { label: "Q1", val: "120K", pct: 57, color: "purple" },
                { label: "Q2", val: "145K", pct: 69, color: "purple" },
                { label: "Q3", val: "190K", pct: 90, color: "purple" },
                { label: "Q4", val: "210K", pct: 100, color: "purple" }
            ],
            insight: "<ul><li style=\"margin-left: 15px; margin-bottom: 2px;\">Monthly active users (MAU) breached the 200K threshold in Q4.</li><li style=\"margin-left: 15px;\">Registered a 75% year-over-year expansion compared to Q1.</li></ul>"
        },
        products: {
            prompt: "List top 3 products by total revenue",
            sql: "<span>SELECT</span> p.product_name,<br>       <span>SUM</span>(o.quantity * o.unit_price) <span>AS</span> revenue<br><span>FROM</span> order_items o<br><span>JOIN</span> products p <span>ON</span> o.product_id = p.id<br><span>GROUP BY</span> 1 <span>ORDER BY</span> 2 <span>DESC</span> <span>LIMIT</span> 3;",
            time: "18ms",
            chartTitle: "Top Product Revenues ($)",
            chartBars: [
                { label: "Agent", val: "$1.2M", pct: 100, color: "green" },
                { label: "Gateway", val: "$850K", pct: 70, color: "green" },
                { label: "Mesh", val: "$420K", pct: 35, color: "green" }
            ],
            insight: "<ul><li style=\"margin-left: 15px; margin-bottom: 2px;\">The GenAI Enterprise Agent is the primary revenue driver at $1.2M.</li><li style=\"margin-left: 15px;\">Accounting for 48% of total catalog product sales.</li></ul>"
        }
    };

    let chatTimeouts = [];
    function addChatTimeout(fn, ms) {
        chatTimeouts.push(setTimeout(fn, ms));
    }
    
    function clearAllChatTimeouts() {
        chatTimeouts.forEach(clearTimeout);
        chatTimeouts = [];
    }

    function scrollToBottom() {
        if (chatThread) {
            requestAnimationFrame(() => {
                chatThread.scrollTop = chatThread.scrollHeight;
            });
        }
    }

    function scrollToElement(element) {
        if (chatThread && element) {
            requestAnimationFrame(() => {
                const elementTop = element.getBoundingClientRect().top;
                const containerTop = chatThread.getBoundingClientRect().top;
                const relativeTop = elementTop - containerTop + chatThread.scrollTop;
                
                chatThread.scrollTo({
                    top: relativeTop - 10,
                    behavior: "smooth"
                });
            });
        }
    }

    const inputSpan = document.getElementById("chat-input-span");

    function typeUserQuestion(text, onComplete) {
        if (!inputSpan) {
            const msg = appendUserMessage(text);
            if (onComplete) onComplete(msg);
            return;
        }

        // Set typing font color to active and reset text
        inputSpan.style.color = "#ffffff";
        inputSpan.style.opacity = "1";
        inputSpan.textContent = "";

        let charIdx = 0;
        function typeChar() {
            if (charIdx < text.length) {
                inputSpan.textContent = text.slice(0, charIdx + 1) + "▊";
                charIdx++;
                const delay = 25 + Math.random() * 30; // realistic variable typing speed
                setTimeout(typeChar, delay);
            } else {
                inputSpan.textContent = text;
                
                // Pause slightly at completion, then send it into the chat history
                setTimeout(() => {
                    inputSpan.style.color = "";
                    inputSpan.style.opacity = "";
                    inputSpan.textContent = "Ask Starburst Agent...";
                    
                    const msg = appendUserMessage(text);
                    if (onComplete) onComplete(msg);
                }, 300);
            }
        }
        typeChar();
    }

    function appendUserMessage(text) {
        if (!chatThread) return null;
        const msg = document.createElement("div");
        msg.className = "chat-message user";
        msg.innerHTML = `
            <span class="message-sender">User</span>
            <div class="message-bubble">${text}</div>
        `;
        chatThread.appendChild(msg);
        
        setTimeout(() => {
            scrollToElement(msg);
        }, 100);
        return msg;
    }

    let activeIndicator = null;
    function showTypingIndicator(userMsgEl) {
        if (!chatThread) return;
        removeTypingIndicator();
        const wrapper = document.createElement("div");
        wrapper.className = "typing-indicator-wrapper";
        wrapper.id = "active-typing-indicator";
        wrapper.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        chatThread.appendChild(wrapper);
        activeIndicator = wrapper;
        
        setTimeout(() => {
            if (userMsgEl) {
                scrollToElement(userMsgEl);
            } else {
                scrollToBottom();
            }
        }, 100);
    }

    function removeTypingIndicator() {
        if (activeIndicator && activeIndicator.parentNode) {
            activeIndicator.parentNode.removeChild(activeIndicator);
        }
        activeIndicator = null;
    }

    function appendAgentMessage(queryKey, userMsgEl) {
        if (!chatThread) return;
        const data = sqlChatSessions[queryKey];
        if (!data) return;

        // Update persona tag dynamically
        let personaName = "Executive VP";
        let personaColor = "#0071E3";
        if (queryKey === "users") {
            personaName = "Product VP";
            personaColor = "#8b5cf6";
        } else if (queryKey === "products") {
            personaName = "Pricing Manager";
            personaColor = "#10b981";
        }
        
        const personaTag = document.getElementById("portal-persona-tag");
        if (personaTag) {
            personaTag.textContent = `Persona: ${personaName}`;
            personaTag.style.color = personaColor;
            personaTag.style.borderColor = personaColor + "33";
        }

        let barsHtml = "";
        data.chartBars.forEach(b => {
            barsHtml += `
                <div class="chart-row">
                     <span class="chart-label">${b.label}</span>
                     <div class="chart-bar-wrapper">
                         <div class="chart-bar-fill ${b.color}" data-width="${b.pct}"></div>
                     </div>
                     <span class="chart-value">${b.val}</span>
                </div>
            `;
        });

        const msg = document.createElement("div");
        msg.className = "chat-message agent";
        msg.innerHTML = `
            <span class="message-sender">Starburst AI Agent</span>
            <div class="message-bubble">
                <div class="bubble-section">
                    <span class="bubble-section-label">Compiled Starburst SQL</span>
                    <pre class="sql-code-block"><code>${data.sql}</code></pre>
                </div>
                <div class="bubble-section">
                    <span class="bubble-section-label">Real-time Visualization</span>
                    <div class="chart-container">
                        <div class="chart-title">${data.chartTitle}</div>
                        <div class="chart-bars-list">
                            ${barsHtml}
                        </div>
                    </div>
                </div>
                <div class="bubble-section">
                    <span class="bubble-section-label">Semantic Insight</span>
                    <div class="ai-insight">${data.insight}</div>
                </div>
                <div class="panel-section-metadata" style="margin-top: 0; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.03);">
                    <div><span>Access:</span> <span class="meta-badge success">PASSED</span></div>
                    <div><span>Audit Log:</span> <span>RECORDED</span></div>
                    <div><span>Latency:</span> <span>${data.time}</span></div>
                </div>
            </div>
        `;
        chatThread.appendChild(msg);

        // Animate chart bars after DOM rendering
        requestAnimationFrame(() => {
            const fills = msg.querySelectorAll(".chart-bar-fill");
            fills.forEach(f => {
                const pct = f.getAttribute("data-width");
                f.style.width = `${pct}%`;
            });
        });
        
        setTimeout(() => {
            if (userMsgEl) {
                scrollToElement(userMsgEl);
            } else {
                scrollToBottom();
            }
        }, 100);
    }

    function startChatSimulation() {
        if (!chatThread) return;
        clearAllChatTimeouts();
        
        chatThread.style.opacity = "1";
        chatThread.innerHTML = "";
        
        // Greeting from agent
        const greeting = document.createElement("div");
        greeting.className = "chat-message agent";
        greeting.innerHTML = `
            <span class="message-sender">Starburst AI Agent</span>
            <div class="message-bubble">
                Hello! I am your Text-to-SQL Starburst Agent. I compile natural language queries into production-safe database commands. Ask me a question, or watch me process live query threads.
            </div>
        `;
        chatThread.appendChild(greeting);
        
        setTimeout(() => {
            scrollToBottom();
        }, 50);

        let userMsg1, userMsg2, userMsg3;

        // 1st Query: Sales
        addChatTimeout(() => {
            typeUserQuestion("Show me monthly sales growth for 2025", (msg) => {
                userMsg1 = msg;
                showTypingIndicator(userMsg1);
                
                addChatTimeout(() => {
                    removeTypingIndicator();
                    appendAgentMessage("sales", userMsg1);
                }, 1500);
            });
        }, 2000);

        // 2nd Query: Users
        addChatTimeout(() => {
            typeUserQuestion("Find count of active monthly users", (msg) => {
                userMsg2 = msg;
                showTypingIndicator(userMsg2);
                
                addChatTimeout(() => {
                    removeTypingIndicator();
                    appendAgentMessage("users", userMsg2);
                }, 1500);
            });
        }, 12500);

        // 3rd Query: Products
        addChatTimeout(() => {
            typeUserQuestion("List top 3 products by total revenue", (msg) => {
                userMsg3 = msg;
                showTypingIndicator(userMsg3);
                
                addChatTimeout(() => {
                    removeTypingIndicator();
                    appendAgentMessage("products", userMsg3);
                }, 1500);
            });
        }, 23500);

        // Loop reset
        addChatTimeout(() => {
            chatThread.style.transition = "opacity 0.8s ease";
            chatThread.style.opacity = "0";
            
            addChatTimeout(() => {
                chatThread.innerHTML = "";
                chatThread.style.opacity = "1";
                startChatSimulation();
            }, 800);
        }, 34000);
    }

    // Observer to run/pause simulation based on visibility
    let chatActive = false;
    const chatObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !chatActive) {
                chatActive = true;
                startChatSimulation();
            } else if (!entry.isIntersecting && chatActive) {
                clearAllChatTimeouts();
                removeTypingIndicator();
                chatActive = false;
            }
        });
    }, { threshold: 0.15 });

    if (sqlCard) chatObserver.observe(sqlCard);

    // ==========================================================================
    // 2. DOCUMENT CLUSTERING IN MOTION (SCROLL-DRIVEN MOTION GRAPHIC)
    // ==========================================================================
    const clusterCanvas = document.getElementById("topic-cluster-canvas");
    const clusterCtx = clusterCanvas ? clusterCanvas.getContext("2d") : null;
    
    if (clusterCanvas && clusterCtx) {
        let videoProgress = 0; // 0 to 100 (maps to scroll progress)
        let particles = [];
        const particleCount = 180;
        
        // Define cluster centroids (fractions of width/height)
        const centroids = [
            { xPct: 0.25, yPct: 0.35, color: "rgba(0, 113, 227, 0.8)", name: "Financial Audits", rgb: [0, 113, 227] },
            { xPct: 0.75, yPct: 0.30, color: "rgba(139, 92, 246, 0.8)", name: "Legal Contracts", rgb: [139, 92, 246] },
            { xPct: 0.30, yPct: 0.70, color: "rgba(16, 185, 129, 0.8)", name: "Operations Logs", rgb: [16, 185, 129] },
            { xPct: 0.72, yPct: 0.70, color: "rgba(255, 159, 10, 0.8)", name: "GenAI System Prompts", rgb: [255, 159, 10] }
        ];

        function resizeClusterCanvas() {
            const rect = clusterCanvas.parentElement.getBoundingClientRect();
            clusterCanvas.width = rect.width || 450;
            clusterCanvas.height = 480;
        }
        
        function initClusterParticles() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                const clusterIdx = Math.floor(Math.random() * centroids.length);
                
                // Random scatter position
                const scatteredXPct = 0.08 + Math.random() * 0.84;
                const scatteredYPct = 0.08 + Math.random() * 0.84;
                
                // Target cluster offsets
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.sqrt(Math.random()) * 52 + 8; // denser towards center
                const offsetX = Math.cos(angle) * distance;
                const offsetY = Math.sin(angle) * distance;

                particles.push({
                    clusterIndex: clusterIdx,
                    scatteredXPct,
                    scatteredYPct,
                    offsetX,
                    offsetY,
                    radius: Math.random() * 2 + 1.2,
                    noiseOffsetX: Math.random() * 100,
                    noiseOffsetY: Math.random() * 100
                });
            }
        }

        resizeClusterCanvas();
        initClusterParticles();
        window.addEventListener("resize", () => {
            resizeClusterCanvas();
        });

        // Cubic Easing
        function easeInOutCubic(x) {
            return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
        }

        // GSAP ScrollTrigger to tie scroll position of the card directly to clustering progress
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            const scrollState = { progress: 0 };
            gsap.to(scrollState, {
                progress: 100,
                ease: "none",
                scrollTrigger: {
                    trigger: "#card-topic",
                    start: "top 85%",    // Starts assembling as top enters 85% of screen
                    end: "center 40%",  // Completes when center reaches 40% of screen
                    scrub: 1.2,          // Fluid scrubbing lag (like opening a folding phone)
                    onUpdate: () => {
                        videoProgress = scrollState.progress;
                    }
                }
            });
        }

        function renderClustering() {
            const w = clusterCanvas.width;
            const h = clusterCanvas.height;
            const t = videoProgress / 100;
            const tEased = easeInOutCubic(t);
            const time = Date.now() * 0.001;

            // Clear Background
            clusterCtx.fillStyle = "#050507";
            clusterCtx.fillRect(0, 0, w, h);

            // Draw Background Grid
            clusterCtx.strokeStyle = "rgba(255, 255, 255, 0.012)";
            clusterCtx.lineWidth = 1;
            const gridSize = 40;
            for (let x = 0; x < w; x += gridSize) {
                clusterCtx.beginPath();
                clusterCtx.moveTo(x, 0);
                clusterCtx.lineTo(x, h);
                clusterCtx.stroke();
            }
            for (let y = 0; y < h; y += gridSize) {
                clusterCtx.beginPath();
                clusterCtx.moveTo(0, y);
                clusterCtx.lineTo(w, y);
                clusterCtx.stroke();
            }

            // Central Crosshair
            clusterCtx.strokeStyle = "rgba(255, 255, 255, 0.03)";
            clusterCtx.beginPath();
            clusterCtx.moveTo(w/2 - 8, h/2);
            clusterCtx.lineTo(w/2 + 8, h/2);
            clusterCtx.moveTo(w/2, h/2 - 8);
            clusterCtx.lineTo(w/2, h/2 + 8);
            clusterCtx.stroke();

            // Centroids list in screen coords
            const screenCentroids = centroids.map(c => ({
                x: c.xPct * w,
                y: c.yPct * h,
                name: c.name,
                color: c.color,
                rgb: c.rgb
            }));

            // Draw Centroids
            if (t > 0.15) {
                const alpha = Math.min(1, (t - 0.15) / 0.45);
                screenCentroids.forEach(c => {
                    // Pulsing Ring
                    const pulse = 12 + Math.sin(time * 5 + c.x * 0.05) * 5;
                    clusterCtx.strokeStyle = `rgba(${c.rgb.join(",")}, ${alpha * 0.25})`;
                    clusterCtx.lineWidth = 1.2;
                    clusterCtx.beginPath();
                    clusterCtx.arc(c.x, c.y, pulse, 0, Math.PI * 2);
                    clusterCtx.stroke();

                    // Outer Ring
                    clusterCtx.strokeStyle = `rgba(${c.rgb.join(",")}, ${alpha * 0.08})`;
                    clusterCtx.beginPath();
                    clusterCtx.arc(c.x, c.y, pulse * 1.8, 0, Math.PI * 2);
                    clusterCtx.stroke();

                    // Core Dot
                    clusterCtx.fillStyle = `rgba(${c.rgb.join(",")}, ${alpha * 0.9})`;
                    clusterCtx.beginPath();
                    clusterCtx.arc(c.x, c.y, 3.5, 0, Math.PI * 2);
                    clusterCtx.fill();

                    // Cluster Label above
                    if (t > 0.35) {
                        const lblAlpha = Math.min(1, (t - 0.35) / 0.45);
                        clusterCtx.font = "500 10px 'Space Grotesk'";
                        const text = c.name.toUpperCase();
                        const textWidth = clusterCtx.measureText(text).width;
                        const padX = 8;
                        const padY = 4;
                        const rectW = textWidth + padX * 2;
                        const rectH = 14 + padY * 2;
                        const rectX = c.x - rectW / 2;
                        const rectY = c.y - pulse - 24;

                        // Capsule background
                        clusterCtx.fillStyle = `rgba(10, 10, 12, ${lblAlpha * 0.85})`;
                        clusterCtx.strokeStyle = `rgba(${c.rgb.join(",")}, ${lblAlpha * 0.35})`;
                        clusterCtx.lineWidth = 1;
                        clusterCtx.beginPath();
                        if (clusterCtx.roundRect) {
                            clusterCtx.roundRect(rectX, rectY, rectW, rectH, 6);
                        } else {
                            clusterCtx.rect(rectX, rectY, rectW, rectH);
                        }
                        clusterCtx.fill();
                        clusterCtx.stroke();

                        // Label text
                        clusterCtx.fillStyle = `rgba(255, 255, 255, ${lblAlpha})`;
                        clusterCtx.textAlign = "center";
                        clusterCtx.textBaseline = "middle";
                        clusterCtx.fillText(text, c.x, rectY + rectH / 2 + 1);
                    }
                });
            }

            // Connection Lines between points
            if (t > 0.45) {
                const lineAlpha = Math.min(0.12, (t - 0.45) / 0.45);
                clusterCtx.lineWidth = 0.6;
                
                // Map particles to coordinate spaces
                const activeCoords = particles.map(p => {
                    const c = screenCentroids[p.clusterIndex];
                    const scatX = p.scatteredXPct * w;
                    const scatY = p.scatteredYPct * h;
                    const clustX = c.x + p.offsetX;
                    const clustY = c.y + p.offsetY;

                    const floatX = Math.sin(time * 0.7 + p.noiseOffsetX) * 2;
                    const floatY = Math.cos(time * 0.7 + p.noiseOffsetY) * 2;

                    return {
                        x: (scatX + (clustX - scatX) * tEased) + floatX,
                        y: (scatY + (clustY - scatY) * tEased) + floatY,
                        cIdx: p.clusterIndex
                    };
                });

                // Draw lines between neighbors in same cluster
                for (let i = 0; i < activeCoords.length; i += 2) {
                    const pi = activeCoords[i];
                    let draws = 0;
                    for (let j = i + 1; j < activeCoords.length; j++) {
                        if (draws > 2) break;
                        const pj = activeCoords[j];
                        if (pi.cIdx === pj.cIdx) {
                            const dx = pi.x - pj.x;
                            const dy = pi.y - pj.y;
                            const distSqr = dx*dx + dy*dy;
                            if (distSqr < 1600) { // < 40px
                                const c = screenCentroids[pi.cIdx];
                                clusterCtx.strokeStyle = `rgba(${c.rgb.join(",")}, ${lineAlpha})`;
                                clusterCtx.beginPath();
                                clusterCtx.moveTo(pi.x, pi.y);
                                clusterCtx.lineTo(pj.x, pj.y);
                                clusterCtx.stroke();
                                draws++;
                            }
                        }
                    }
                }
            }

            // Render Particles
            particles.forEach(p => {
                const c = screenCentroids[p.clusterIndex];
                const scatX = p.scatteredXPct * w;
                const scatY = p.scatteredYPct * h;
                const clustX = c.x + p.offsetX;
                const clustY = c.y + p.offsetY;

                const floatX = Math.sin(time * 0.7 + p.noiseOffsetX) * 2;
                const floatY = Math.cos(time * 0.7 + p.noiseOffsetY) * 2;

                const x = (scatX + (clustX - scatX) * tEased) + floatX;
                const y = (scatY + (clustY - scatY) * tEased) + floatY;

                // Color Lerping
                let colorStr = "";
                if (t < 0.2) {
                    colorStr = `rgba(161, 161, 170, ${0.4 + (1 - t) * 0.25})`;
                } else if (t > 0.85) {
                    colorStr = `rgba(${c.rgb.join(",")}, 0.85)`;
                } else {
                    const factor = (t - 0.2) / 0.65;
                    const r = Math.round(161 + (c.rgb[0] - 161) * factor);
                    const g = Math.round(161 + (c.rgb[1] - 161) * factor);
                    const b = Math.round(170 + (c.rgb[2] - 170) * factor);
                    colorStr = `rgba(${r}, ${g}, ${b}, ${0.4 + factor * 0.45})`;
                }

                clusterCtx.fillStyle = colorStr;
                clusterCtx.beginPath();
                clusterCtx.arc(x, y, p.radius, 0, Math.PI * 2);
                clusterCtx.fill();
            });

            // HUD Data Text Overlays
            clusterCtx.fillStyle = "rgba(255, 255, 255, 0.45)";
            clusterCtx.font = "400 9px monospace";
            clusterCtx.textAlign = "left";
            clusterCtx.textBaseline = "top";
            clusterCtx.fillText("PIPELINE: BERT-EMBEDDING-3 + HDBSCAN", 15, 15);
            clusterCtx.fillText("REDUCTION: UMAP 2D TRANSFORMATION", 15, 27);
            clusterCtx.fillText(`NUM_DOCUMENTS: ${particleCount}`, 15, 39);

            clusterCtx.textAlign = "right";
            const loss = (1.28 - tEased * 1.20).toFixed(3);
            const silhouette = (0.28 + tEased * 0.48).toFixed(2);
            clusterCtx.fillText("SILHOUETTE SCORE: " + silhouette, w - 15, 15);
            clusterCtx.fillText("CONVERGENCE LOSS: " + loss, w - 15, 27);
            
            let status = "STATUS: UNSTRUCTURED DATA SCATTER";
            if (t > 0.15 && t < 0.85) {
                status = "STATUS: DYNAMIC EM CLUSTERING...";
                clusterCtx.fillStyle = "var(--accent-purple)";
            } else if (t >= 0.85) {
                status = "STATUS: STABLE SEMANTIC GROUPS";
                clusterCtx.fillStyle = "var(--accent-green)";
            }
            clusterCtx.fillText(status, w - 15, 39);

            requestAnimationFrame(renderClustering);
        }

        renderClustering();
    }

    // 3. Automated Agentic AI Workflows Console & SVG Flow Animation
    const consoleLog = document.getElementById("agent-console-log");
    
    const workflowPhases = [
        {
            activeNode: "s1",
            logs: [
                { type: "system", text: "--- Running: Model Evaluation Agent ---" },
                { type: "system", text: "> Trigger: Commit #fa8e2b (eval suite)" },
                { type: "agent", text: "> Evaluating gemini-2.5-pro against test bench..." },
                { type: "highlight", text: "> MMLU: 88.2% | GSM8K: 94.1% - STATUS: PASSED" }
            ],
            durations: [100, 700, 1400, 2100]
        },
        {
            activeNode: "s2",
            logs: [
                { type: "system", text: "--- Running: PR Review Agent ---" },
                { type: "system", text: "> Trigger: PR #182 code review request" },
                { type: "agent", text: "> Scanning files, resolving 12 lints, reviewing diffs..." },
                { type: "highlight", text: "> Security check: OK | Lints fixed - STATUS: APPROVED" }
            ],
            durations: [100, 700, 1400, 2100]
        },
        {
            activeNode: "s3",
            logs: [
                { type: "system", text: "--- Running: Dashboarding Agent ---" },
                { type: "system", text: "> Trigger: Hourly metrics consolidation sync" },
                { type: "agent", text: "> Querying warehouses, mapping tables..." },
                { type: "highlight", text: "> Auto-assembled 3 charts - STATUS: SUCCESS" }
            ],
            durations: [100, 700, 1400, 2100]
        },
        {
            activeNode: "all",
            logs: [
                { type: "system", text: "--- Running: Orchestration Core ---" },
                { type: "system", text: "> Checking all agent heartbeats..." },
                { type: "agent", text: "> Sync: Model Eval, PR Review, Dashboard Agents" },
                { type: "highlight", text: "> System check: All agents healthy (100% active)" }
            ],
            durations: [100, 700, 1400, 2100]
        }
    ];

    let currentWorkflowPhase = 0;
    let logTimeoutIds = [];

    function runAgentWorkflowCycle() {
        if (!consoleLog) return;

        // Clear existing log timeouts to prevent overlapping prints
        logTimeoutIds.forEach(id => clearTimeout(id));
        logTimeoutIds = [];

        const phase = workflowPhases[currentWorkflowPhase];

        // Update SVG Nodes and Links
        const nodes = ["s1", "s2", "s3"];
        nodes.forEach(nodeId => {
            const serverNode = document.getElementById(`mcp-${nodeId}`);
            const linkNode = document.getElementById(`mcp-l${nodeId.replace("s", "")}`);
            const isActive = (phase.activeNode === "all" || phase.activeNode === nodeId);

            if (serverNode) {
                serverNode.style.stroke = isActive ? "#10b981" : "#444";
                serverNode.style.strokeWidth = isActive ? "2px" : "1px";
                serverNode.style.fill = isActive ? "rgba(16, 185, 129, 0.12)" : "#111";
            }
            if (linkNode) {
                linkNode.style.stroke = isActive ? "#10b981" : "#333";
                linkNode.style.animationPlayState = isActive ? "running" : "paused";
            }
        });

        // Update console logs sequentially
        consoleLog.innerHTML = "";
        phase.logs.forEach((log, idx) => {
            const timeoutId = setTimeout(() => {
                const line = document.createElement("div");
                line.className = `console-line ${log.type}`;
                consoleLog.appendChild(line);
                consoleLog.scrollTop = consoleLog.scrollHeight;

                let charIdx = 0;
                const text = log.text;
                function typeChar() {
                    if (charIdx <= text.length) {
                        line.textContent = text.slice(0, charIdx) + (charIdx < text.length ? "▊" : "");
                        charIdx++;
                        setTimeout(typeChar, 8); // fast typing speed
                    }
                }
                typeChar();
            }, phase.durations[idx]);
            logTimeoutIds.push(timeoutId);
        });

        currentWorkflowPhase = (currentWorkflowPhase + 1) % workflowPhases.length;

        // Schedule next phase in 4.5 seconds
        const cycleTimeout = setTimeout(runAgentWorkflowCycle, 4500);
        logTimeoutIds.push(cycleTimeout);
    }

    // Initialize cycle on page load
    runAgentWorkflowCycle();

    /* ==========================================================================
       DYNAMIC METRIC COUNTERS
       ========================================================================== */
    let metricsAnimated = false;
    function animateMetrics() {
        if (metricsAnimated) return;
        metricsAnimated = true;

        const counters = document.querySelectorAll(".metric-value");
        counters.forEach(counter => {
            const target = counter.getAttribute("data-target");
            const textVal = counter.getAttribute("data-text");
            const prefix = counter.getAttribute("data-prefix") || "";
            const suffix = counter.getAttribute("data-suffix") || "";

            if (textVal) {
                // Animate text elements specifically
                let textIndex = 0;
                const textTarget = textVal;
                const interval = setInterval(() => {
                    if (textIndex <= textTarget.length) {
                        counter.textContent = textTarget.slice(0, textIndex);
                        textIndex++;
                    } else {
                        clearInterval(interval);
                    }
                }, 100);
            } else {
                // Number animation
                let count = 0;
                const duration = 1500; // ms
                const increment = target / (duration / 16);
                
                const updateCount = () => {
                    count += increment;
                    if (count < target) {
                        counter.textContent = prefix + Math.floor(count) + suffix;
                        requestAnimationFrame(updateCount);
                    } else {
                        counter.textContent = prefix + target + suffix;
                    }
                };
                updateCount();
            }
        });
    }

    // Fallback/Robust IntersectionObserver for metrics animation
    const impactSection = document.getElementById("impact");
    if (impactSection && typeof IntersectionObserver !== 'undefined') {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateMetrics();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        observer.observe(impactSection);
    }

    /* ==========================================================================
       HOVER GLOW ON EDUCATION CARDS (STRIPE CARD MOUSE TRACING)
       ========================================================================== */
    const eduCards = document.querySelectorAll(".education-card");
    eduCards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty("--x", `${x}px`);
            card.style.setProperty("--y", `${y}px`);
        });
    });

    /* ==========================================================================
       CONTACT FORM SUBMISSION
       ========================================================================== */
    const contactForm = document.getElementById("contact-form");
    const formStatus = document.getElementById("form-status");

    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        // Disable submit button and show loading state
        const submitBtn = contactForm.querySelector(".submit-btn");
        const submitSpan = submitBtn.querySelector("span");
        submitSpan.textContent = "Sending...";
        submitBtn.disabled = true;
        
        const nameVal = document.getElementById("name").value.trim();
        const emailVal = document.getElementById("email").value.trim();
        const messageVal = document.getElementById("message").value.trim();

        if (!nameVal || !emailVal || !messageVal) {
            formStatus.className = "form-status-msg error";
            formStatus.textContent = "Please fill in all details.";
            submitSpan.textContent = "Send Message";
            submitBtn.disabled = false;
            return;
        }

        // Create mailto link
        const subject = encodeURIComponent(`Contact Form Submission from ${nameVal}`);
        const body = encodeURIComponent(`Name: ${nameVal}\nEmail: ${emailVal}\n\nMessage:\n${messageVal}`);
        const mailtoLink = `mailto:marellapartha7c@gmail.com?subject=${subject}&body=${body}`;

        // Open email client
        window.location.href = mailtoLink;

        // Update UI
        formStatus.className = "form-status-msg success";
        formStatus.textContent = "Opening your email client...";
        contactForm.reset();
        submitSpan.textContent = "Send Message";
        submitBtn.disabled = false;

        // Clean up status after 5s
        setTimeout(() => {
            formStatus.textContent = "";
        }, 5000);
    });
});

// --- Semantic Intelligence Interaction ---
document.addEventListener("DOMContentLoaded", () => {
    // Particle animation for Semantic Architecture
    const particlesContainer = document.getElementById('semantic-particles');
    if (particlesContainer) {
        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.animation = `flowUp 3s linear infinite`;
            particle.style.animationDelay = `${i * 0.6}s`;
            particlesContainer.appendChild(particle);
        }
    }

    // Auto progression for Semantic Architecture visual steps
    const layers = document.querySelectorAll('.semantic-system-diagram .system-layer');
    const hubs = document.querySelectorAll('.semantic-system-diagram .hub-node');
    const steps = document.querySelectorAll('#card-semantic .story-step');
    const panes = document.querySelectorAll('#card-semantic .story-pane');
    const compilerBubble = document.getElementById('sys-compiler-output');
    const axisPulse = document.getElementById('axis-pulse');

    let currentStepIndex = 0;
    let autoplayInterval = null;
    let autoplayTimeout = null;

    function activateStep(index) {
        const stepNum = index + 1;

        // Toggle active spotlight focus on layers
        layers.forEach((layer) => {
            const layerVal = parseInt(layer.getAttribute('data-layer'));
            if (layerVal === stepNum) {
                layer.classList.add('active');
            } else {
                layer.classList.remove('active');
            }
        });

        // Activate glowing hubs cumulatively to show upward flow/synergy
        hubs.forEach((hub, idx) => {
            if (idx < index) {
                hub.classList.add('active');
            } else {
                hub.classList.remove('active');
            }
        });

        // Toggle global compiled SQL box on Step 5
        if (compilerBubble) {
            if (stepNum === 5) {
                compilerBubble.classList.add('active');
            } else {
                compilerBubble.classList.remove('active');
            }
        }

        // Toggle story steps active states
        steps.forEach((step, idx) => {
            if (idx === index) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });

        // Toggle story text panes
        panes.forEach((p, idx) => {
            if (idx === index) {
                p.style.display = 'block';
            } else {
                p.style.display = 'none';
            }
        });

        currentStepIndex = index;

        // Trigger typewriter prompt and cascade pulse down the axis on Step 5
        if (stepNum === 5) {
            triggerVisualQueryTypewriter();
            triggerAxisCascadePulse();
        }
    }

    // Neon compiled query pulse cascading top-down through the central axis line
    function triggerAxisCascadePulse() {
        if (!axisPulse) return;
        axisPulse.classList.remove('pulsing');
        void axisPulse.offsetWidth; // Force Reflow
        axisPulse.classList.add('pulsing');
    }

    // Typewriter effect inside the visual query bubble of step 5
    let typewriterActive = false;
    function triggerVisualQueryTypewriter() {
        const queryTextEl = document.getElementById('sys-query-text');
        if (!queryTextEl || typewriterActive) return;
        
        typewriterActive = true;
        const text = "Compare quarterly sales...";
        queryTextEl.textContent = "";
        let charIndex = 0;
        
        function typeChar() {
            if (charIndex < text.length) {
                queryTextEl.textContent += text.charAt(charIndex);
                charIndex++;
                setTimeout(typeChar, 50);
            } else {
                typewriterActive = false;
            }
        }
        typeChar();
    }

    function startAutoplay() {
        stopAutoplay();
        autoplayInterval = setInterval(() => {
            let nextIndex = (currentStepIndex + 1) % steps.length;
            activateStep(nextIndex);
        }, 4000); // Cycle every 4 seconds for readability
    }

    function stopAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
            autoplayInterval = null;
        }
        if (autoplayTimeout) {
            clearTimeout(autoplayTimeout);
            autoplayTimeout = null;
        }
    }

    // Initialize first state and start autoplay
    if (steps.length > 0) {
        activateStep(0);
        startAutoplay();
    }

    // Manual click interaction resets autoplay
    steps.forEach((step, idx) => {
        step.addEventListener('click', () => {
            stopAutoplay();
            activateStep(idx);

            // Pause for 10 seconds after manual click, then resume
            autoplayTimeout = setTimeout(() => {
                startAutoplay();
            }, 10000);
        });

        // Hover interaction updates active step immediately
        step.addEventListener('mouseenter', () => {
            stopAutoplay();
            activateStep(idx);
        });

        step.addEventListener('mouseleave', () => {
            // Delay autoplay restart
            autoplayTimeout = setTimeout(() => {
                startAutoplay();
            }, 4000);
        });
    });

    // Hovering over the visual graphic pane also pauses the cycle
    const visualWrapper = document.querySelector('.product-card-visual');
    if (visualWrapper) {
        visualWrapper.addEventListener('mouseenter', () => {
            stopAutoplay();
        });
        visualWrapper.addEventListener('mouseleave', () => {
            autoplayTimeout = setTimeout(() => {
                startAutoplay();
            }, 4000);
        });
    } 

    // 3D Card Tilt Interaction
    const tiltElements = document.querySelectorAll(".product-card, .education-card, .exp-card, .about-highlight-card");
    tiltElements.forEach(el => {
        el.classList.add("tilt-target");
        
        el.addEventListener("mousemove", (e) => {
            el.classList.add("active-tilt");
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate dynamic rotation angle (-8 to 8 deg for clean restraint)
            const tiltX = ((y / rect.height) - 0.5) * -10;
            const tiltY = ((x / rect.width) - 0.5) * 10;
            
            el.style.setProperty("--tilt-x", `${tiltX}deg`);
            el.style.setProperty("--tilt-y", `${tiltY}deg`);
        });
        
        el.addEventListener("mouseleave", () => {
            el.classList.remove("active-tilt");
            el.style.setProperty("--tilt-x", "0deg");
            el.style.setProperty("--tilt-y", "0deg");
        });
    });
});
