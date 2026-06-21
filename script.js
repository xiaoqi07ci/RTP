/* ==========================================================================
   CYBORG ASCENSION INTERACTIVE SYSTEM - TECHFEST 2026
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------------
    // 1. SOUND EFFECT MANAGER
    // ----------------------------------------------------------------------
    const clickSound = document.getElementById('click-sound');
    const hoverSound = document.getElementById('hover-sound');
    const successSound = document.getElementById('success-sound');

    // Muted by default to respect browser policies, will play once user interacts
    function playSFX(audioElement) {
        if (!audioElement) return;
        // Reset and play
        audioElement.currentTime = 0;
        audioElement.play().catch(err => {
            // Silence errors from browser autoplay policies
        });
    }

    // Attach hover sound to navigation links, buttons, hotspots, and event cards
    const hoverElements = document.querySelectorAll('.nav-link, .btn-primary, .btn-secondary, .hotspot, .event-card, .btn-card-action');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            playSFX(hoverSound);
        });
    });

    const clickElements = document.querySelectorAll('.nav-link, .btn-primary, .btn-secondary, .hotspot, .btn-card-action, button, input[type="checkbox"]');
    clickElements.forEach(el => {
        el.addEventListener('click', () => {
            playSFX(clickSound);
        });
    });

    // ----------------------------------------------------------------------
    // 2. RESPONSIVE MOBILE NAVIGATION
    // ----------------------------------------------------------------------
    const menuToggle = document.getElementById('menu-toggle-btn');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });

        // Close menu when clicking a link
        const navItems = document.querySelectorAll('.nav-link');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });
    }

    // ----------------------------------------------------------------------
    // 3. INTERACTIVE CANVAS (NEURAL NETWORK GRID)
    // ----------------------------------------------------------------------
    const canvas = document.getElementById('neural-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null, radius: 150 };

        // Handle canvas sizing
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        }

        // Particle Class
        class Particle {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.size = Math.random() * 2 + 1;
                this.baseX = x;
                this.baseY = y;
                this.density = (Math.random() * 20) + 5;
                this.speedX = (Math.random() * 0.8) - 0.4;
                this.speedY = (Math.random() * 0.8) - 0.4;
            }

            draw() {
                ctx.fillStyle = 'rgba(0, 243, 255, 0.7)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
            }

            update() {
                // Regular drift movement
                this.x += this.speedX;
                this.y += this.speedY;

                // Bounce off boundaries
                if (this.x < 0 || this.x > canvas.width) this.speedX = -this.speedX;
                if (this.y < 0 || this.y > canvas.height) this.speedY = -this.speedY;

                // Mouse interaction (repulsion/attraction)
                if (mouse.x !== null && mouse.y !== null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < mouse.radius) {
                        let force = (mouse.radius - distance) / mouse.radius;
                        let directionX = dx / distance;
                        let directionY = dy / distance;
                        
                        // Shift slowly towards mouse (attraction)
                        this.x += directionX * force * 1.5;
                        this.y += directionY * force * 1.5;
                    }
                }
            }
        }

        // Initialize particle array
        function initParticles() {
            particles = [];
            let numberOfParticles = (canvas.width * canvas.height) / 11000;
            numberOfParticles = Math.min(numberOfParticles, 120); // Cap particles for performance
            
            for (let i = 0; i < numberOfParticles; i++) {
                let x = Math.random() * canvas.width;
                let y = Math.random() * canvas.height;
                particles.push(new Particle(x, y));
            }
        }

        // Draw connecting lines between close particles
        function connectParticles() {
            let maxDistance = 120;
            for (let a = 0; a < particles.length; a++) {
                for (let b = a + 1; b < particles.length; b++) {
                    let dx = particles[a].x - particles[b].x;
                    let dy = particles[a].y - particles[b].y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < maxDistance) {
                        // Calculate opacity based on distance
                        let opacity = 1 - (distance / maxDistance);
                        ctx.strokeStyle = `rgba(0, 243, 255, ${opacity * 0.18})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        // Animation Loop
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw a subtle animated grid pattern in the background
            drawGrid();

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
            connectParticles();
            requestAnimationFrame(animate);
        }

        // Draw static cyber grid lines
        function drawGrid() {
            ctx.strokeStyle = 'rgba(0, 243, 255, 0.02)';
            ctx.lineWidth = 0.5;
            let gridSize = 60;
            
            for (let x = 0; x < canvas.width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
                ctx.stroke();
            }
            for (let y = 0; y < canvas.height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }
        }

        // Mouse listeners
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.x;
            mouse.y = e.y;
        });

        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        window.addEventListener('resize', resizeCanvas);
        
        // Start Canvas system
        resizeCanvas();
        animate();
    }

    // ----------------------------------------------------------------------
    // 4. HERO SECTION GLITCH TITLE
    // ----------------------------------------------------------------------
    const glitchTitle = document.getElementById('glitch-title');
    if (glitchTitle) {
        const originalText = "CYBORG ASCENSION";
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%&*";
        
        function triggerGlitch() {
            let glitchCount = 0;
            const maxGlitches = 3;
            
            const interval = setInterval(() => {
                let glitched = "CYBORG\n<span class='gradient-text'>";
                let secondaryText = "ASCENSION";
                
                // Randomly modify chars of secondary text
                let textArr = secondaryText.split('');
                for (let i = 0; i < textArr.length; i++) {
                    if (Math.random() < 0.25) {
                        textArr[i] = chars[Math.floor(Math.random() * chars.length)];
                    }
                }
                glitched += textArr.join('') + "</span>";
                glitchTitle.innerHTML = glitched;
                
                glitchCount++;
                if (glitchCount >= maxGlitches) {
                    clearInterval(interval);
                    // Reset to original
                    glitchTitle.innerHTML = "CYBORG<br><span class='gradient-text'>ASCENSION</span>";
                }
            }, 80);
        }

        // Glitch occasionally every 7 seconds
        setInterval(() => {
            if (Math.random() < 0.7) {
                triggerGlitch();
            }
        }, 7000);
    }

    // ----------------------------------------------------------------------
    // 5. BIONIC SCHEMA HOTSPOTS DIAGNOSTIC DATABASE
    // ----------------------------------------------------------------------
    const diagnosticDatabase = {
        'neural': {
            title: 'Neural Link Interface',
            id: 'NL-990-X',
            ratio: '99.8%',
            status: 'STABLE // ONLINE',
            statusClass: 'text-green',
            desc: 'Direct biological interface enabling sub-millisecond control of bionic enhancements. Utilizing deep-tissue micro-electrodes linked to the motor cortex, achieving organic neural integration with zero rejection.',
            barWidth: '99.8%',
            telemetryLeft: '0.2 ms LATENCY',
            telemetryRight: 'BANDWIDTH: 12.5 Gb/s'
        },
        'ocular': {
            title: 'Ocular HUD Sensor',
            id: 'OC-412-V',
            ratio: '98.2%',
            status: 'STABLE // ONLINE',
            statusClass: 'text-green',
            desc: 'Holographic retina projector feeding real-time target telemetry directly onto the eye. Integrates with automatic night vision, heat signature tracking, and drone telemetry streams.',
            barWidth: '98.2%',
            telemetryLeft: 'REFRESH: 240 Hz',
            telemetryRight: 'FOV: 160 DEGREES'
        },
        'reactor': {
            title: 'Fusion Reactor Core',
            id: 'RC-001-F',
            ratio: '94.6%',
            status: 'FLUCTUATING // SAFE',
            statusClass: 'text-magenta',
            desc: 'Micro-fusion core supplying power to all prosthetic motor servos. Embedded in the thoracic frame, generating continuous clean power with magnetic shielding protection.',
            barWidth: '94.6%',
            telemetryLeft: 'TEMP: 88.4°C',
            telemetryRight: 'OUTPUT: 55 kW'
        },
        'bionic-arm': {
            title: 'Actuator Bionic Arm',
            id: 'AA-780-K',
            ratio: '97.4%',
            status: 'STABLE // ONLINE',
            statusClass: 'text-green',
            desc: 'Carbon-fiber reinforcement limb driven by high-torque electromagnetic servos. Capable of lifting 350 kg, featuring tactile feedback pads for micro-precision operations.',
            barWidth: '97.4%',
            telemetryLeft: 'FORCE: 3.4 kN',
            telemetryRight: 'TORQUE: 180 Nm'
        },
        'chassis': {
            title: 'Nanotech Epidermal Skin',
            id: 'EC-810-M',
            ratio: '99.1%',
            status: 'STABLE // ONLINE',
            statusClass: 'text-green',
            desc: 'Intelligent mesh layering protecting all delicate sub-circuits. Made of graphene-infused composite that hardens on kinetic impact, with automated nano-repair modules.',
            barWidth: '99.1%',
            telemetryLeft: 'INTEGRITY: 100%',
            telemetryRight: 'THERMAL SHIELD: ACTIVE'
        }
    };

    const hotspots = document.querySelectorAll('.hotspot');
    const diagTitle = document.getElementById('diag-title');
    const diagId = document.getElementById('diag-id');
    const diagRatio = document.getElementById('diag-ratio');
    const diagStatus = document.getElementById('diag-status');
    const diagDesc = document.getElementById('diag-desc');
    const diagBar = document.getElementById('diag-bar');
    const telemetryLeft = document.getElementById('telemetry-value-left');
    const telemetryRight = document.getElementById('telemetry-value-right');

    hotspots.forEach(spot => {
        spot.addEventListener('click', (e) => {
            // Deactivate all hotspots
            hotspots.forEach(s => s.classList.remove('active'));
            
            // Activate current hotspot
            spot.classList.add('active');
            
            const part = spot.getAttribute('data-part');
            const data = diagnosticDatabase[part];
            
            if (data) {
                // Animate diagnostic container entry
                const panel = document.querySelector('.diagnostic-panel');
                panel.style.transform = 'scale(0.98)';
                panel.style.opacity = '0.8';
                
                setTimeout(() => {
                    // Update content
                    diagTitle.textContent = data.title;
                    diagId.textContent = data.id;
                    diagRatio.textContent = data.ratio;
                    diagStatus.textContent = data.status;
                    
                    // Reset status class
                    diagStatus.className = 'stat-value text-mono ' + data.statusClass;
                    
                    diagDesc.textContent = data.desc;
                    diagBar.style.width = data.barWidth;
                    telemetryLeft.textContent = data.telemetryLeft;
                    telemetryRight.textContent = data.telemetryRight;
                    
                    panel.style.transform = 'scale(1)';
                    panel.style.opacity = '1';
                }, 150);

                // Log this hotspot activation to the console terminal
                logToTerminal(`SYSTEMCHECK: Triggering telemetry scan on [${data.title.toUpperCase()}] ID: ${data.id}`, 'system-line');
            }
        });
    });

    // ----------------------------------------------------------------------
    // 6. LIVE CONSOLE TERMINAL SIMULATOR
    // ----------------------------------------------------------------------
    const terminalConsole = document.getElementById('terminal-console');
    const terminalMessages = [
        "SYSCHECK: Ocular targeting sub-grid calibrated.",
        "SECURITY: Bionic motor link encrypted (AES-512).",
        "WIDGET: Running visual scan on ocular sub-grid.",
        "PING main.synapse.iitb.org: 14ms response time.",
        "SYSCHECK: Bio-synth core temperature stable at 37.0°C.",
        "TELEMETRY: Sync pool buffer available. Ready for uplink.",
        "WARNING: External magnetic field detected. Activating shielding.",
        "LOG: Mainframe receiving telemetry packets from secondary nodes.",
        "SYSCHECK: Nanotech epidermal layer self-repair: 100% complete."
    ];

    function logToTerminal(message, cssClass = '') {
        if (!terminalConsole) return;
        
        // Remove blinking cursor if present
        const oldCursor = document.getElementById('term-cursor');
        if (oldCursor) oldCursor.remove();

        const line = document.createElement('div');
        line.className = 'console-line ' + cssClass;
        line.innerHTML = `<span class="console-prompt">&gt;</span> ${message}`;
        terminalConsole.appendChild(line);

        // Re-append cursor at bottom
        const cursor = document.createElement('span');
        cursor.id = 'term-cursor';
        cursor.className = 'console-cursor';
        terminalConsole.appendChild(cursor);

        // Keep scroll at bottom
        terminalConsole.scrollTop = terminalConsole.scrollHeight;
    }

    // Periodically log random system events
    setInterval(() => {
        if (Math.random() < 0.8) {
            const randomMsg = terminalMessages[Math.floor(Math.random() * terminalMessages.length)];
            logToTerminal(randomMsg);
        }
    }, 4500);

    // ----------------------------------------------------------------------
    // 7. TECHFEST 2026 COUNTDOWN TIMER
    // ----------------------------------------------------------------------
    const daysVal = document.getElementById('days');
    const hoursVal = document.getElementById('hours');
    const minutesVal = document.getElementById('minutes');
    const secondsVal = document.getElementById('seconds');

    if (daysVal) {
        // Set event date to Dec 18, 2026
        const targetDate = new Date('December 18, 2026 09:00:00').getTime();

        function updateCountdown() {
            const now = new Date().getTime();
            const difference = targetDate - now;

            if (difference < 0) {
                // If event reached
                daysVal.textContent = "00";
                hoursVal.textContent = "00";
                minutesVal.textContent = "00";
                secondsVal.textContent = "00";
                return;
            }

            // Calculations
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            // Pad values with zero
            daysVal.textContent = String(days).padStart(2, '0');
            hoursVal.textContent = String(hours).padStart(2, '0');
            minutesVal.textContent = String(minutes).padStart(2, '0');
            secondsVal.textContent = String(seconds).padStart(2, '0');
        }

        // Initial call and set interval
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    // ----------------------------------------------------------------------
    // 8. CARD REGISTRATION INTEGRATION
    // ----------------------------------------------------------------------
    const registerButtons = document.querySelectorAll('.btn-card-action');
    const compSelect = document.getElementById('user-comp');

    registerButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const eventName = btn.getAttribute('data-event');
            
            // Map event name to select options
            if (compSelect) {
                if (eventName.includes('RoboWars')) compSelect.value = 'robowars';
                else if (eventName.includes('Neural')) compSelect.value = 'neuralhack';
                else if (eventName.includes('Bio-Synth')) compSelect.value = 'biosynth';
                else if (eventName.includes('Grid Runner')) compSelect.value = 'gridrunner';
            }
        });
    });

    // ----------------------------------------------------------------------
    // 9. REGISTRATION FORM INTERACTION & SUCCESS ANIMATION
    // ----------------------------------------------------------------------
    const registrationForm = document.getElementById('registration-form');
    const formSuccessMessage = document.getElementById('form-success');
    const resetFormBtn = document.getElementById('btn-reset-form');

    if (registrationForm && formSuccessMessage) {
        registrationForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const userName = document.getElementById('user-name').value;
            const userEmail = document.getElementById('user-email').value;
            const userComp = compSelect.options[compSelect.selectedIndex].text;

            // Trigger registration success SFX
            playSFX(successSound);

            // Log registration data stream to the live console
            logToTerminal(`UPLINK: Sync request received from [${userName.toUpperCase()}].`, 'system-line');
            logToTerminal(`UPLINK: Routing to target interface [${userComp.toUpperCase()}].`, 'system-line');
            logToTerminal(`UPLINK: Verification stream: ${userEmail} verified.`, 'system-line');
            logToTerminal(`SUCCESS: Biolink connection established for student: ${userName.toUpperCase()}!`, 'success-line');

            // Hide form and display success panel
            registrationForm.style.opacity = '0';
            setTimeout(() => {
                registrationForm.style.display = 'none';
                formSuccessMessage.style.display = 'flex';
                formSuccessMessage.style.opacity = '1';
            }, 300);
        });

        if (resetFormBtn) {
            resetFormBtn.addEventListener('click', () => {
                // Reset form values
                registrationForm.reset();
                
                // Hide success message, show form
                formSuccessMessage.style.display = 'none';
                registrationForm.style.display = 'block';
                setTimeout(() => {
                    registrationForm.style.opacity = '1';
                }, 50);

                logToTerminal("LOG: Connection link reset. Ready for new sync request.");
            });
        }
    }
});
