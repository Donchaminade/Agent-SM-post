// document.addEventListener('DOMContentLoaded', () => {
//     const postForm = document.getElementById('postForm');
//     const descriptionInput = document.getElementById('description');
//     const fileUploadInput = document.getElementById('fileUpload');
//     const toneSelect = document.getElementById('tone');
//     const audienceInput = document.getElementById('audience');
//     const generateBtn = document.getElementById('generateBtn');
//     const loadingSpinner = document.getElementById('loading');
//     const errorMessageDiv = document.getElementById('errorMessage');
//     const resultsContainer = document.getElementById('results');

//     // Récupérer les champs de texte pour les posts
//     const linkedinPost = document.getElementById('linkedinPost');
//     const xPost = document.getElementById('xPost');
//     const facebookPost = document.getElementById('facebookPost');
//     const instagramPost = document.getElementById('instagramPost');

//     // --- Theme Toggle ---
//     const themeToggle = document.getElementById('themeToggle');
//     const htmlElement = document.documentElement;

//     // Check saved theme in localStorage
//     const savedTheme = localStorage.getItem('theme');
//     if (savedTheme) {
//         htmlElement.classList.add(savedTheme);
//         themeToggle.querySelector('i').className = savedTheme === 'dark' ? 'fas fa-sun text-lg' : 'fas fa-moon text-lg';
//     } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
//         // If no saved theme, check system preference
//         htmlElement.classList.add('dark');
//         themeToggle.querySelector('i').className = 'fas fa-sun text-lg';
//     } else {
//         htmlElement.classList.add('light'); // Default to light if no preference
//         themeToggle.querySelector('i').className = 'fas fa-moon text-lg';
//     }

//     themeToggle.addEventListener('click', () => {
//         if (htmlElement.classList.contains('dark')) {
//             htmlElement.classList.remove('dark');
//             htmlElement.classList.add('light');
//             themeToggle.querySelector('i').className = 'fas fa-moon text-lg';
//             localStorage.setItem('theme', 'light');
//         } else {
//             htmlElement.classList.remove('light');
//             htmlElement.classList.add('dark');
//             themeToggle.querySelector('i').className = 'fas fa-sun text-lg';
//             localStorage.setItem('theme', 'dark');
//         }
//     });


//     // --- Particles.js Background Animation ---
//     // Make sure particles.js script is loaded before this
//     particlesJS('particles-js', {
//         "particles": {
//             "number": {
//                 "value": 80,
//                 "density": {
//                     "enable": true,
//                     "value_area": 800
//                 }
//             },
//             "color": {
//                 "value": "#cccccc" // Light particles
//             },
//             "shape": {
//                 "type": "circle",
//                 "stroke": {
//                     "width": 0,
//                     "color": "#000000"
//                 },
//                 "polygon": {
//                     "nb_sides": 5
//                 }
//             },
//             "opacity": {
//                 "value": 0.5,
//                 "random": false,
//                 "anim": {
//                     "enable": false,
//                     "speed": 1,
//                     "opacity_min": 0.1,
//                     "sync": false
//                 }
//             },
//             "size": {
//                 "value": 3,
//                 "random": true,
//                 "anim": {
//                     "enable": false,
//                     "speed": 40,
//                     "size_min": 0.1,
//                     "sync": false
//                 }
//             },
//             "line_linked": {
//                 "enable": true,
//                 "distance": 150,
//                 "color": "#cccccc",
//                 "opacity": 0.4,
//                 "width": 1
//             },
//             "move": {
//                 "enable": true,
//                 "speed": 6,
//                 "direction": "none",
//                 "random": false,
//                 "straight": false,
//                 "out_mode": "out",
//                 "bounce": false,
//                 "attract": {
//                     "enable": false,
//                     "rotateX": 600,
//                     "rotateY": 1200
//                 }
//             }
//         },
//         "interactivity": {
//             "detect_on": "canvas",
//             "events": {
//                 "onhover": {
//                     "enable": true,
//                     "mode": "grab"
//                 },
//                 "onclick": {
//                     "enable": true,
//                     "mode": "push"
//                 },
//                 "resize": true
//             },
//             "modes": {
//                 "grab": {
//                     "distance": 140,
//                     "line_linked": {
//                         "opacity": 1
//                     }
//                 },
//                 "bubble": {
//                     "distance": 400,
//                     "size": 40,
//                     "duration": 2,
//                     "opacity": 8,
//                     "speed": 3
//                 },
//                 "repulse": {
//                     "distance": 200,
//                     "duration": 0.4
//                 },
//                 "push": {
//                     "particles_nb": 4
//                 },
//                 "remove": {
//                     "particles_nb": 2
//                 }
//             }
//         },
//         "retina_detect": true
//     });

//     // Function to update particle color based on theme
//     function updateParticleColor() {
//         const particlesColor = htmlElement.classList.contains('dark') ? "#4a5568" : "#cccccc"; // Darker for dark mode, lighter for light mode
//         if (window.pJSDom && window.pJSDom[0]) {
//             window.pJSDom[0].pJS.particles.color.value = particlesColor;
//             window.pJSDom[0].pJS.particles.line_linked.color = particlesColor;
//             window.pJSDom[0].pJS.fn.particlesDraw(); // Redraw particles
//         }
//     }

//     // Call updateParticleColor initially and on theme change
//     updateParticleColor();
//     themeToggle.addEventListener('click', updateParticleColor);


//     // --- Scroll Animations (Intersection Observer) ---
//     const faders = document.querySelectorAll('.fade-in');

//     const appearOptions = {
//         threshold: 0.1, // Element is 10% visible
//         rootMargin: "0px 0px -50px 0px" // Start animation 50px before it fully enters viewport
//     };

//     const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
//         entries.forEach(entry => {
//             if (!entry.isIntersecting) {
//                 return;
//             } else {
//                 entry.target.classList.add('appear');
//                 appearOnScroll.unobserve(entry.target); // Stop observing once it appears
//             }
//         });
//     }, appearOptions);

//     faders.forEach(fader => {
//         appearOnScroll.observe(fader);
//     });

//     // --- Gérer les boutons "Copier" ---
//     document.querySelectorAll('.copy-btn').forEach(button => {
//         button.addEventListener('click', async (event) => {
//             const targetId = event.target.dataset.target;
//             const textarea = document.getElementById(targetId);
//             try {
//                 await navigator.clipboard.writeText(textarea.value);
//                 // Simple visual feedback: change button text temporarily
//                 event.target.textContent = 'Copié !';
//                 setTimeout(() => {
//                     event.target.textContent = 'Copier';
//                 }, 1500);
//             } catch (err) {
//                 console.error('Erreur lors de la copie: ', err);
//                 alert('Échec de la copie. Veuillez copier manuellement.');
//             }
//         });
//     });

//     // --- Gérer la soumission du formulaire ---
//     postForm.addEventListener('submit', async (event) => {
//         event.preventDefault();

//         errorMessageDiv.style.display = 'none';
//         resultsContainer.style.display = 'none';
//         loadingSpinner.style.display = 'block';
//         generateBtn.disabled = true;
//         generateBtn.classList.add('opacity-50', 'cursor-not-allowed'); // Tailwind classes for disabled state

//         const formData = new FormData();
//         formData.append('description', descriptionInput.value);
//         formData.append('tone', toneSelect.value);
//         formData.append('audience', audienceInput.value);

//         if (fileUploadInput.files.length > 0) {
//             formData.append('file', fileUploadInput.files[0]);
//         }

//         try {
//             const response = await fetch('http://127.0.0.1:5000/generate-posts', {
//                 method: 'POST',
//                 body: formData,
//             });

//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
//             }

//             const data = await response.json();
//             console.log(data);

//             linkedinPost.value = data.linkedin || 'Aucun post LinkedIn généré.';
//             xPost.value = data.x || 'Aucun post X généré.';
//             facebookPost.value = data.facebook || 'Aucun post Facebook généré.';
//             instagramPost.value = data.instagram || 'Aucun post Instagram généré.';

//             resultsContainer.style.display = 'block';
//             // Trigger scroll animation for results container
//             resultsContainer.classList.add('appear');

//         } catch (error) {
//             console.error('Erreur lors de la génération des posts:', error);
//             errorMessageDiv.textContent = `Erreur : ${error.message}. Veuillez réessayer.`;
//             errorMessageDiv.style.display = 'block';
//         } finally {
//             loadingSpinner.style.display = 'none';
//             generateBtn.disabled = false;
//             generateBtn.classList.remove('opacity-50', 'cursor-not-allowed');
//         }
//     });
// });



// document.addEventListener('DOMContentLoaded', () => {
//     // --- Sélecteurs d'éléments du DOM ---
//     const postForm = document.getElementById('postForm');
//     const descriptionInput = document.getElementById('description');
//     const fileUploadInput = document.getElementById('fileUpload');
//     const toneSelect = document.getElementById('tone');
//     const audienceInput = document.getElementById('audience');
//     const generateBtn = document.getElementById('generateBtn');
//     const loadingSpinner = document.getElementById('loading');
//     const errorMessageDiv = document.getElementById('errorMessage');
//     const resultsContainer = document.getElementById('results');

//     const linkedinPost = document.getElementById('linkedinPost');
//     const xPost = document.getElementById('xPost');
//     const facebookPost = document.getElementById('facebookPost');
//     const instagramPost = document.getElementById('instagramPost');

//     // --- Gestion du Mode Sombre / Clair ---
//     const themeToggle = document.getElementById('themeToggle');
//     const htmlElement = document.documentElement; // Représente la balise <html>

//     // Vérifier le thème sauvegardé dans localStorage ou la préférence système
//     const savedTheme = localStorage.getItem('theme');
//     if (savedTheme) {
//         htmlElement.classList.add(savedTheme);
//         // Mettre à jour l'icône en fonction du thème
//         themeToggle.querySelector('i').className = savedTheme === 'dark' ? 'fas fa-sun text-lg' : 'fas fa-moon text-lg';
//     } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
//         // Si pas de thème sauvegardé, vérifier la préférence système
//         htmlElement.classList.add('dark');
//         themeToggle.querySelector('i').className = 'fas fa-sun text-lg';
//     } else {
//         // Par défaut en mode clair
//         htmlElement.classList.add('light');
//         themeToggle.querySelector('i').className = 'fas fa-moon text-lg';
//     }

//     // Écouteur d'événement pour le bouton de bascule du thème
//     themeToggle.addEventListener('click', () => {
//         if (htmlElement.classList.contains('dark')) {
//             htmlElement.classList.remove('dark');
//             htmlElement.classList.add('light');
//             themeToggle.querySelector('i').className = 'fas fa-moon text-lg';
//             localStorage.setItem('theme', 'light');
//         } else {
//             htmlElement.classList.remove('light');
//             htmlElement.classList.add('dark');
//             themeToggle.querySelector('i').className = 'fas fa-sun text-lg';
//             localStorage.setItem('theme', 'dark');
//         }
//     });

//     // --- Animation de fond avec Particles.js (Arc-en-ciel) ---
//     // Initialisation des particules
//     particlesJS('particles-js', {
//         "particles": {
//             "number": {
//                 "value": 80, // Nombre de particules
//                 "density": {
//                     "enable": true,
//                     "value_area": 800
//                 }
//             },
//             "color": {
//                 "value": "#FF0000" // Couleur de départ (sera modifiée dynamiquement)
//             },
//             "shape": {
//                 "type": "circle", // Forme des particules
//                 "stroke": {
//                     "width": 0,
//                     "color": "#000000"
//                 },
//                 "polygon": {
//                     "nb_sides": 5
//                 }
//             },
//             "opacity": {
//                 "value": 0.5, // Opacité des particules
//                 "random": false,
//                 "anim": {
//                     "enable": false,
//                     "speed": 1,
//                     "opacity_min": 0.1,
//                     "sync": false
//                 }
//             },
//             "size": {
//                 "value": 3, // Taille des particules
//                 "random": true,
//                 "anim": {
//                     "enable": false,
//                     "speed": 40,
//                     "size_min": 0.1,
//                     "sync": false
//                 }
//             },
//             "line_linked": {
//                 "enable": true,
//                 "distance": 150, // Distance pour relier les particules
//                 "color": "#FF0000", // Couleur de ligne (sera modifiée dynamiquement)
//                 "opacity": 0.4,
//                 "width": 1
//             },
//             "move": {
//                 "enable": true,
//                 "speed": 6, // Vitesse de déplacement
//                 "direction": "none",
//                 "random": false,
//                 "straight": false,
//                 "out_mode": "out",
//                 "bounce": false,
//                 "attract": {
//                     "enable": false,
//                     "rotateX": 600,
//                     "rotateY": 1200
//                 }
//             }
//         },
//         "interactivity": {
//             "detect_on": "canvas",
//             "events": {
//                 "onhover": {
//                     "enable": true,
//                     "mode": "grab" // Effet au survol
//                 },
//                 "onclick": {
//                     "enable": true,
//                     "mode": "push" // Effet au clic
//                 },
//                 "resize": true
//             },
//             "modes": {
//                 "grab": {
//                     "distance": 140,
//                     "line_linked": {
//                         "opacity": 1
//                     }
//                 },
//                 "bubble": {
//                     "distance": 400,
//                     "size": 40,
//                     "duration": 2,
//                     "opacity": 8,
//                     "speed": 3
//                 },
//                 "repulse": {
//                     "distance": 200,
//                     "duration": 0.4
//                 },
//                 "push": {
//                     "particles_nb": 4
//                 },
//                 "remove": {
//                     "particles_nb": 2
//                 }
//             }
//         },
//         "retina_detect": true
//     });

//     // Tableau de couleurs pour l'arc-en-ciel
//     const rainbowColors = [
//         '#FF0000', // Rouge
//         '#FF7F00', // Orange
//         '#FFFF00', // Jaune
//         '#00FF00', // Vert
//         '#0000FF', // Bleu
//         '#4B0082', // Indigo
//         '#9400D3'  // Violet
//     ];
//     let colorIndex = 0;

//     // Fonction pour changer la couleur des particules
//     function animateParticleColor() {
//         if (window.pJSDom && window.pJSDom[0]) {
//             const pJS = window.pJSDom[0].pJS;

//             // Mettre à jour la couleur des particules et des lignes liées
//             pJS.particles.color.value = rainbowColors[colorIndex];
//             pJS.particles.line_linked.color = rainbowColors[colorIndex];

//             // Forcer le redessin du canvas
//             pJS.fn.particlesDraw();

//             // Passer à la couleur suivante
//             colorIndex = (colorIndex + 1) % rainbowColors.length;
//         }
//     }

//     // Appeler la fonction d'animation toutes les 1.5 secondes
//     setInterval(animateParticleColor, 1500);
//     // Appeler une fois au chargement pour la première couleur
//     animateParticleColor();


//     // --- Animations au Scroll (Intersection Observer) ---
//     const faders = document.querySelectorAll('.fade-in'); // Sélectionne tous les éléments avec la classe 'fade-in'

//     const appearOptions = {
//         threshold: 0.1, // L'élément est considéré comme visible à 10%
//         rootMargin: "0px 0px -50px 0px" // Déclenche l'animation 50px avant qu'il n'atteigne le bas de l'écran
//     };

//     const appearOnScroll = new IntersectionObserver(function(entries, observer) {
//         entries.forEach(entry => {
//             if (!entry.isIntersecting) {
//                 // Si l'élément n'est pas visible, ne rien faire
//                 return;
//             } else {
//                 // Si l'élément est visible, ajouter la classe 'appear' pour déclencher l'animation
//                 entry.target.classList.add('appear');
//                 // Arrêter d'observer cet élément une fois qu'il est apparu
//                 observer.unobserve(entry.target);
//             }
//         });
//     }, appearOptions);

//     // Observer chaque élément 'fade-in'
//     faders.forEach(fader => {
//         appearOnScroll.observe(fader);
//     });

//     // --- Gestion des Boutons "Copier" ---
//     document.querySelectorAll('.copy-btn').forEach(button => {
//         button.addEventListener('click', async (event) => {
//             const targetId = event.target.dataset.target;
//             const textarea = document.getElementById(targetId);
//             try {
//                 // Utiliser l'API Clipboard moderne
//                 await navigator.clipboard.writeText(textarea.value);
//                 // Feedback visuel temporaire
//                 event.target.textContent = 'Copié !';
//                 setTimeout(() => {
//                     event.target.textContent = 'Copier';
//                 }, 1500);
//             } catch (err) {
//                 console.error('Erreur lors de la copie: ', err);
//                 alert('Échec de la copie. Veuillez copier manuellement le contenu.');
//             }
//         });
//     });

//     // --- Gestion de la Soumission du Formulaire ---
//     postForm.addEventListener('submit', async (event) => {
//         event.preventDefault(); // Empêcher le rechargement de la page

//         // Cacher les messages précédents et montrer le spinner
//         errorMessageDiv.style.display = 'none';
//         resultsContainer.style.display = 'none';
//         loadingSpinner.style.display = 'block';
//         // Désactiver le bouton et ajouter des classes Tailwind pour l'état désactivé
//         generateBtn.disabled = true;
//         generateBtn.classList.add('opacity-50', 'cursor-not-allowed');

//         // Préparer les données du formulaire pour l'envoi
//         const formData = new FormData();
//         formData.append('description', descriptionInput.value);
//         formData.append('tone', toneSelect.value);
//         formData.append('audience', audienceInput.value);

//         if (fileUploadInput.files.length > 0) {
//             formData.append('file', fileUploadInput.files[0]);
//         }

//         try {
//             // Envoyer la requête au backend Flask
//             const response = await fetch('http://127.0.0.1:5000/generate-posts', {
//                 method: 'POST',
//                 body: formData,
//             });

//             // Vérifier si la réponse est OK (statut 200)
//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
//             }

//             // Parser la réponse JSON
//             const data = await response.json();
//             console.log(data); // Pour le débogage

//             // Remplir les champs de texte avec les posts générés
//             linkedinPost.value = data.linkedin || 'Aucun post LinkedIn généré.';
//             xPost.value = data.x || 'Aucun post X généré.';
//             facebookPost.value = data.facebook || 'Aucun post Facebook généré.';
//             instagramPost.value = data.instagram || 'Aucun post Instagram généré.';

//             // Afficher le conteneur des résultats et déclencher son animation au scroll
//             resultsContainer.style.display = 'block';
//             resultsContainer.classList.add('appear');

//         } catch (error) {
//             // Gérer les erreurs et afficher un message à l'utilisateur
//             console.error('Erreur lors de la génération des posts:', error);
//             errorMessageDiv.textContent = `Erreur : ${error.message}. Veuillez réessayer.`;
//             errorMessageDiv.style.display = 'block';
//         } finally {
//             // Masquer le spinner et réactiver le bouton
//             loadingSpinner.style.display = 'none';
//             generateBtn.disabled = false;
//             generateBtn.classList.remove('opacity-50', 'cursor-not-allowed');
//         }
//     });
// });




document.addEventListener('DOMContentLoaded', () => {
    // --- Sélecteurs d'éléments du DOM ---
    const postForm = document.getElementById('postForm');
    const descriptionInput = document.getElementById('description');
    const fileUploadInput = document.getElementById('fileUpload');
    const toneSelect = document.getElementById('tone');
    const audienceInput = document.getElementById('audience');
    const generateBtn = document.getElementById('generateBtn');
    const loadingSpinner = document.getElementById('loading');
    const errorMessageDiv = document.getElementById('errorMessage');
    const resultsContainer = document.getElementById('results');

    const linkedinPost = document.getElementById('linkedinPost');
    const xPost = document.getElementById('xPost');
    const facebookPost = document.getElementById('facebookPost');
    const instagramPost = document.getElementById('instagramPost');

    // --- Gestion du Mode Sombre / Clair ---
    const themeToggle = document.getElementById('themeToggle');
    const htmlElement = document.documentElement; // Représente la balise <html>

    // Vérifier le thème sauvegardé dans localStorage ou la préférence système
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        htmlElement.classList.add(savedTheme);
        // Mettre à jour l'icône en fonction du thème sauvegardé
        themeToggle.querySelector('i').className = savedTheme === 'dark' ? 'fas fa-sun text-lg' : 'fas fa-moon text-lg';
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // Si pas de thème sauvegardé, vérifier la préférence système de l'OS
        htmlElement.classList.add('dark');
        themeToggle.querySelector('i').className = 'fas fa-sun text-lg';
    } else {
        // Par défaut en mode clair si aucune préférence détectée
        htmlElement.classList.add('light');
        themeToggle.querySelector('i').className = 'fas fa-moon text-lg';
    }

    // Écouteur d'événement pour le bouton de bascule du thème
    themeToggle.addEventListener('click', () => {
        if (htmlElement.classList.contains('dark')) {
            htmlElement.classList.remove('dark');
            htmlElement.classList.add('light');
            themeToggle.querySelector('i').className = 'fas fa-moon text-lg'; // Icône lune pour le mode clair
            localStorage.setItem('theme', 'light');
        } else {
            htmlElement.classList.remove('light');
            htmlElement.classList.add('dark');
            themeToggle.querySelector('i').className = 'fas fa-sun text-lg'; // Icône soleil pour le mode sombre
            localStorage.setItem('theme', 'dark');
        }
    });

    // --- Animation de fond avec Particles.js (Arc-en-ciel) ---
    // Initialisation des particules
    particlesJS('particles-js', {
        "particles": {
            "number": {
                "value": 80, // Nombre de particules
                "density": {
                    "enable": true,
                    "value_area": 800
                }
            },
            "color": {
                "value": "#FF0000" // Couleur de départ (sera modifiée dynamiquement par l'animation arc-en-ciel)
            },
            "shape": {
                "type": "circle", // Forme des particules
                "stroke": {
                    "width": 0,
                    "color": "#000000"
                },
                "polygon": {
                    "nb_sides": 5
                }
            },
            "opacity": {
                "value": 0.5, // Opacité des particules
                "random": false,
                "anim": {
                    "enable": false,
                    "speed": 1,
                    "opacity_min": 0.1,
                    "sync": false
                }
            },
            "size": {
                "value": 3, // Taille des particules
                "random": true,
                "anim": {
                    "enable": false,
                    "speed": 40,
                    "size_min": 0.1,
                    "sync": false
                }
            },
            "line_linked": {
                "enable": true,
                "distance": 150, // Distance pour relier les particules
                "color": "#FF0000", // Couleur de ligne (sera modifiée dynamiquement par l'animation arc-en-ciel)
                "opacity": 0.4,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": 6, // Vitesse de déplacement des particules
                "direction": "none",
                "random": false,
                "straight": false,
                "out_mode": "out",
                "bounce": false,
                "attract": {
                    "enable": false,
                    "rotateX": 600,
                    "rotateY": 1200
                }
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": {
                    "enable": true,
                    "mode": "grab" // Effet au survol : les particules suivent la souris
                },
                "onclick": {
                    "enable": true,
                    "mode": "push" // Effet au clic : les particules s'éloignent
                },
                "resize": true
            },
            "modes": {
                "grab": {
                    "distance": 140,
                    "line_linked": {
                        "opacity": 1
                    }
                },
                "bubble": {
                    "distance": 400,
                    "size": 40,
                    "duration": 2,
                    "opacity": 8,
                    "speed": 3
                },
                "repulse": {
                    "distance": 200,
                    "duration": 0.4
                },
                "push": {
                    "particles_nb": 4
                },
                "remove": {
                    "particles_nb": 2
                }
            }
        },
        "retina_detect": true
    });

    // Tableau de couleurs pour l'arc-en-ciel
    const rainbowColors = [
        '#1100FFFF', // Rouge
        '#FF7F00', // Orange
        '#FFFF00', // Jaune
        '#00FF00', // Vert
        '#0000FF', // Bleu
        '#4B0082', // Indigo
        '#9400D3'  // Violet
    ];
    let colorIndex = 0;

    // Fonction pour changer la couleur des particules
    function animateParticleColor() {
        if (window.pJSDom && window.pJSDom[0]) {
            const pJS = window.pJSDom[0].pJS;

            // Met à jour la couleur des particules et des lignes liées avec la couleur actuelle de l'arc-en-ciel
            pJS.particles.color.value = rainbowColors[colorIndex];
            pJS.particles.line_linked.color = rainbowColors[colorIndex];

            // Force le redessin du canvas pour appliquer les nouvelles couleurs
            pJS.fn.particlesDraw();

            // Passe à la couleur suivante dans le tableau
            colorIndex = (colorIndex + 1) % rainbowColors.length;
        }
    }

    // Appelle la fonction d'animation toutes les 1.5 secondes (1500 ms) pour un changement de couleur continu
    setInterval(animateParticleColor, 1500);
    // Appelle la fonction une fois au chargement pour que les particules aient immédiatement une couleur
    animateParticleColor();


    // --- Animations au Scroll (Intersection Observer) ---
    // Sélectionne tous les éléments qui doivent apparaître avec une animation au scroll
    const faders = document.querySelectorAll('.fade-in');

    const appearOptions = {
        threshold: 0.1, // L'élément est considéré comme "visible" lorsque 10% de sa surface est dans le viewport
        rootMargin: "0px 0px -50px 0px" // Déclenche l'animation 50px avant que l'élément n'atteigne le bas de l'écran
    };

    // Crée un IntersectionObserver pour détecter la visibilité des éléments
    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                // Si l'élément n'est pas (encore) visible, on ne fait rien
                return;
            } else {
                // Si l'élément est visible, on ajoute la classe 'appear' pour déclencher l'animation CSS
                entry.target.classList.add('appear');
                // Une fois l'animation déclenchée, on arrête d'observer cet élément pour économiser des ressources
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    // Attache l'observateur à chaque élément 'fade-in'
    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    // --- Gestion des Boutons "Copier" ---
    // Sélectionne tous les boutons avec la classe 'copy-btn'
    document.querySelectorAll('.copy-btn').forEach(button => {
        button.addEventListener('click', async (event) => {
            const targetId = event.target.dataset.target; // Récupère l'ID du textarea à copier
            const textarea = document.getElementById(targetId);
            try {
                // Utilise l'API Clipboard moderne pour copier le texte
                await navigator.clipboard.writeText(textarea.value);
                // Fournit un feedback visuel temporaire à l'utilisateur
                event.target.textContent = 'Copié !';
                setTimeout(() => {
                    event.target.textContent = 'Copier';
                }, 1500); // Revertir le texte après 1.5 secondes
            } catch (err) {
                console.error('Erreur lors de la copie: ', err);
                alert('Échec de la copie. Veuillez copier manuellement le contenu.');
            }
        });
    });

    // --- Gestion de la Soumission du Formulaire ---
    postForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Empêche le comportement par défaut de soumission du formulaire (rechargement de la page)

        // Réinitialise l'affichage des messages d'erreur et des résultats, et montre le spinner de chargement
        errorMessageDiv.style.display = 'none';
        resultsContainer.style.display = 'none';
        loadingSpinner.style.display = 'block';
        // Désactive le bouton de génération et applique des styles Tailwind pour l'état désactivé
        generateBtn.disabled = true;
        generateBtn.classList.add('opacity-50', 'cursor-not-allowed');

        // Prépare les données du formulaire pour l'envoi, y compris le fichier si présent
        const formData = new FormData();
        formData.append('description', descriptionInput.value);
        formData.append('tone', toneSelect.value);
        formData.append('audience', audienceInput.value);

        if (fileUploadInput.files.length > 0) {
            formData.append('file', fileUploadInput.files[0]);
        }

        try {
            // Envoie la requête POST au backend Flask pour générer les posts
            const response = await fetch('http://127.0.0.1:5000/generate-posts', {
                method: 'POST',
                body: formData,
            });

            // Vérifie si la réponse du serveur est réussie (statut HTTP 2xx)
            if (!response.ok) {
                const errorData = await response.json();
                // Lance une erreur si la réponse n'est pas OK, avec le message d'erreur du backend si disponible
                throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
            }

            // Parse la réponse JSON du backend
            const data = await response.json();
            console.log(data); // Affiche les données générées dans la console pour le débogage

            // Remplit les zones de texte avec les posts générés pour chaque plateforme
            linkedinPost.value = data.linkedin || 'Aucun post LinkedIn généré.';
            xPost.value = data.x || 'Aucun post X généré.';
            facebookPost.value = data.facebook || 'Aucun post Facebook généré.';
            instagramPost.value = data.instagram || 'Aucun post Instagram généré.';

            // Affiche le conteneur des résultats et déclenche son animation au scroll
            resultsContainer.style.display = 'block';
            resultsContainer.classList.add('appear'); // Fait apparaître les résultats avec l'animation définie

        } catch (error) {
            // Capture et gère les erreurs, affichant un message à l'utilisateur
            console.error('Erreur lors de la génération des posts:', error);
            errorMessageDiv.textContent = `Erreur : ${error.message}. Veuillez réessayer.`;
            errorMessageDiv.style.display = 'block';
        } finally {
            // Cache le spinner et réactive le bouton de génération
            loadingSpinner.style.display = 'none';
            generateBtn.disabled = false;
            generateBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    });
});