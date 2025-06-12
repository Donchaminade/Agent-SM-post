-----

Absolument \! Voici un fichier `README.md` complet qui couvre l'intégralité du processus de mise en place de votre projet "Agent de Génération de Posts IA", depuis le début jusqu'à la fin. Il inclut toutes les commandes, les fichiers et les explications nécessaires.

-----

# Agent de Génération de Posts IA

Bienvenue sur l'Agent de Génération de Posts IA \! Ce projet vous permet de générer automatiquement des contenus pour différentes plateformes de médias sociaux (LinkedIn, X/Twitter, Facebook, Instagram) en utilisant l'API Gemini de Google. Vous pouvez fournir une description textuelle, et même une image ou un document PDF pour enrichir le contexte.

Le projet est structuré avec un backend **Flask** (Python) et un frontend interactif en **HTML, CSS (Tailwind CSS) et JavaScript**.

-----

## Fonctionnalités

  * **Génération de Posts par IA** : Utilise l'API Google Gemini (modèle `gemini-1.5-flash`) pour créer des posts adaptés à chaque plateforme.
  * **Support Multimodal** : Capacité à analyser des descriptions textuelles, des images (PNG, JPG, JPEG, WebP) et des documents PDF pour la génération de contenu.
  * **Personnalisation** : Choix de la tonalité (professionnelle, amicale, créative, etc.) et définition du public cible.
  * **Interface Utilisateur Moderne** : Frontend stylisé avec Tailwind CSS pour une expérience utilisateur agréable et responsive.
  * **Mode Sombre/Clair** : Bascule facile entre les thèmes clair et sombre, avec persistance du choix.
  * **Animation de Fond** : Particules animées en arrière-plan avec un effet arc-en-ciel dynamique grâce à Particles.js.
  * **Animations au Scroll** : Les éléments de l'interface apparaissent en douceur à mesure que l'utilisateur fait défiler la page.
  * **Bouton WhatsApp** : Accès rapide pour contacter le développeur via WhatsApp.
  * **Boutons de Copie** : Copiez facilement le contenu généré pour chaque plateforme.

-----

## Prérequis

Avant de commencer, assurez-vous d'avoir les éléments suivants installés sur votre système :

  * **Python 3.8+**
  * **pip** (gestionnaire de paquets Python, généralement inclus avec Python)
  * **Une clé API Google Gemini** : Vous pouvez l'obtenir sur [Google AI Studio](https://aistudio.google.com/app/apikey).

-----

## Installation et Mise en Place

Suivez ces étapes pour configurer et exécuter le projet.

### 1\. Cloner le Dépôt (ou Créer le Projet)

Si vous n'avez pas encore de dépôt Git, créez un dossier pour votre projet :

```bash
mkdir social_media_agent
cd social_media_agent
```

### 2\. Créer et Activer l'Environnement Virtuel

Il est fortement recommandé d'utiliser un environnement virtuel pour isoler les dépendances de votre projet.

```bash
python -m venv venv
```

  * **Sur Windows :**
    ```bash
    .\venv\Scripts\activate
    ```
  * **Sur macOS/Linux :**
    ```bash
    source venv/bin/activate
    ```

### 3\. Installer les Dépendances Python

Une fois l'environnement virtuel activé, installez les bibliothèques Python nécessaires :

```bash
pip install Flask google-generativeai PyPDF2 python-dotenv Flask-Cors
```

Pour générer un fichier `requirements.txt` (utile pour le déploiement ou pour d'autres développeurs) :

```bash
pip freeze > requirements.txt
```

### 4\. Configurer la Clé API Gemini

Créez un fichier nommé `.env` à la racine de votre projet (`social_media_agent/.env`) et ajoutez-y votre clé API Gemini :

```dotenv
GEMINI_API_KEY=VOTRE_CLE_API_GEMINI_ICI
```

**Important** : Ne partagez jamais ce fichier `.env` et assurez-vous qu'il est ignoré par votre système de contrôle de version (ajoutez `.env` à votre `.gitignore` si vous utilisez Git).

### 5\. Structure du Projet

Organisez votre projet comme suit :

```
social_media_agent/
├── venv/                       # Environnement virtuel
├── .env                        # Fichier de configuration de la clé API
├── requirements.txt            # Liste des dépendances Python
├── app.py                      # Backend Flask
└── frontend/                   # Dossier du frontend
    ├── index.html              # Structure HTML principale
    └── script.js               # Logique JavaScript (interactions, animations)
```

### 6\. Créer les Fichiers du Backend (`app.py`)

Créez le fichier `app.py` à la racine de votre projet et copiez-y le code suivant :

```python
import os
from flask import Flask, request, jsonify
from dotenv import load_dotenv
import google.generativeai as genai
from PyPDF2 import PdfReader
from flask_cors import CORS

# Charger les variables d'environnement depuis .env
load_dotenv()

app = Flask(__name__)
CORS(app) # Activez CORS pour toute l'application

# --- Configuration de l'API Gemini ---
API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise ValueError("GEMINI_API_KEY non trouvée dans les variables d'environnement. Assurez-vous que votre fichier .env est configuré correctement.")

# Initialisation des modèles Gemini (gemini-1.5-flash gère texte et vision)
model_text = genai.GenerativeModel('gemini-1.5-flash')
model_vision = genai.GenerativeModel('gemini-1.5-flash') # gemini-1.5-flash gère aussi la vision

# --- Route de test ---
@app.route('/')
def home():
    return "Bienvenue sur l'agent de génération de posts ! Le backend est en ligne."

# --- Route principale pour la génération de posts ---
@app.route('/generate-posts', methods=['POST'])
def generate_posts():
    print("Requête de génération de posts reçue.")

    # Récupérer les données du formulaire
    description = request.form.get('description', '')
    tone = request.form.get('tone', 'professional')
    audience = request.form.get('audience', 'général')
    file = request.files.get('file')

    # Initialiser le contenu pour Gemini
    gemini_content = [f"Génère des posts professionnels pour les réseaux sociaux basés sur la description suivante : '{description}'.\n"]
    gemini_content.append(f"La tonalité doit être : {tone}. Le public cible est : {audience}.\n")
    gemini_content.append("Les accroches doivent être captivantes et inciter à la lecture ou à l'action.\n")
    gemini_content.append("Chaque post doit apporter une valeur claire à l'audience cible et inclure un appel à l'action pertinent.\n\n")

    # Déterminer le modèle à utiliser par défaut (texte)
    selected_model = model_text

    # Gérer le fichier téléchargé
    if file:
        file_extension = file.filename.rsplit('.', 1)[1].lower()
        if file_extension in ['png', 'jpg', 'jpeg', 'webp']:
            # C'est une image, utiliser le modèle vision
            try:
                image_bytes = file.read()
                image_part = {
                    'mime_type': file.mimetype,
                    'data': image_bytes
                }
                gemini_content.append(image_part)
                print(f"Image '{file.filename}' chargée pour analyse.")
                selected_model = model_vision
            except Exception as e:
                return jsonify({"error": f"Erreur lors du traitement de l'image : {str(e)}"}), 500
        elif file_extension == 'pdf':
            # C'est un PDF
            try:
                reader = PdfReader(file)
                pdf_text = ""
                for page in reader.pages:
                    pdf_text += page.extract_text() or ""
                gemini_content.append(f"Contenu extrait du PDF : {pdf_text[:1000]}...\n") # Limiter pour éviter de surcharger
                print(f"PDF '{file.filename}' traité, {len(pdf_text)} caractères extraits.")
                selected_model = model_text
            except Exception as e:
                return jsonify({"error": f"Erreur lors du traitement du PDF : {str(e)}"}), 500
        else:
            return jsonify({"error": "Type de fichier non supporté. Veuillez charger une image ou un PDF."}), 400

    # Instructions spécifiques pour chaque plateforme avec limites de caractères
    prompt_platforms = {
        "linkedin": {
            "max_chars": 1300,
            "hashtags": "3-5 hashtags professionnels pertinents",
            "style": "axé sur le leadership d'opinion, le partage de connaissances approfondies, les retours d'expérience ou l'annonce de réussites professionnelles. L'accroche doit être directe, poser une question engageante liée au business, ou présenter une statistique clé. Le style doit être plus rédactionnel et argumenté."
        },
        "x": {
            "max_chars": 280,
            "hashtags": "2-3 hashtags concis et tendances",
            "style": "concis, percutant, avec un ou deux points clés. L'accroche doit être un punchline, une question choc, ou une déclaration audacieuse qui capte l'attention instantanément. L'objectif est la résonance et le partage rapide."
        },
        "facebook": {
            "max_chars": 600,
            "hashtags": "3-7 hashtags pertinents pour la communauté",
            "style": "plus chaleureux tout en restant professionnel, encourageant l'interaction et le partage. L'accroche peut être une histoire courte, une question ouverte, ou une invitation à une discussion. Mettez l'accent sur la communauté et la relation client."
        },
        "instagram": {
            "max_chars": 2200,
            "hashtags": "5-10 hashtags tendance et pertinents (à la fin du post)",
            "style": "inspirant, concis et pertinent pour l'image (si présente). L'accroche peut être une citation impactante, une question courte liée à l'image, ou une invitation à découvrir plus via la bio. Concentrez-vous sur le visuel et l'émotion."
        }
    }

    generated_posts = {}

    for platform, specs in prompt_platforms.items():
        platform_prompt = gemini_content[:] # Copier le contenu de base
        platform_prompt.append(
            f"\nPour {platform.capitalize()} (max {specs['max_chars']} caractères) : "
            f"Génère un post avec une accroche percutante. Le contenu doit être {specs['style']} "
            f"Ajoute {specs['hashtags']}."
        )

        try:
            response = selected_model.generate_content(platform_prompt)
            post_content = response.text.strip()

            # Post-traitement pour les limites de caractères
            if len(post_content) > specs['max_chars']:
                post_content = post_content[:specs['max_chars'] - 3] + "..."

            generated_posts[platform] = post_content
            print(f"Post pour {platform.capitalize()} généré avec succès.")

        except Exception as e:
            error_message = f"Erreur lors de la génération du post pour {platform.capitalize()} : {str(e)}"
            generated_posts[platform] = error_message
            print(error_message)

    return jsonify(generated_posts)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
```

### 7\. Créer les Fichiers du Frontend (`frontend/`)

Créez le dossier `frontend` à la racine de votre projet, puis les fichiers `index.html` et `script.js` à l'intérieur.

**`frontend/index.html`**

```html
<!DOCTYPE html>
<html lang="fr" class="dark"> <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Agent de Génération de Posts IA</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class', // Active le mode sombre basé sur la présence de la classe 'dark' sur <html>
            theme: {
                extend: {
                    colors: {
                        primary: '#007bff', // Couleur primaire (bleu)
                        secondary: '#6c757d', // Couleur secondaire (gris)
                        accent: '#28a745', // Couleur d'accent (vert pour les boutons Copier)
                    }
                }
            }
        }
    </script>
    <script src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">

    <style>
        /* Styles de base pour l'animation d'apparition au scroll */
        .fade-in {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        .fade-in.appear {
            opacity: 1;
            transform: translateY(0);
        }
        /* Styles pour une meilleure esthétique de la barre de défilement */
        body::-webkit-scrollbar {
            width: 8px;
        }
        body::-webkit-scrollbar-track {
            background: #f1f1f1;
        }
        body::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 4px;
        }
        body::-webkit-scrollbar-thumb:hover {
            background: #555;
        }
        /* Barre de défilement en mode sombre */
        .dark body::-webkit-scrollbar-track {
            background: #2d3748; /* Gris foncé */
        }
        .dark body::-webkit-scrollbar-thumb {
            background: #718096; /* Gris plus clair */
        }
        .dark body::-webkit-scrollbar-thumb:hover {
            background: #a0aec0;
        }
    </style>
</head>
<body class="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans min-h-screen flex flex-col items-center justify-center p-4 relative overflow-x-hidden">

    <div id="particles-js" class="absolute inset-0 z-0"></div>

    <div class="relative z-10 w-full max-w-4xl bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8 space-y-8 fade-in">
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-4xl font-extrabold text-primary dark:text-blue-400 text-center flex-grow">
                Créez vos posts Social Media avec l'IA
            </h1>
            <button id="themeToggle" class="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-400 transition-colors duration-300">
                <i class="fas fa-moon text-lg"></i> </button>
        </div>

        <form id="postForm" class="space-y-6">
            <div class="form-group fade-in">
                <label for="description" class="block text-lg font-semibold mb-2">Description ou Prompt :</label>
                <textarea id="description" class="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-blue-400 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300" placeholder="Décrivez le sujet de votre post, le message clé, etc." rows="4" required></textarea>
            </div>

            <div class="form-group fade-in">
                <label for="fileUpload" class="block text-lg font-semibold mb-2">Charger un fichier (Image/PDF - Optionnel) :</label>
                <input type="file" id="fileUpload" accept="image/*, application/pdf" class="w-full text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white dark:file:bg-blue-600 dark:file:text-white hover:file:bg-blue-600 dark:hover:file:bg-blue-700 transition-colors duration-300">
                <small class="block mt-2 text-gray-600 dark:text-gray-400">Seules les images et les PDF sont supportés pour l'instant.</small>
            </div>

            <div class="form-group fade-in">
                <label for="tone" class="block text-lg font-semibold mb-2">Tonalité souhaitée :</label>
                <select id="tone" class="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-blue-400 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300">
                    <option value="professional">Professionnelle</option>
                    <option value="informative">Informative</option>
                    <option value="friendly">Amicale</option>
                    <option value="creative">Créative</option>
                    <option value="humorous">Humoristique</option>
                </select>
            </div>

            <div class="form-group fade-in">
                <label for="audience" class="block text-lg font-semibold mb-2">Public Cible :</label>
                <input type="text" id="audience" placeholder="Ex: Professionnels RH, Futurs clients, Étudiants" class="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-blue-400 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300">
            </div>

            <button type="submit" id="generateBtn" class="w-full py-4 bg-primary text-white font-bold rounded-lg text-xl hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-600 transition-all duration-300 ease-in-out transform hover:scale-105 fade-in">
                Générer les posts
            </button>
            <div id="loading" class="loading-spinner hidden mx-auto w-10 h-10 border-4 border-t-4 border-primary border-t-white rounded-full animate-spin"></div>
            <p id="errorMessage" class="error-message hidden text-center text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg p-3 mt-4"></p>
        </form>

        <div id="results" class="results-container hidden mt-8 pt-8 border-t-2 border-gray-200 dark:border-gray-700 space-y-6 fade-in">
            <h2 class="text-3xl font-bold text-primary dark:text-blue-400 text-center">Posts Générés :</h2>

            <div class="platform-section bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-600 fade-in">
                <h3 class="text-2xl font-semibold text-blue-700 dark:text-blue-300 mb-4">LinkedIn</h3>
                <textarea class="post-content w-full h-40 p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 leading-relaxed resize-y focus:ring-2 focus:ring-blue-400 transition-colors duration-300" id="linkedinPost" readonly></textarea>
                <div class="actions flex justify-end gap-3 mt-4">
                    <button class="copy-btn px-6 py-2 bg-accent text-white font-semibold rounded-lg hover:bg-green-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-400" data-target="linkedinPost">Copier</button>
                </div>
            </div>

            <div class="platform-section bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-600 fade-in">
                <h3 class="text-2xl font-semibold text-blue-700 dark:text-blue-300 mb-4">X (Twitter)</h3>
                <textarea class="post-content w-full h-40 p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 leading-relaxed resize-y focus:ring-2 focus:ring-blue-400 transition-colors duration-300" id="xPost" readonly></textarea>
                <div class="actions flex justify-end gap-3 mt-4">
                    <button class="copy-btn px-6 py-2 bg-accent text-white font-semibold rounded-lg hover:bg-green-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-400" data-target="xPost">Copier</button>
                </div>
            </div>

            <div class="platform-section bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-600 fade-in">
                <h3 class="text-2xl font-semibold text-blue-700 dark:text-blue-300 mb-4">Facebook</h3>
                <textarea class="post-content w-full h-40 p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 leading-relaxed resize-y focus:ring-2 focus:ring-blue-400 transition-colors duration-300" id="facebookPost" readonly></textarea>
                <div class="actions flex justify-end gap-3 mt-4">
                    <button class="copy-btn px-6 py-2 bg-accent text-white font-semibold rounded-lg hover:bg-green-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-400" data-target="facebookPost">Copier</button>
                </div>
            </div>

            <div class="platform-section bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-600 fade-in">
                <h3 class="text-2xl font-semibold text-blue-700 dark:text-blue-300 mb-4">Instagram</h3>
                <textarea class="post-content w-full h-40 p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 leading-relaxed resize-y focus:ring-2 focus:ring-blue-400 transition-colors duration-300" id="instagramPost" readonly></textarea>
                <div class="actions flex justify-end gap-3 mt-4">
                    <button class="copy-btn px-6 py-2 bg-accent text-white font-semibold rounded-lg hover:bg-green-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-400" data-target="instagramPost">Copier</button>
                </div>
            </div>
        </div>
    </div>

    <a href="https://wa.me/22899181626" target="_blank" class="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-110 flex items-center justify-center fade-in">
        <i class="fab fa-whatsapp text-3xl"></i>
    </a>

    <script src="script.js"></script>
</body>
</html>
```

**`frontend/script.js`**

```javascript
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
        '#FF0000', // Rouge
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
```

-----

## Démarrage de l'Application

1.  **Lancez le backend Flask** :
    Ouvrez votre terminal, naviguez jusqu'à la racine du dossier `social_media_agent` et assurez-vous que votre environnement virtuel est activé.

    ```bash
    python app.py
    ```

    Le serveur devrait démarrer sur `http://127.0.0.1:5000/`. Laissez ce terminal ouvert.

2.  **Ouvrez le frontend** :
    Naviguez jusqu'au dossier `social_media_agent/frontend` dans votre explorateur de fichiers et double-cliquez sur `index.html` pour l'ouvrir dans votre navigateur web préféré.

-----

## Utilisation

1.  **Décrivez votre post** : Entrez une description détaillée ou un prompt dans le champ "Description ou Prompt".
2.  **Chargez un fichier (Optionnel)** : Vous pouvez télécharger une image (PNG, JPG, JPEG, WebP) ou un document PDF pour donner plus de contexte à l'IA.
3.  **Choisissez la tonalité** : Sélectionnez la tonalité souhaitée (Professionnelle, Amicale, etc.).
4.  **Définissez votre public cible** : Indiquez qui est l'audience visée par vos posts.
5.  **Générez les posts** : Cliquez sur le bouton "Générer les posts".
6.  **Visualisez et copiez** : Les posts générés par l'IA apparaîtront pour chaque plateforme. Utilisez les boutons "Copier" pour copier facilement le contenu dans votre presse-papiers.
7.  **Mode Sombre/Clair** : Cliquez sur l'icône lune/soleil en haut à droite pour basculer entre les thèmes. Votre préférence sera sauvegardée.
8.  **Contact WhatsApp** : Cliquez sur le bouton WhatsApp flottant pour me contacter.

-----

## Dépannage

  * **`GEMINI_API_KEY non trouvée`** : Assurez-vous que votre fichier `.env` est à la racine du projet et que la clé y est correctement définie.
  * **Erreurs CORS** : Vérifiez que `Flask-CORS` est bien installé (`pip install Flask-Cors`) et que `CORS(app)` est appliqué dans `app.py`.
  * **Erreur `Gemini 1.0 Pro Vision has been deprecated`** : Assurez-vous que vous utilisez bien les modèles `gemini-1.5-flash` dans `app.py`, comme indiqué dans le code fourni.
  * **Les animations ou le thème ne fonctionnent pas** : Vérifiez la console de votre navigateur (F12) pour d'éventuelles erreurs JavaScript. Assurez-vous que les CDN sont correctement chargés (connexion internet requise).

-----

## Auteur

Ce projet a été développé par CHAMINADE DONDAH ADJOLOU
* https://donchaminade.vercel.app
