/* =========================================================
   SAMUN — INTERACTION SYSTEM
   ========================================================= */


/* =========================================================
   01. ELEMENTS
   ========================================================= */

const navbar = document.getElementById("navbar");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");


/* =========================================================
   02. NAVBAR SCROLL EFFECT
   ========================================================= */

window.addEventListener(
    "scroll",
    () => {
        if (!navbar) return;

        navbar.classList.toggle(
            "scrolled",
            window.scrollY > 40
        );
    },
    { passive: true }
);


/* =========================================================
   03. MOBILE NAVIGATION
   ========================================================= */

if (menuToggle && navLinks) {

    menuToggle.setAttribute("aria-expanded", "false");

    menuToggle.addEventListener("click", () => {

        const isOpen =
            navLinks.classList.toggle("open");

        menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );
    });


    navLinks
        .querySelectorAll("a")
        .forEach(link => {

            link.addEventListener("click", () => {

                navLinks.classList.remove("open");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );
            });

        });
}


/* =========================================================
   04. ACTIVE PAGE
   ========================================================= */

const currentPage =
    window.location.pathname.split("/").pop() ||
    "index.html";

if (navLinks) {

    navLinks
        .querySelectorAll("a")
        .forEach(link => {

            const href =
                link.getAttribute("href");

            if (href === currentPage) {
                link.classList.add("active");
            }

        });
}


/* =========================================================
   05. SCROLL REVEAL
   ========================================================= */

const revealElements =
    document.querySelectorAll(".reveal");


if ("IntersectionObserver" in window) {

    const revealObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "visible"
                        );

                        revealObserver.unobserve(
                            entry.target
                        );
                    }

                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -40px 0px"
            }
        );


    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

} else {

    revealElements.forEach(element => {
        element.classList.add("visible");
    });

}


/* =========================================================
   06. COUNTDOWN
   ========================================================= */

const conferenceDate =
    new Date(
        "2026-11-02T09:00:00"
    ).getTime();


function updateCountdown() {

    const countdown =
        document.getElementById("countdown");

    if (!countdown) return;


    const difference =
        conferenceDate - Date.now();


    const values = {

        days:
            Math.max(
                0,
                Math.floor(
                    difference / 86400000
                )
            ),

        hours:
            Math.max(
                0,
                Math.floor(
                    difference / 3600000
                ) % 24
            ),

        minutes:
            Math.max(
                0,
                Math.floor(
                    difference / 60000
                ) % 60
            ),

        seconds:
            Math.max(
                0,
                Math.floor(
                    difference / 1000
                ) % 60
            )

    };


    Object.entries(values)
        .forEach(([key, value]) => {

            const element =
                document.getElementById(key);

            if (element) {

                element.textContent =
                    String(value).padStart(
                        2,
                        "0"
                    );

            }

        });

}


updateCountdown();

setInterval(
    updateCountdown,
    1000
);


/* =========================================================
   07. SCHEDULE TABS
   ========================================================= */

document
    .querySelectorAll(".schedule-tab")
    .forEach(tab => {

        tab.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(".schedule-tab")
                    .forEach(button => {

                        button.classList.remove(
                            "active"
                        );

                    });


                document
                    .querySelectorAll(".day-panel")
                    .forEach(panel => {

                        panel.classList.remove(
                            "active"
                        );

                    });


                tab.classList.add("active");


                const panel =
                    document.getElementById(
                        tab.dataset.day
                    );


                if (panel) {
                    panel.classList.add(
                        "active"
                    );
                }

            }
        );

    });


/* =========================================================
   08. CONTACT FORM — FORMSPREE
   ========================================================= */

const contactForm =
    document.getElementById("contactForm");


if (contactForm) {

    contactForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const submitButton =
                contactForm.querySelector(
                    ".contact-submit"
                );


            const buttonText =
                submitButton
                    ? submitButton.querySelector("span")
                    : null;


            if (!submitButton || !buttonText) {
                return;
            }


            const originalText =
                buttonText.textContent;


            submitButton.disabled = true;

            buttonText.textContent =
                "SENDING...";


            try {

                const response =
                    await fetch(
                        contactForm.action,
                        {
                            method: "POST",

                            body:
                                new FormData(
                                    contactForm
                                ),

                            headers: {
                                Accept:
                                    "application/json"
                            }
                        }
                    );


                if (!response.ok) {
                    throw new Error(
                        "Form submission failed."
                    );
                }


                contactForm.reset();


                buttonText.textContent =
                    "SENT ✓";


                setTimeout(() => {

                    buttonText.textContent =
                        originalText;

                    submitButton.disabled =
                        false;

                }, 2200);


            } catch (error) {

                console.error(
                    "Formspree error:",
                    error
                );


                buttonText.textContent =
                    "TRY AGAIN";


                submitButton.disabled =
                    false;


                setTimeout(() => {

                    buttonText.textContent =
                        originalText;

                }, 2200);

            }

        }
    );

}


/* =========================================================
   09. CURSOR 3D PAN EFFECT
   =========================================================
   
   Important:
   This is NOT a floating/rising animation.

   The image simply pans according to cursor position,
   producing a subtle 3D perspective effect.
   ========================================================= */

const canUseTilt =
    window.matchMedia(
        "(hover: hover) and (pointer: fine)"
    ).matches;


function addPanTilt(
    element,
    intensity = 8,
    baseTransform = ""
) {

    if (!element || !canUseTilt) {
        return;
    }


    element.addEventListener(
        "mousemove",
        event => {

            const rect =
                element.getBoundingClientRect();


            const x =
                event.clientX - rect.left;

            const y =
                event.clientY - rect.top;


            const centerX =
                rect.width / 2;

            const centerY =
                rect.height / 2;


            const rotateY =
                ((x - centerX) / centerX) *
                intensity;


            const rotateX =
                ((centerY - y) / centerY) *
                intensity;


            element.style.transform =
                `
                ${baseTransform}
                perspective(1000px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateZ(8px)
                scale(1.015)
                `;
        }
    );


    element.addEventListener(
        "mouseleave",
        () => {

            element.style.transform =
                baseTransform +
                " perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0) scale(1)";

        }
    );

}


/* =========================================================
   10. ABOUT IMAGE
   ========================================================= */

const aboutImage =
    document.querySelector(
        ".about-image-frame"
    );


addPanTilt(
    aboutImage,
    7,
    ""
);


/* =========================================================
   11. HERO IMAGE
   ========================================================= */

const heroImage =
    document.querySelector(
        ".hero-emblem > img"
    );


addPanTilt(
    heroImage,
    6,
    "translate(155px, 90px)"
);


/* =========================================================
   12. COMMITTEE CARD POINTER LIGHT
   ========================================================= */

if (canUseTilt) {

    document
        .querySelectorAll(".committee-card")
        .forEach(card => {

            card.addEventListener(
                "mousemove",
                event => {

                    const rect =
                        card.getBoundingClientRect();


                    const x =
                        event.clientX -
                        rect.left;


                    const y =
                        event.clientY -
                        rect.top;


                    card.style.setProperty(
                        "--mouse-x",
                        `${x}px`
                    );


                    card.style.setProperty(
                        "--mouse-y",
                        `${y}px`
                    );

                }
            );

        });

}


/* =========================================================
   13. CLOSE MOBILE MENU WHEN ESC IS PRESSED
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            navLinks &&
            navLinks.classList.contains("open")
        ) {

            navLinks.classList.remove(
                "open"
            );


            if (menuToggle) {

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        }

    }
);