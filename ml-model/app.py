from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import re

app = Flask(__name__)
CORS(app)

# Load the trained model
try:
    with open('model.pkl', 'rb') as f:
        model = pickle.load(f)
except FileNotFoundError:
    print("WARNING: model.pkl not found. Please run train.py to generate it.")
    model = None

def check_rules(job_data):
    reasons = []
    text = (job_data.get('title', '') + " " + job_data.get('description', '') + " " + job_data.get('requirements', '')).lower()
    
    # 1. Suspicious keywords
    suspicious_keywords = ["scam", "earn quick money", "no experience required", "money transfer", "wire transfer", "western union", "$5000 weekly", "cash bonus"]
    for kw in suspicious_keywords:
        if kw in text:
            reasons.append(f"Suspicious keyword found: '{kw}'")
            
    # 2. Email domain validation
    email_pattern = r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+'
    emails = re.findall(email_pattern, text)
    suspicious_domains = ['yahoo.com', 'gmail.com', 'hotmail.com']
    for email in emails:
        domain = email.split('@')[1]
        if domain in suspicious_domains:
            reasons.append(f"Generic email provider used ({domain}), common in fake postings.")
            
    # 3. Missing company info
    company = job_data.get('company_profile', '')
    if not company or len(company.strip()) < 10:
        reasons.append("Missing or very short company description.")
        
    return reasons

@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({'error': 'Model not loaded.'}), 500
        
    data = request.json
    
    # Extract
    title = data.get('title', '')
    company_profile = data.get('company_profile', '')
    description = data.get('description', '')
    requirements = data.get('requirements', '')
    
    # Rule-based checking
    reasons = check_rules(data)
    
    # Predict using ML
    combined_text = [title + " " + company_profile + " " + description + " " + requirements]
    
    # Get probability
    prob = model.predict_proba(combined_text)[0]
    fake_prob = prob[1] # 1 is 'fraudulent'
    
    confidence = round(fake_prob * 100, 2)
    is_fake = fake_prob > 0.5
    
    # Adjust prediction and confidence based on hard rules if needed
    if len(reasons) > 1 and not is_fake:
         is_fake = True
         confidence = max(confidence, 75.0) # Boosting confidence based on rules
         reasons.append("Rule-based override: multiple suspicious patterns detected.")
    
    # Also if ML is very confident it is fake, but we found no rules, add a reason
    if is_fake and len(reasons) == 0:
        reasons.append("ML Model flagged linguistic patterns similar to known fake postings.")
        
    return jsonify({
        'is_fake': bool(is_fake),
        'confidence': confidence,
        'reasons': reasons
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
