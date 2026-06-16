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
                    <details class="sql-details"><summary class="sql-summary">Compiled Starburst SQL (Click to Expand)</summary>
                    <pre class="sql-code-block"><code>${data.sql}</code></pre></details>
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
    // 2. DOCUMENT CLUSTERING IN MOTION (SCROLL-DRIVEN 3D MOTION GRAPHIC)
    // ==========================================================================
    const clusterCanvas = document.getElementById("topic-cluster-canvas");
    const clusterCtx = clusterCanvas ? clusterCanvas.getContext("2d") : null;
    
    if (clusterCanvas && clusterCtx) {
        let videoProgress = 0; // 0 to 100 (maps to scroll progress)

        // 3D Engine Constants
        const focalLength = 300;
        const numDocs = 15;
        const particlesPerDoc = 12;
        const totalParticles = numDocs * particlesPerDoc;

        let docs = [];
        let particles = [];
        
        // Cluster centroids in 3D space
        const centroids3D = [
            { x: -100, y: -80, z: 0, color: "rgba(0, 113, 227, 0.8)", name: "Financial Audits", rgb: [0, 113, 227] },
            { x: 100, y: -60, z: 50, color: "rgba(139, 92, 246, 0.8)", name: "Legal Contracts", rgb: [139, 92, 246] },
            { x: -60, y: 100, z: -50, color: "rgba(16, 185, 129, 0.8)", name: "Operations Logs", rgb: [16, 185, 129] },
            { x: 120, y: 80, z: 20, color: "rgba(255, 159, 10, 0.8)", name: "GenAI Prompts", rgb: [255, 159, 10] }
        ];

        function resizeClusterCanvas() {
            const rect = clusterCanvas.parentElement.getBoundingClientRect();
            cachedClusterW = rect.width || 450;
            cachedClusterH = 480;
            // Handle high DPI displays for sharper rendering
            const dpr = window.devicePixelRatio || 1;
            clusterCanvas.width = cachedClusterW * dpr;
            clusterCanvas.height = cachedClusterH * dpr;
            clusterCtx.scale(dpr, dpr);
            clusterCanvas.style.width = `${cachedClusterW}px`;
            clusterCanvas.style.height = `${cachedClusterH}px`;
        }
        
        function init3DData() {
            docs = [];
            particles = [];

            for (let i = 0; i < numDocs; i++) {
                // Initial floating doc positions
                const startX = (Math.random() - 0.5) * 400;
                const startY = (Math.random() - 0.5) * 400;
                const startZ = Math.random() * 200 + 100;
                
                // Rotations for the 3D planes
                const rotX = (Math.random() - 0.5) * Math.PI;
                const rotY = (Math.random() - 0.5) * Math.PI;
                const rotZ = (Math.random() - 0.5) * Math.PI;
                
                docs.push({ startX, startY, startZ, rotX, rotY, rotZ });

                // Final cluster destination for this doc's particles
                const targetCluster = Math.floor(Math.random() * centroids3D.length);

                for (let j = 0; j < particlesPerDoc; j++) {
                    // Chaotic scatter position (Phase 3)
                    const scatterX = (Math.random() - 0.5) * 500;
                    const scatterY = (Math.random() - 0.5) * 500;
                    const scatterZ = (Math.random() - 0.5) * 400;

                    // Clustered position (Phase 4)
                    const ang1 = Math.random() * Math.PI * 2;
                    const ang2 = Math.random() * Math.PI * 2;
                    const dist = Math.sqrt(Math.random()) * 40;

                    const clustX = centroids3D[targetCluster].x + dist * Math.cos(ang1) * Math.sin(ang2);
                    const clustY = centroids3D[targetCluster].y + dist * Math.sin(ang1) * Math.sin(ang2);
                    const clustZ = centroids3D[targetCluster].z + dist * Math.cos(ang2);

                    particles.push({
                        docIndex: i,
                        scatterX, scatterY, scatterZ,
                        clustX, clustY, clustZ,
                        clusterIdx: targetCluster,
                        noise: Math.random() * Math.PI * 2
                    });
                }
            }
        }

        resizeClusterCanvas();
        init3DData();
        window.addEventListener("resize", resizeClusterCanvas);

        // GSAP ScrollTrigger
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            const scrollState = { progress: 0 };
            gsap.to(scrollState, {
                progress: 100,
                ease: "none",
                scrollTrigger: {
                    trigger: "#card-topic",
                    start: "top 85%",
                    end: "center 40%",
                    scrub: 1.2,
                    onUpdate: () => {
                        videoProgress = scrollState.progress;
                    }
                }
            });
        }

        // Simple 3D projection utility
        function project3D(x, y, z, w, h) {
            // Move origin to center
            const cx = w / 2;
            const cy = h / 2;

            // Avoid division by zero/negatives behind camera
            const zAdj = z + focalLength;
            if (zAdj <= 0) return null;

            const scale = focalLength / zAdj;
            return {
                x: cx + x * scale,
                y: cy + y * scale,
                scale: scale
            };
        }

        // Rotation utility
        function rotate3D(x, y, z, rx, ry, rz) {
            // X rot
            let y1 = y * Math.cos(rx) - z * Math.sin(rx);
            let z1 = y * Math.sin(rx) + z * Math.cos(rx);
            // Y rot
            let x2 = x * Math.cos(ry) + z1 * Math.sin(ry);
            let z2 = -x * Math.sin(ry) + z1 * Math.cos(ry);
            // Z rot
            let x3 = x2 * Math.cos(rz) - y1 * Math.sin(rz);
            let y3 = x2 * Math.sin(rz) + y1 * Math.cos(rz);

            return {x: x3, y: y3, z: z2};
        }

        let cachedClusterW = 450;
        let cachedClusterH = 480;

        function renderClustering() {
            // Get logical width/height (unscaled by DPI)
            const w = cachedClusterW;
            const h = cachedClusterH;
            const t = videoProgress / 100;
            const time = Date.now() * 0.001;

            clusterCtx.clearRect(0, 0, w, h);
            clusterCtx.fillStyle = "#050507";
            clusterCtx.fillRect(0, 0, w, h);

            // Phase timings
            // t < 0.25 : Docs pull in
            // t = 0.25 to 0.45 : Scanner plane sweeps, docs dissolve into particles
            // t = 0.45 to 0.65 : Particles scatter into 3D cloud
            // t > 0.65 : Particles cluster and colorize

            const camRotY = Math.sin(time * 0.2) * 0.5 + (t * Math.PI); // Camera rotates slowly over time and heavily with scroll

            // --- DRAW GRID ---
            clusterCtx.strokeStyle = "rgba(255, 255, 255, 0.03)";
            clusterCtx.lineWidth = 1;
            clusterCtx.beginPath();
            for(let i = -300; i <= 300; i+= 50) {
                // X lines
                let p1 = rotate3D(i, 200, -300, 0, camRotY, 0);
                let p2 = rotate3D(i, 200, 300, 0, camRotY, 0);
                let pr1 = project3D(p1.x, p1.y, p1.z, w, h);
                let pr2 = project3D(p2.x, p2.y, p2.z, w, h);
                if(pr1 && pr2) { clusterCtx.moveTo(pr1.x, pr1.y); clusterCtx.lineTo(pr2.x, pr2.y); }

                // Z lines
                p1 = rotate3D(-300, 200, i, 0, camRotY, 0);
                p2 = rotate3D(300, 200, i, 0, camRotY, 0);
                pr1 = project3D(p1.x, p1.y, p1.z, w, h);
                pr2 = project3D(p2.x, p2.y, p2.z, w, h);
                if(pr1 && pr2) { clusterCtx.moveTo(pr1.x, pr1.y); clusterCtx.lineTo(pr2.x, pr2.y); }
            }
            clusterCtx.stroke();

            // --- SCANNER PLANE ---
            let scanZ = -999;
            if (t > 0.2 && t < 0.5) {
                const scanT = (t - 0.2) / 0.3;
                // Plane moves from front to back
                scanZ = -200 + (scanT * 400);

                clusterCtx.fillStyle = "rgba(0, 255, 255, 0.05)";
                clusterCtx.strokeStyle = "rgba(0, 255, 255, 0.8)";
                clusterCtx.lineWidth = 2;

                let pA = rotate3D(-200, -200, scanZ, 0, camRotY, 0);
                let pB = rotate3D(200, -200, scanZ, 0, camRotY, 0);
                let pC = rotate3D(200, 200, scanZ, 0, camRotY, 0);
                let pD = rotate3D(-200, 200, scanZ, 0, camRotY, 0);

                let prA = project3D(pA.x, pA.y, pA.z, w, h);
                let prB = project3D(pB.x, pB.y, pB.z, w, h);
                let prC = project3D(pC.x, pC.y, pC.z, w, h);
                let prD = project3D(pD.x, pD.y, pD.z, w, h);

                if (prA && prB && prC && prD) {
                    clusterCtx.beginPath();
                    clusterCtx.moveTo(prA.x, prA.y);
                    clusterCtx.lineTo(prB.x, prB.y);
                    clusterCtx.lineTo(prC.x, prC.y);
                    clusterCtx.lineTo(prD.x, prD.y);
                    clusterCtx.closePath();
                    clusterCtx.fill();
                    clusterCtx.stroke();
                }
            }

            // Calculate current document positions
            const docCurrentPos = docs.map((d, i) => {
                // Pull into center (0,0,0) as t goes 0 -> 0.25
                const pullT = Math.min(1, t / 0.25);
                const easePull = 1 - Math.pow(1 - pullT, 3);

                const currX = d.startX * (1 - easePull);
                const currY = d.startY * (1 - easePull);
                const currZ = d.startZ * (1 - easePull);

                const currRx = d.rotX * (1 - easePull) + (time * 0.5);
                const currRy = d.rotY * (1 - easePull) + (time * 0.3);
                const currRz = d.rotZ * (1 - easePull);

                return { x: currX, y: currY, z: currZ, rx: currRx, ry: currRy, rz: currRz, dissolved: t > 0.25 };
            });

            // --- DRAW DOCUMENTS ---
            if (t < 0.45) {
                // Sort docs by distance for rendering
                const renderDocs = docCurrentPos.map((d, idx) => {
                    let p = rotate3D(d.x, d.y, d.z, 0, camRotY, 0);
                    return { ...d, idx, pZ: p.z, rotP: p };
                }).sort((a, b) => b.pZ - a.pZ);

                renderDocs.forEach(d => {
                    if (t > 0.4) return; // Hide entirely if t > 0.4

                    const p = d.rotP;
                    const pr = project3D(p.x, p.y, p.z, w, h);
                    if (!pr) return;

                    const docW = 30 * pr.scale;
                    const docH = 40 * pr.scale;

                    clusterCtx.save();
                    clusterCtx.translate(pr.x, pr.y);
                    // Approximate 3D rotation with 2D transform (for the rectangle)
                    // We just do a 2D rotation for effect since proper 3D polys are complex
                    clusterCtx.rotate(d.rz);

                    // Paper body
                    clusterCtx.fillStyle = "rgba(200, 200, 210, 0.8)";
                    clusterCtx.strokeStyle = "rgba(255, 255, 255, 0.9)";
                    clusterCtx.lineWidth = 1;
                    clusterCtx.fillRect(-docW/2, -docH/2, docW, docH);
                    clusterCtx.strokeRect(-docW/2, -docH/2, docW, docH);

                    // Text lines
                    clusterCtx.fillStyle = "rgba(50, 50, 60, 0.6)";
                    for(let l=0; l<4; l++) {
                        clusterCtx.fillRect(-docW/2 + 4*pr.scale, -docH/2 + (8 + l*6)*pr.scale, docW - 8*pr.scale, 2*pr.scale);
                    }

                    clusterCtx.restore();
                });
            }

            // Calculate current particle positions
            let projectedParticles = [];

            if (t > 0.2) {
                particles.forEach((p, i) => {
                    const doc = docCurrentPos[p.docIndex];
                    if (!doc.dissolved) return;

                    let currX, currY, currZ;

                    // Scatter transition (t = 0.25 to 0.45)
                    let scatT = Math.max(0, Math.min(1, (t - 0.25) / 0.2));
                    let easeScat = 1 - Math.pow(1 - scatT, 3);

                    // Cluster transition (t = 0.45 to 0.65)
                    let clustT = Math.max(0, Math.min(1, (t - 0.45) / 0.2));
                    let easeClust = clustT < 0.5 ? 4 * clustT * clustT * clustT : 1 - Math.pow(-2 * clustT + 2, 3) / 2;

                    // Float noise
                    const nx = Math.sin(time * 2 + p.noise) * 5;
                    const ny = Math.cos(time * 1.5 + p.noise) * 5;
                    const nz = Math.sin(time * 1.8 + p.noise) * 5;

                    if (clustT === 0) {
                        // Moving from Doc pos to Scatter pos
                        currX = doc.x + (p.scatterX - doc.x) * easeScat + nx;
                        currY = doc.y + (p.scatterY - doc.y) * easeScat + ny;
                        currZ = doc.z + (p.scatterZ - doc.z) * easeScat + nz;
                    } else {
                        // Moving from Scatter pos to Cluster pos
                        currX = p.scatterX + (p.clustX - p.scatterX) * easeClust + nx;
                        currY = p.scatterY + (p.clustY - p.scatterY) * easeClust + ny;
                        currZ = p.scatterZ + (p.clustZ - p.scatterZ) * easeClust + nz;
                    }

                    // Rotate point by camera
                    let rotP = rotate3D(currX, currY, currZ, 0, camRotY, 0);
                    let pr = project3D(rotP.x, rotP.y, rotP.z, w, h);

                    if (pr) {
                        projectedParticles.push({
                            x: pr.x, y: pr.y, scale: pr.scale, z: rotP.z,
                            clustT: clustT,
                            clusterIdx: p.clusterIdx,
                            orig: p
                        });
                    }
                });
            }

            // Sort particles by Z-depth to render back-to-front
            projectedParticles.sort((a, b) => b.z - a.z);

            // --- DRAW CONNECTIONS (PHASE 4) ---
            if (t > 0.6) {
                const connAlpha = Math.min(0.2, (t - 0.6) / 0.2);
                clusterCtx.lineWidth = 0.8;

                for (let i = 0; i < projectedParticles.length; i += 2) {
                    const pi = projectedParticles[i];
                    if (pi.clustT < 0.8) continue;

                    let draws = 0;
                    for (let j = i + 1; j < projectedParticles.length; j++) {
                        if (draws > 1) break; // Limit connections per node
                        const pj = projectedParticles[j];

                        if (pi.clusterIdx === pj.clusterIdx) {
                            const dx = pi.x - pj.x;
                            const dy = pi.y - pj.y;
                            if (dx*dx + dy*dy < 4000) { // Screen distance check
                                const rgb = centroids3D[pi.clusterIdx].rgb;
                                clusterCtx.strokeStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${connAlpha})`;
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

            // --- DRAW PARTICLES ---
            projectedParticles.forEach(p => {
                const c = centroids3D[p.clusterIdx];

                // Color transition from raw (white/gray) to cluster color
                let r=200, g=200, b=220, alpha=0.8;
                if (p.clustT > 0) {
                    r = Math.round(200 + (c.rgb[0] - 200) * p.clustT);
                    g = Math.round(200 + (c.rgb[1] - 200) * p.clustT);
                    b = Math.round(220 + (c.rgb[2] - 220) * p.clustT);
                    alpha = 0.8 + (0.2 * p.clustT); // Brighten as it clusters
                }

                const radius = 2.5 * p.scale;

                clusterCtx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
                clusterCtx.beginPath();
                clusterCtx.arc(p.x, p.y, radius, 0, Math.PI * 2);
                clusterCtx.fill();

                // Glow for clustered
                if (p.clustT > 0.8) {
                    clusterCtx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.15)`;
                    clusterCtx.beginPath();
                    clusterCtx.arc(p.x, p.y, radius * 3, 0, Math.PI * 2);
                    clusterCtx.fill();
                }
            });

            // --- DRAW 3D CLUSTER LABELS (PHASE 4) ---
            if (t > 0.6) {
                const lblAlpha = Math.min(1, (t - 0.6) / 0.2);
                clusterCtx.font = "500 10px 'Space Grotesk'";
                clusterCtx.textAlign = "center";
                clusterCtx.textBaseline = "middle";

                // Project centroid positions
                const projectedCentroids = centroids3D.map((c, i) => {
                    // Make labels float above centroid slightly
                    const floatY = Math.sin(time * 2 + i) * 5;
                    let rotP = rotate3D(c.x, c.y - 30 + floatY, c.z, 0, camRotY, 0);
                    let pr = project3D(rotP.x, rotP.y, rotP.z, w, h);
                    return { ...pr, rotP, ...c };
                }).filter(p => p.scale !== undefined).sort((a, b) => b.rotP.z - a.rotP.z);

                projectedCentroids.forEach(c => {
                    const text = c.name.toUpperCase();
                    const textW = clusterCtx.measureText(text).width;
                    const padX = 8 * c.scale;
                    const padY = 4 * c.scale;
                    const rectW = textW + padX * 2;
                    const rectH = (14 * c.scale) + padY * 2;

                    const rectX = c.x - rectW / 2;
                    const rectY = c.y - rectH / 2;

                    // Capsule
                    clusterCtx.fillStyle = `rgba(10, 10, 12, ${lblAlpha * 0.85})`;
                    clusterCtx.strokeStyle = `rgba(${c.rgb.join(",")}, ${lblAlpha * 0.5})`;
                    clusterCtx.lineWidth = 1;

                    clusterCtx.beginPath();
                    if (clusterCtx.roundRect) {
                        clusterCtx.roundRect(rectX, rectY, rectW, rectH, 6 * c.scale);
                    } else {
                        clusterCtx.rect(rectX, rectY, rectW, rectH);
                    }
                    clusterCtx.fill();
                    clusterCtx.stroke();

                    // Text
                    // Keep text readable (don't scale font size too small)
                    clusterCtx.font = `500 ${Math.max(8, 10 * c.scale)}px 'Space Grotesk'`;
                    clusterCtx.fillStyle = `rgba(255, 255, 255, ${lblAlpha})`;
                    clusterCtx.fillText(text, c.x, c.y + 1);
                });
            }

            // --- HUD OVERLAYS ---
            clusterCtx.fillStyle = "rgba(255, 255, 255, 0.45)";
            clusterCtx.font = "400 9px monospace";
            clusterCtx.textAlign = "left";
            clusterCtx.textBaseline = "top";

            if (t < 0.25) {
                clusterCtx.fillText("PIPELINE: DATA INGESTION", 15, 15);
                clusterCtx.fillText("INPUT: RAW DOCUMENTS", 15, 27);
            } else if (t < 0.45) {
                clusterCtx.fillText("PIPELINE: TEXT CHUNKING & EMBEDDING", 15, 15);
                clusterCtx.fillText("MODEL: text-embedding-3-large", 15, 27);
            } else if (t < 0.65) {
                clusterCtx.fillText("PIPELINE: DIMENSIONALITY REDUCTION", 15, 15);
                clusterCtx.fillText("ALGO: UMAP 3D PROJECTION", 15, 27);
            } else {
                clusterCtx.fillText("PIPELINE: SEMANTIC CLUSTERING", 15, 15);
                clusterCtx.fillText("ALGO: HDBSCAN", 15, 27);
            }

            clusterCtx.fillText(`TOKENS_PROCESSED: ${Math.floor(t * 128450)}`, 15, 39);

            clusterCtx.textAlign = "right";
            
            let status = "STATUS: AWAITING INGESTION";
            clusterCtx.fillStyle = "rgba(255, 255, 255, 0.45)";

            if (t > 0.1 && t < 0.25) {
                status = "STATUS: LOADING DOCUMENTS...";
                clusterCtx.fillStyle = "var(--accent-blue)";
            } else if (t >= 0.25 && t < 0.45) {
                status = "STATUS: EXTRACTING SEMANTICS...";
                clusterCtx.fillStyle = "rgba(0, 255, 255, 0.8)";
            } else if (t >= 0.45 && t < 0.65) {
                status = "STATUS: MAPPING VECTOR SPACE...";
                clusterCtx.fillStyle = "var(--accent-purple)";
            } else if (t >= 0.65) {
                status = "STATUS: CLUSTERS CONVERGED";
                clusterCtx.fillStyle = "var(--accent-green)";
            }
            clusterCtx.fillText(status, w - 15, 15);

            if (t > 0.45) {
                const loss = Math.max(0.1, 2.5 - (t * 2.4)).toFixed(3);
                clusterCtx.fillStyle = "rgba(255, 255, 255, 0.45)";
                clusterCtx.fillText("EMBEDDING LOSS: " + loss, w - 15, 27);
            }

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

    // --- Three.js 3D Agent Pipeline Visualization ---
    const container3D = document.getElementById('agent-3d-container');
    let scene, camera, renderer, hub, agentNodes = {}, agentLinks = {}, agentParticles = {};
    const agentPositions = {
        s1: [-4.5, 3.5, 0], // Model Eval
        s2: [4.5, 3.5, 0],  // PR Review
        s3: [0, -4.5, 0]    // Dashboards
    };

    if (container3D && window.THREE) {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(45, container3D.clientWidth / container3D.clientHeight, 0.1, 1000);
        camera.position.z = 15;

        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(container3D.clientWidth, container3D.clientHeight);
        container3D.appendChild(renderer.domElement);

        const hubGeo = new THREE.IcosahedronGeometry(1.5, 1);
        const hubMat = new THREE.MeshBasicMaterial({ color: 0x10b981, wireframe: true });
        hub = new THREE.Mesh(hubGeo, hubMat);
        scene.add(hub);

        const nodeGeo = new THREE.SphereGeometry(0.8, 16, 16);

        Object.keys(agentPositions).forEach(id => {
            const mat = new THREE.MeshBasicMaterial({ color: 0x444444, wireframe: true });
            const mesh = new THREE.Mesh(nodeGeo, mat);
            mesh.position.set(...agentPositions[id]);
            scene.add(mesh);
            agentNodes[id] = mesh;

            const points = [new THREE.Vector3(0,0,0), new THREE.Vector3(...agentPositions[id])];
            const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
            const lineMat = new THREE.LineBasicMaterial({ color: 0x333333, transparent: true, opacity: 0.5 });
            const line = new THREE.Line(lineGeo, lineMat);
            scene.add(line);
            agentLinks[id] = line;

            // Particle
            const pGeo = new THREE.SphereGeometry(0.2, 8, 8);
            const pMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
            const particle = new THREE.Mesh(pGeo, pMat);
            scene.add(particle);
            particle.visible = false;
            agentParticles[id] = {
                mesh: particle,
                progress: 0,
                active: false
            };
        });

        // Handle resize
        window.addEventListener('resize', () => {
            if (container3D.clientWidth > 0 && container3D.clientHeight > 0) {
                camera.aspect = container3D.clientWidth / container3D.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(container3D.clientWidth, container3D.clientHeight);
            }
        });

        function animate3D() {
            requestAnimationFrame(animate3D);
            if (!hub) return;

            hub.rotation.x += 0.005;
            hub.rotation.y += 0.005;

            Object.keys(agentNodes).forEach(id => {
                agentNodes[id].rotation.x -= 0.01;
                agentNodes[id].rotation.y -= 0.01;

                // Particle animation
                const pData = agentParticles[id];
                if (pData.active) {
                    pData.mesh.visible = true;
                    pData.progress += 0.015;
                    if (pData.progress > 1) pData.progress = 0;

                    const start = new THREE.Vector3(0,0,0);
                    const end = new THREE.Vector3(...agentPositions[id]);
                    const t = pData.progress;
                    // Ease
                    const pos = start.clone().lerp(end, (Math.sin(t * Math.PI * 2 - Math.PI/2) + 1) / 2);
                    pData.mesh.position.copy(pos);
                } else {
                    pData.mesh.visible = false;
                    pData.progress = 0;
                }
            });

            renderer.render(scene, camera);
        }
        animate3D();
    }

    function runAgentWorkflowCycle() {
        if (!consoleLog) return;

        // Clear existing log timeouts to prevent overlapping prints
        logTimeoutIds.forEach(id => clearTimeout(id));
        logTimeoutIds = [];

        const phase = workflowPhases[currentWorkflowPhase];

        // Update 3D scene colors/particles based on phase
        if (scene) {
            Object.keys(agentNodes).forEach(id => {
                const isActive = (phase.activeNode === "all" || phase.activeNode === id);
                if (agentNodes[id]) {
                    agentNodes[id].material.color.setHex(isActive ? 0x10b981 : 0x444444);
                }
                if (agentLinks[id]) {
                    agentLinks[id].material.color.setHex(isActive ? 0x10b981 : 0x333333);
                    agentLinks[id].material.opacity = isActive ? 1 : 0.5;
                }
                if (agentParticles[id]) {
                    agentParticles[id].active = isActive;
                }
            });
        }

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
    const layers = document.querySelectorAll('.sem-stack .sem-layer');
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
