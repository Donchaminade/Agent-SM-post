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

# Initialisation des modèles Gemini
# Mettre à jour les noms des modèles ici!
model_text = genai.GenerativeModel('gemini-1.5-flash') # Recommandé pour le texte
model_vision = genai.GenerativeModel('gemini-1.5-flash') # gemini-1.5-flash gère aussi la vision
# Ancien: model_text = genai.GenerativeModel('gemini-pro')
# Ancien: model_vision = genai.GenerativeModel('gemini-pro-vision')


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
                # Lire les bytes de l'image
                image_bytes = file.read()
                # Créer un objet part pour Gemini
                image_part = {
                    'mime_type': file.mimetype,
                    'data': image_bytes
                }
                gemini_content.append(image_part)
                print(f"Image '{file.filename}' chargée pour analyse.")
                # Utiliser le modèle vision pour l'image
                selected_model = model_vision # Assurez-vous que gemini-1.5-flash est utilisé ici
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
                # Utiliser le modèle texte pour le PDF
                selected_model = model_text
            except Exception as e:
                return jsonify({"error": f"Erreur lors du traitement du PDF : {str(e)}"}), 500
        else:
            return jsonify({"error": "Type de fichier non supporté. Veuillez charger une image ou un PDF."}), 400
    # Si pas de fichier, selected_model reste model_text par défaut


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
            "max_chars": 600, # Typiquement plus long que X, mais pas aussi long que LinkedIn
            "hashtags": "3-7 hashtags pertinents pour la communauté",
            "style": "plus chaleureux tout en restant professionnel, encourageant l'interaction et le partage. L'accroche peut être une histoire courte, une question ouverte, ou une invitation à une discussion. Mettez l'accent sur la communauté et la relation client."
        },
        "instagram": {
            "max_chars": 2200, # La limite est très élevée, mais le texte doit rester concis
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
            # S'assurer d'utiliser le bon modèle (vision si image, texte sinon)
            response = selected_model.generate_content(platform_prompt)
            post_content = response.text.strip()

            # Post-traitement pour les limites de caractères
            if len(post_content) > specs['max_chars']:
                post_content = post_content[:specs['max_chars'] - 3] + "..." # Tronquer et ajouter des points de suspension

            generated_posts[platform] = post_content
            print(f"Post pour {platform.capitalize()} généré avec succès.")

        except Exception as e:
            # On log l'erreur pour le débogage et on renvoie un message à l'utilisateur
            error_message = f"Erreur lors de la génération du post pour {platform.capitalize()} : {str(e)}"
            generated_posts[platform] = error_message
            print(error_message) # Print the error to the console for debugging

    return jsonify(generated_posts)

if __name__ == '__main__':
    app.run(debug=True, port=5000)