  gsap.registerPlugin(ScrollTrigger);

    const dockContainers = document.querySelectorAll('#dock .icon-container');

    // 1. Subtle continuous floating animation for the whole dock
    gsap.to('#dock-wrapper', {
        y: "+=5",
        duration: 2.5,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut'
    });

    // 2. Snake Trail Scroll Effect
    const xSetters = Array.from(dockContainers).map(container => {
        return gsap.quickTo(container, "x", { duration: 1.2, ease: "power3" });
    });

    ScrollTrigger.create({
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
            const progress = self.progress;
            dockContainers.forEach((container, i) => {
                const wave = Math.sin(progress * Math.PI * 4 + i * 1.5) * 35; 
                xSetters[i](wave);
            });
        }
    });

        // 3. Liquid Glass Hover Animations
    dockContainers.forEach(container => {
        const base = container.querySelector('.jelly-base');
        const icon = container.querySelector('.icon');
        let floatTween;

        container.addEventListener('mouseenter', () => {
            gsap.to(base, { 
                opacity: 1, 
                scaleY: 1.5, 
                duration: 0.4, 
                ease: 'power2.out' 
            });

            gsap.to(icon, { 
                x: 10, 
                y: -8, 
                scale: 1.1, 
                duration: 0.4, 
                ease: 'back.out(2)',
                backgroundColor: "#e3e3e3", // HOVER: Elegant Burnt Orange
                color: "#C75D26", // HOVER: Soft Charcoal Icon
                boxShadow: "0 0 20px rgba(199, 93, 38, 0.3), inset 0 1px 1px rgba(255,255,255,0.4), inset 0 -1px 2px rgba(0,0,0,0.2)",
                borderColor: "rgba(0,0,0,0.1)" 
            });

            floatTween = gsap.to(icon, { 
                y: -12, 
                duration: 1, 
                yoyo: true, 
                repeat: -1, 
                ease: 'sine.inOut' 
            });
        });

        container.addEventListener('mouseleave', () => {
            floatTween.kill();

            gsap.to(base, { 
                opacity: 0, 
                scaleY: 0.5, 
                duration: 0.4, 
                ease: 'power2.in' 
            });

            gsap.to(icon, { 
                x: 0, 
                y: 0, 
                scale: 1, 
                duration: 0.5, 
                ease: 'elastic.out(1, 0.5)',
                backgroundColor: "#C75D26", // REVERT: Soft Charcoal Background
                color: "#e3e3e3", // REVERT: Elegant Orange Icon
                boxShadow: "0 4px 15px rgba(0,0,0,0.15), inset 0 1px 1px rgba(255,255,255,0.2), inset 0 -1px 2px rgba(0,0,0,0.3)",
                borderColor: "rgba(255, 255, 255, 0.1)" 
            });
        });
    });