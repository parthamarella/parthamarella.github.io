/* ==========================================================================
   INTERACTIVE SCRIPTING - PARTHA MARELLA PORTFOLIO
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Scroll Spy for Nav Links
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link:not(.contact-btn)");
    
    const observerOptions = {
        root: null,
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute("id");
                navLinks.forEach(link => {
                    link.classList.remove("active");
                    if (link.getAttribute("href") === `#${currentId}`) {
                        link.classList.add("active");
                    }
                });
            }
        });
    }, observerOptions);
    
    sections.forEach(sec => sectionObserver.observe(sec));

    // Scroll Progress Indicator
    const progressBar = document.getElementById("scroll-progress-bar");
    window.addEventListener("scroll", () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0) {
            const progress = (window.scrollY / totalHeight) * 100;
            progressBar.style.width = `${progress}%`;
        }
    });

    // Handle Scroll Header floating pill dynamics
    const header = document.getElementById("site-header");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.style.backgroundColor = "rgba(10, 10, 15, 0.15)";
            header.style.border = "1px solid rgba(255, 255, 255, 0.15)";
            header.style.transform = "translateX(-50%) scale(0.98)";
            header.style.boxShadow = "0 10px 40px rgba(0, 0, 0, 0.6), inset 0 0 20px rgba(255, 255, 255, 0.05)";
        } else {
            header.style.backgroundColor = "rgba(20, 20, 25, 0.15)";
            header.style.border = "1px solid rgba(255, 255, 255, 0.1)";
            header.style.transform = "translateX(-50%) scale(1)";
            header.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.02)";
        }
    });

    // Liquid Glass 3D Tilt Interaction
    const glassSurfaces = document.querySelectorAll(".glass-surface");
    glassSurfaces.forEach(surface => {
        surface.addEventListener("mousemove", (e) => {
            const rect = surface.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -4;
            const rotateY = ((x - centerX) / centerX) * 4;
            
            surface.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        surface.addEventListener("mouseleave", () => {
            surface.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
        });
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
            .to(".hero-title", { opacity: 1, y: 0, duration: 1, ease: "expo.out" })
            .to(".hero-tagline", { opacity: 1, y: 0, duration: 1, ease: "expo.out" }, "-=0.7")
            .to(".hero-roles", { opacity: 1, y: 0, duration: 0.8, ease: "expo.out" }, "-=0.7")
            .to(".hero-cta", { opacity: 1, y: 0, duration: 0.8, ease: "expo.out" }, "-=0.6")
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
                ease: "back.out(1.4)",
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
                ease: "back.out(1.4)",
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
                ease: "back.out(1.4)",
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
                ease: "back.out(1.4)",
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

        const numDocs = 15;
        const categories = [
            { name: "Finance", color: "rgba(0, 113, 227, 1)", rgb: [0, 113, 227], label: "Financial Audits" },
            { name: "Legal", color: "rgba(139, 92, 246, 1)", rgb: [139, 92, 246], label: "Legal Contracts" },
            { name: "Operations", color: "rgba(16, 185, 129, 1)", rgb: [16, 185, 129], label: "Operations Logs" },
            { name: "GenAI", color: "rgba(255, 159, 10, 1)", rgb: [255, 159, 10], label: "GenAI Prompts" }
        ];

        // Seed documentation list
        const docNames = [
            "audit_q4.xls", "nda_revised.pdf", "sys_failure.log", "eval_bench.json",
            "invoice_109.csv", "msa_final.docx", "k8s_deploy.yaml", "system_prompt.txt",
            "tax_report.pdf", "ip_license.pdf", "docker_compose.yml", "few_shot_dataset.json",
            "ledger_p2.csv", "patent_app.pdf", "cron_job.sh"
        ];

        const docCategories = [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2];
        
        // Metadata tags printed at scanning
        const docTags = [
            "[REVENUE_REPORT]", "[MUTUAL_NDA]", "[POD_RESTART_ERR]", "[GEMINI_PRO_EVAL]",
            "[BILLING_LEDGER]", "[IP_CLAUSE_AMEND]", "[CPU_LIMIT_EXCEED]", "[RAG_CONTEXT_V4]",
            "[IRS_W2_COMPLIANCE]", "[TRADEMARK_AGREE]", "[IMAGE_PORT_MAPPING]", "[FEW_SHOT_LEARN]",
            "[EXPENDITURE_LOG]", "[US_PATENT_CLAIM]", "[DB_BACKUP_EXEC]"
        ];

        // Compute randomized final offsets inside the cluster hubs
        let clusterOffsets = [];
        for (let i = 0; i < numDocs; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * 25; // spread inside hub
            clusterOffsets.push({
                x: Math.cos(angle) * dist,
                y: Math.sin(angle) * dist * 0.5 // squash vertically to match perspective
            });
        }

        let cachedClusterW = 450;
        let cachedClusterH = 480;

        function resizeClusterCanvas() {
            const rect = clusterCanvas.parentElement.getBoundingClientRect();
            cachedClusterW = rect.width || 450;
            cachedClusterH = 480;
            const dpr = window.devicePixelRatio || 1;
            clusterCanvas.width = cachedClusterW * dpr;
            clusterCanvas.height = cachedClusterH * dpr;
            clusterCtx.scale(dpr, dpr);
            clusterCanvas.style.width = `${cachedClusterW}px`;
            clusterCanvas.style.height = `${cachedClusterH}px`;
        }

        function getTrackPos(p, w) {
            const xScanner = w * 0.22;
            const xCurveStart = w * 0.4;
            const xDB = w * 0.55;

            if (p < 0.4) {
                const ratio = p / 0.4;
                return { x: -50 + ratio * (xCurveStart + 50), y: 140, angle: 0 };
            } else if (p < 0.5) {
                const ratio = (p - 0.4) / 0.1;
                const p0 = { x: xCurveStart, y: 140 };
                const p1 = { x: xDB - 20, y: 140 };
                const p2 = { x: xDB, y: 190 };
                const mt = 1 - ratio;
                const x = mt * mt * p0.x + 2 * mt * ratio * p1.x + ratio * ratio * p2.x;
                const y = mt * mt * p0.y + 2 * mt * ratio * p1.y + ratio * ratio * p2.y;
                return { x, y, angle: ratio * Math.PI / 4 };
            } else {
                const ratio = Math.min(1, (p - 0.5) / 0.1);
                return { x: xDB, y: 190 + ratio * 55, angle: Math.PI / 2 };
            }
        }

        function drawRoundRect(ctx, x, y, w, h, r) {
            ctx.beginPath();
            if (typeof ctx.roundRect === 'function') {
                ctx.roundRect(x, y, w, h, r);
            } else {
                if (w < 2 * r) r = w / 2;
                if (h < 2 * r) r = h / 2;
                ctx.moveTo(x + r, y);
                ctx.arcTo(x + w, y, x + w, y + h, r);
                ctx.arcTo(x + w, y + h, x, y + h, r);
                ctx.arcTo(x, y + h, x, y, r);
                ctx.arcTo(x, y, x + w, y, r);
            }
        }

        function drawDocumentCard(ctx, x, y, w, h, title, catColor, angle, isScanning) {
            ctx.save();
            ctx.translate(x, y);
            
            // Subtle 3D perspective skew
            ctx.transform(1, -0.04, 0.08, 0.92, 0, 0);
            ctx.rotate(angle * 0.08); // micro-rotation for conveyor belt motion

            // Ambient shadow
            ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
            ctx.shadowBlur = isScanning ? 12 : 6;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 4;

            // Glassmorphic card body
            ctx.fillStyle = "rgba(12, 12, 18, 0.88)";
            drawRoundRect(ctx, -w/2, -h/2, w, h, 6);
            ctx.fill();

            // Card border (glowing highlight when scanning)
            ctx.shadowColor = catColor;
            ctx.shadowBlur = isScanning ? 8 : 2;
            ctx.strokeStyle = isScanning ? catColor : "rgba(255, 255, 255, 0.12)";
            ctx.lineWidth = isScanning ? 1.5 : 1;
            drawRoundRect(ctx, -w/2, -h/2, w, h, 6);
            ctx.stroke();

            // Reset shadow
            ctx.shadowColor = "transparent";
            ctx.shadowBlur = 0;

            // Header accent line
            ctx.fillStyle = catColor.replace("1)", "0.25)");
            drawRoundRect(ctx, -w/2 + 3, -h/2 + 3, w - 6, 5, 2);
            ctx.fill();

            // File type text (e.g. PDF, XLS) inside header
            const ext = title.split('.').pop().toUpperCase();
            ctx.fillStyle = catColor;
            ctx.font = "bold 5.5px monospace";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(ext, 0, -h/2 + 5.5);

            // Mock document line content
            ctx.fillStyle = "rgba(255, 255, 255, 0.18)";
            ctx.fillRect(-w/2 + 4, -h/2 + 12, w - 8, 1.5);
            ctx.fillStyle = "rgba(255, 255, 255, 0.28)";
            ctx.fillRect(-w/2 + 4, -h/2 + 16, w - 10, 1.5);
            ctx.fillStyle = "rgba(255, 255, 255, 0.18)";
            ctx.fillRect(-w/2 + 4, -h/2 + 20, w - 12, 1.5);
            ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
            ctx.fillRect(-w/2 + 4, -h/2 + 24, w - 8, 1.5);

            // Document file name text just below card
            ctx.fillStyle = isScanning ? "#fff" : "rgba(255, 255, 255, 0.55)";
            ctx.font = "6.5px 'Space Grotesk', sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "top";
            ctx.fillText(title, 0, h/2 + 6);

            ctx.restore();
        }

        function drawScanner(ctx, x, y) {
            ctx.save();
            
            // Outer bracket structure
            ctx.strokeStyle = "rgba(0, 240, 255, 0.45)";
            ctx.lineWidth = 1.5;
            
            // Left Bracket
            ctx.beginPath();
            ctx.moveTo(x - 14, y - 35);
            ctx.lineTo(x - 20, y - 35);
            ctx.lineTo(x - 20, y + 35);
            ctx.lineTo(x - 14, y + 35);
            ctx.stroke();

            // Right Bracket
            ctx.beginPath();
            ctx.moveTo(x + 14, y - 35);
            ctx.lineTo(x + 20, y - 35);
            ctx.lineTo(x + 20, y + 35);
            ctx.lineTo(x + 14, y + 35);
            ctx.stroke();

            // Corner indicator lights
            ctx.fillStyle = "#00f0ff";
            ctx.shadowColor = "#00f0ff";
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.arc(x - 20, y - 35, 1.5, 0, Math.PI * 2);
            ctx.arc(x + 20, y - 35, 1.5, 0, Math.PI * 2);
            ctx.arc(x - 20, y + 35, 1.5, 0, Math.PI * 2);
            ctx.arc(x + 20, y + 35, 1.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0; // reset

            // Holographic center fill
            ctx.fillStyle = "rgba(0, 240, 255, 0.035)";
            ctx.fillRect(x - 19, y - 35, 38, 70);

            // Active laser beam scan line (sine wave sweep)
            const time = Date.now() * 0.003;
            const laserY = y - 30 + (Math.sin(time) + 1) * 30;

            const laserGrad = ctx.createLinearGradient(x - 19, laserY, x + 19, laserY);
            laserGrad.addColorStop(0, "rgba(0, 255, 255, 0)");
            laserGrad.addColorStop(0.2, "rgba(0, 255, 255, 0.7)");
            laserGrad.addColorStop(0.5, "rgba(255, 255, 255, 1)");
            laserGrad.addColorStop(0.8, "rgba(0, 255, 255, 0.7)");
            laserGrad.addColorStop(1, "rgba(0, 255, 255, 0)");

            ctx.strokeStyle = laserGrad;
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(x - 19, laserY);
            ctx.lineTo(x + 19, laserY);
            ctx.stroke();

            ctx.restore();
        }

        function drawNeuralCore(ctx, x, y, glowAmount) {
            ctx.save();
            ctx.translate(x, y);

            const time = Date.now() * 0.001;
            const angle = time * 0.45;

            // Ground reflection projection
            ctx.fillStyle = `rgba(0, 255, 255, ${0.03 * glowAmount})`;
            ctx.beginPath();
            ctx.ellipse(0, 15, 45, 22, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = `rgba(0, 255, 255, ${0.12 * glowAmount})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.ellipse(0, 15, 45, 22, 0, 0, Math.PI * 2);
            ctx.stroke();

            // 3D Isometric Core geometry definitions
            const size = 22;
            const vertices = [
                [-size, -size, -size], [size, -size, -size], [size, size, -size], [-size, size, -size],
                [-size, -size, size], [size, -size, size], [size, size, size], [-size, size, size]
            ];

            // Project 3D coordinate to isometric space
            function project3D(v, rotY) {
                // Y-axis rotation
                const x_rot = v[0] * Math.cos(rotY) - v[2] * Math.sin(rotY);
                const z_rot = v[0] * Math.sin(rotY) + v[2] * Math.cos(rotY);
                const y_rot = v[1];

                // Isometric standard angle projections
                const screenX = (x_rot - z_rot) * 0.866;
                const screenY = y_rot * 0.5 + (x_rot + z_rot) * 0.25;

                return { x: screenX, y: screenY };
            }

            const projected = vertices.map(v => project3D(v, angle));

            // Core cube edges
            const edges = [
                [0, 1], [1, 2], [2, 3], [3, 0], // back face
                [4, 5], [5, 6], [6, 7], [7, 4], // front face
                [0, 4], [1, 5], [2, 6], [3, 7]  // links
            ];

            ctx.strokeStyle = `rgba(0, 255, 255, ${0.15 + 0.65 * glowAmount})`;
            ctx.lineWidth = 1;

            edges.forEach(edge => {
                const p1 = projected[edge[0]];
                const p2 = projected[edge[1]];
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            });

            // Glowing core vertices
            projected.forEach((p, idx) => {
                ctx.fillStyle = `rgba(0, 255, 255, ${0.45 + 0.55 * glowAmount})`;
                ctx.shadowBlur = 4;
                ctx.shadowColor = "#00ffff";
                ctx.beginPath();
                ctx.arc(p.x, p.y, idx % 2 === 0 ? 3 : 2, 0, Math.PI * 2);
                ctx.fill();
            });
            ctx.shadowBlur = 0; // reset

            // Rotating nucleus center projector
            const nucSize = 5 + Math.sin(time * 5.5) * 1.5;
            const nucGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, nucSize * 2.2);
            nucGrad.addColorStop(0, "rgba(255, 255, 255, 1)");
            nucGrad.addColorStop(0.3, "rgba(0, 255, 255, 0.95)");
            nucGrad.addColorStop(1, "rgba(0, 255, 255, 0)");
            
            ctx.fillStyle = nucGrad;
            ctx.beginPath();
            ctx.arc(0, 0, nucSize * 2.2, 0, Math.PI * 2);
            ctx.fill();

            // Label text underneath
            ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
            ctx.font = "8px 'Space Grotesk', sans-serif";
            ctx.textAlign = "center";
            ctx.fillText("VECTOR CORE", 0, 42);

            ctx.restore();
        }

        function drawClusterNebula(ctx, x, y, name, color, active) {
            ctx.save();
            ctx.translate(x, y);

            const rx = 44;
            const ry = 20;

            // Glowing nebula clouds
            if (active) {
                const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
                grad.addColorStop(0, color.replace("1)", "0.15)"));
                grad.addColorStop(0.4, color.replace("1)", "0.04)"));
                grad.addColorStop(1, "rgba(0, 0, 0, 0)");

                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.ellipse(0, 0, rx * 1.5, ry * 1.5, 0, 0, Math.PI * 2);
                ctx.fill();
            }

            // Boundary dashed ring
            ctx.strokeStyle = active ? color.replace("1)", "0.32)") : "rgba(255, 255, 255, 0.04)";
            ctx.lineWidth = active ? 1.5 : 1;
            ctx.setLineDash([4, 6]);
            ctx.beginPath();
            ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]); // reset

            // Glassmorphic hub category label
            ctx.shadowBlur = active ? 6 : 0;
            ctx.shadowColor = color;

            ctx.fillStyle = active ? "rgba(10, 10, 14, 0.9)" : "rgba(8, 8, 10, 0.4)";
            ctx.strokeStyle = active ? color.replace("1)", "0.7)") : "rgba(255, 255, 255, 0.06)";
            ctx.lineWidth = 1;

            ctx.beginPath();
            drawRoundRect(ctx, -38, ry + 4, 76, 14, 4);
            ctx.fill();
            ctx.stroke();
            
            ctx.shadowBlur = 0; // reset

            ctx.fillStyle = active ? "#fff" : "rgba(255, 255, 255, 0.35)";
            ctx.font = "bold 7.5px monospace";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(name.toUpperCase(), 0, ry + 11);

            ctx.restore();
        }

        resizeClusterCanvas();
        window.addEventListener("resize", resizeClusterCanvas);

        // GSAP ScrollTrigger setup
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

        function renderClustering() {
            const w = cachedClusterW;
            const h = cachedClusterH;
            const t = videoProgress / 100;
            const time = Date.now() * 0.001;

            clusterCtx.clearRect(0, 0, w, h);
            clusterCtx.fillStyle = "#050507";
            clusterCtx.fillRect(0, 0, w, h);

            // Background grid
            clusterCtx.strokeStyle = "rgba(255, 255, 255, 0.015)";
            clusterCtx.lineWidth = 1;
            clusterCtx.beginPath();
            for (let i = 0; i < w; i += 30) {
                clusterCtx.moveTo(i, 0);
                clusterCtx.lineTo(i, h);
            }
            for (let j = 0; j < h; j += 30) {
                clusterCtx.moveTo(0, j);
                clusterCtx.lineTo(w, j);
            }
            clusterCtx.stroke();

            const xScanner = w * 0.22;
            const xCurveStart = w * 0.4;
            const xDB = w * 0.55;

            // Draw track
            clusterCtx.strokeStyle = "rgba(0, 240, 255, 0.12)";
            clusterCtx.lineWidth = 5;
            clusterCtx.beginPath();
            clusterCtx.moveTo(-50, 140);
            clusterCtx.lineTo(xCurveStart, 140);
            clusterCtx.quadraticCurveTo(xDB - 20, 140, xDB, 190);
            clusterCtx.lineTo(xDB, 245);
            clusterCtx.stroke();

            // Track dashes
            clusterCtx.strokeStyle = "rgba(0, 240, 255, 0.45)";
            clusterCtx.lineWidth = 1.5;
            clusterCtx.setLineDash([5, 5]);
            clusterCtx.lineDashOffset = -time * 24;
            clusterCtx.beginPath();
            clusterCtx.moveTo(-50, 140);
            clusterCtx.lineTo(xCurveStart, 140);
            clusterCtx.quadraticCurveTo(xDB - 20, 140, xDB, 190);
            clusterCtx.lineTo(xDB, 245);
            clusterCtx.stroke();
            clusterCtx.setLineDash([]);

            // Scanner Hoop
            drawScanner(clusterCtx, xScanner, 140);

            // Responsive Hub coordinates
            const hubs = [
                { name: "Finance", x: w * 0.17, y: 410, color: "rgba(0, 113, 227, 1)" },
                { name: "Legal", x: w * 0.39, y: 420, color: "rgba(139, 92, 246, 1)" },
                { name: "Operations", x: w * 0.61, y: 420, color: "rgba(16, 185, 129, 1)" },
                { name: "GenAI", x: w * 0.83, y: 410, color: "rgba(255, 159, 10, 1)" }
            ];

            const isClusterActive = t > 0.6;
            hubs.forEach(hub => {
                drawClusterNebula(clusterCtx, hub.x, hub.y, hub.name, hub.color, isClusterActive);
            });

            let dbStoredCount = 0;
            let currentNodes = [];

            // Draw document records
            for (let i = 0; i < numDocs; i++) {
                const s_i = Math.min(1, Math.max(0, t * 1.8 - (i * 0.08)));
                const catIdx = docCategories[i];
                const catColor = categories[catIdx].color;
                const docTag = docTags[i];

                if (s_i === 0) continue;

                if (s_i < 0.6) {
                    const pos = getTrackPos(s_i, w);
                    const isScanning = (pos.x >= xScanner - 15 && pos.x <= xScanner + 15);

                    const rotAngle = s_i * 12 + time * 1.8;
                    // Draw Document Card
                    drawDocumentCard(clusterCtx, pos.x, pos.y, 22, 28, docNames[i], catColor, rotAngle, isScanning);

                    if (isScanning) {
                        const scanRatio = (pos.x - (xScanner - 15)) / 30;
                        const floatY = pos.y - 22 - scanRatio * 32;
                        const alpha = 1 - scanRatio;
                        
                        // Metadata float-up card
                        clusterCtx.save();
                        clusterCtx.fillStyle = `rgba(10, 10, 15, ${alpha * 0.85})`;
                        clusterCtx.strokeStyle = `rgba(0, 255, 255, ${alpha * 0.5})`;
                        clusterCtx.lineWidth = 1;
                        clusterCtx.beginPath();
                        drawRoundRect(clusterCtx, pos.x - 45, floatY - 10, 90, 14, 3);
                        clusterCtx.fill();
                        clusterCtx.stroke();

                        clusterCtx.fillStyle = `rgba(0, 255, 255, ${alpha})`;
                        clusterCtx.shadowColor = "rgba(0, 255, 255, 0.4)";
                        clusterCtx.shadowBlur = 4;
                        clusterCtx.font = "bold 7.5px monospace";
                        clusterCtx.textAlign = "center";
                        clusterCtx.textBaseline = "middle";
                        clusterCtx.fillText(docTag, pos.x, floatY - 3);
                        clusterCtx.restore();

                        // Sparks
                        clusterCtx.fillStyle = "rgba(0, 255, 255, 0.75)";
                        for (let k = 0; k < 2; k++) {
                            const sparkX = pos.x + (Math.random() - 0.5) * 10;
                            const sparkY = pos.y + (Math.random() - 0.5) * 5;
                            clusterCtx.fillRect(sparkX, sparkY, 1.5, 1.5);
                        }
                    }
                } else {
                    dbStoredCount++;

                    const clustT = (s_i - 0.6) / 0.4;
                    const easeClust = clustT < 0.5 ? 4 * clustT * clustT * clustT : 1 - Math.pow(-2 * clustT + 2, 3) / 2;

                    // Add dynamic floating drift for organic node constellations
                    const floatOffset = time * 0.8 + i;
                    const driftX = Math.sin(floatOffset) * 4;
                    const driftY = Math.cos(floatOffset * 1.2) * 2;

                    const targetHub = hubs[catIdx];
                    const targetX = targetHub.x + clusterOffsets[i].x + driftX;
                    const targetY = targetHub.y + clusterOffsets[i].y + driftY;

                    const nodeX = xDB + (targetX - xDB) * easeClust;
                    const nodeY = 270 + (targetY - 270) * easeClust;

                    currentNodes.push({
                        x: nodeX,
                        y: nodeY,
                        catIdx: catIdx,
                        color: catColor,
                        progress: easeClust
                    });
                }
            }

            const dbGlow = dbStoredCount > 0 ? Math.min(1, dbStoredCount / numDocs) : 0;
            // Draw Isometric Neural Core DB
            drawNeuralCore(clusterCtx, xDB, 270, dbGlow);

            // Connections (constellation links)
            for (let i = 0; i < currentNodes.length; i++) {
                const nodeA = currentNodes[i];
                if (nodeA.progress < 0.8) continue;

                for (let j = i + 1; j < currentNodes.length; j++) {
                    const nodeB = currentNodes[j];
                    if (nodeB.progress < 0.8) continue;

                    if (nodeA.catIdx === nodeB.catIdx) {
                        const dx = nodeA.x - nodeB.x;
                        const dy = nodeA.y - nodeB.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);

                        if (dist < 45) {
                            clusterCtx.strokeStyle = nodeA.color.replace("1)", "0.15)");
                            clusterCtx.lineWidth = 0.8;
                            clusterCtx.beginPath();
                            clusterCtx.moveTo(nodeA.x, nodeA.y);
                            clusterCtx.lineTo(nodeB.x, nodeB.y);
                            clusterCtx.stroke();

                            // Flowing light dot between nodes
                            const pulseRatio = (time * 1.5 + i + j) % 1.0;
                            const pulseX = nodeA.x + (nodeB.x - nodeA.x) * pulseRatio;
                            const pulseY = nodeA.y + (nodeB.y - nodeA.y) * pulseRatio;

                            clusterCtx.fillStyle = nodeA.color.replace("1)", "0.75)");
                            clusterCtx.beginPath();
                            clusterCtx.arc(pulseX, pulseY, 1.2, 0, Math.PI * 2);
                            clusterCtx.fill();
                        }
                    }
                }
            }

            // Draw Nodes
            currentNodes.forEach(node => {
                clusterCtx.save();
                clusterCtx.fillStyle = node.color;
                if (node.progress > 0.95) {
                    clusterCtx.shadowColor = node.color;
                    clusterCtx.shadowBlur = 5;
                }
                clusterCtx.beginPath();
                clusterCtx.arc(node.x, node.y, 3, 0, Math.PI * 2);
                clusterCtx.fill();

                if (node.progress > 0.95) {
                    const pulse = 3 + Math.sin(time * 3.5 + node.x) * 1.5;
                    clusterCtx.strokeStyle = node.color.replace("1)", "0.2)");
                    clusterCtx.lineWidth = 0.8;
                    clusterCtx.beginPath();
                    clusterCtx.arc(node.x, node.y, pulse, 0, Math.PI * 2);
                    clusterCtx.stroke();
                }
                clusterCtx.restore();
            });

            // HUD Diagnostics Telemetry panel
            let activeStage = "INGESTING";
            if (t < 0.15) {
                activeStage = "INGESTING DOCUMENTS";
            } else if (t < 0.4) {
                activeStage = "SCANNING & METADATA ENHANCEMENT";
            } else if (t < 0.6) {
                activeStage = "CALCULATING HIGH-DIM EMBEDDINGS";
            } else if (t < 0.8) {
                activeStage = "VECTOR INDEX DATABASE INGESTION";
            } else {
                activeStage = "TOPIC SPACE SEGREGATION (HDBSCAN)";
            }

            clusterCtx.save();
            clusterCtx.fillStyle = "rgba(10, 10, 15, 0.75)";
            clusterCtx.strokeStyle = "rgba(255, 255, 255, 0.06)";
            clusterCtx.lineWidth = 1;
            clusterCtx.beginPath();
            drawRoundRect(clusterCtx, 15, 15, w - 30, 42, 6);
            clusterCtx.fill();
            clusterCtx.stroke();

            // Telemetry title & state
            clusterCtx.fillStyle = "rgba(0, 255, 255, 0.85)";
            clusterCtx.font = "bold 8px monospace";
            clusterCtx.textAlign = "left";
            clusterCtx.textBaseline = "top";
            clusterCtx.fillText("PIPELINE STATUS: " + activeStage, 25, 23);

            clusterCtx.font = "7.5px monospace";
            clusterCtx.fillStyle = "rgba(255, 255, 255, 0.5)";
            clusterCtx.fillText(`PROCESSED: ${dbStoredCount}/${numDocs} DOCS`, 25, 33);
            clusterCtx.fillText(`THROUGHPUT: ${(t * 125).toFixed(1)} kb/s`, 25, 43);

            // Right side indicators
            clusterCtx.textAlign = "right";
            let dbStatus = "DB_STATE: OFFLINE";
            if (dbStoredCount > 0 && dbStoredCount < numDocs) {
                dbStatus = "DB_STATE: INGESTING...";
                clusterCtx.fillStyle = "rgba(0, 255, 255, 0.95)";
            } else if (dbStoredCount === numDocs) {
                dbStatus = "DB_STATE: CLUSTERS CONVERGED";
                clusterCtx.fillStyle = "rgba(16, 185, 129, 0.95)";
            } else {
                clusterCtx.fillStyle = "rgba(255, 255, 255, 0.35)";
            }
            clusterCtx.fillText(dbStatus, w - 25, 23);

            clusterCtx.fillStyle = "rgba(255, 255, 255, 0.5)";
            if (t > 0.4) {
                const loss = Math.max(0.0112, 1.84 - t * 1.832).toFixed(4);
                clusterCtx.fillText(`LOSS: ${loss}`, w - 25, 33);
                clusterCtx.fillText(`UMAP DIMENSIONS: 768d ➔ 2d`, w - 25, 43);
            } else {
                clusterCtx.fillText(`INITIALIZING EMBEDDING SPACE...`, w - 25, 33);
            }
            clusterCtx.restore();

            // Dynamic bottom-left cluster weights chart
            if (dbStoredCount > 0) {
                clusterCtx.save();
                clusterCtx.fillStyle = "rgba(10, 10, 15, 0.85)";
                clusterCtx.strokeStyle = "rgba(255, 255, 255, 0.05)";
                clusterCtx.lineWidth = 1;
                clusterCtx.beginPath();
                drawRoundRect(clusterCtx, 15, h - 85, 110, 70, 6);
                clusterCtx.fill();
                clusterCtx.stroke();

                clusterCtx.fillStyle = "rgba(255, 255, 255, 0.75)";
                clusterCtx.font = "bold 7.5px monospace";
                clusterCtx.textAlign = "left";
                clusterCtx.textBaseline = "top";
                clusterCtx.fillText("CLUSTER WEIGHTS", 23, h - 77);

                // Compute counts
                let counts = [0, 0, 0, 0];
                for (let idx = 0; idx < numDocs; idx++) {
                    const s_i = Math.min(1, Math.max(0, t * 1.8 - (idx * 0.08)));
                    if (s_i >= 0.6) {
                        counts[docCategories[idx]]++;
                    }
                }

                const labels = ["FIN", "LEG", "OPS", "GEN"];
                const colors = ["rgba(0, 113, 227, 1)", "rgba(139, 92, 246, 1)", "rgba(16, 185, 129, 1)", "rgba(255, 159, 10, 1)"];
                const maxBarWidth = 55;
                
                labels.forEach((label, idx) => {
                    const barY = h - 62 + idx * 11;
                    clusterCtx.fillStyle = "rgba(255, 255, 255, 0.45)";
                    clusterCtx.font = "6px monospace";
                    clusterCtx.textAlign = "left";
                    clusterCtx.textBaseline = "middle";
                    clusterCtx.fillText(label, 23, barY + 3);

                    // Track background
                    clusterCtx.fillStyle = "rgba(255, 255, 255, 0.05)";
                    clusterCtx.beginPath();
                    drawRoundRect(clusterCtx, 43, barY + 1, maxBarWidth, 4, 1);
                    clusterCtx.fill();

                    // Active bar fill
                    const count = counts[idx];
                    const barRatio = count / 5;
                    const width = maxBarWidth * Math.min(1, barRatio);
                    if (width > 0) {
                        clusterCtx.fillStyle = colors[idx];
                        clusterCtx.beginPath();
                        drawRoundRect(clusterCtx, 43, barY + 1, width, 4, 1);
                        clusterCtx.fill();
                    }

                    // Value label
                    clusterCtx.fillStyle = "rgba(255, 255, 255, 0.6)";
                    clusterCtx.font = "6px monospace";
                    clusterCtx.textAlign = "left";
                    clusterCtx.fillText(count.toString(), 43 + maxBarWidth + 4, barY + 3);
                });
                clusterCtx.restore();
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
