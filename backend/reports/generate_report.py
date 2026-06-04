def generate_clinical_html_report(patient, prediction):
    """
    Generates a beautifully-styled, clinical, printable HTML report for a patient's ECG prediction.
    """
    risk_level = prediction.risk_level
    predicted_class = prediction.predicted_class
    confidence = prediction.confidence
    created_at = prediction.created_at.strftime("%Y-%m-%d %H:%M:%S") if hasattr(prediction.created_at, "strftime") else str(prediction.created_at)
    
    # Recommendation text based on risk level
    if risk_level == "High":
        recommendations = (
            "<strong>URGENT MEDICAL CLINICAL ADVISORY:</strong> Ventricular or Fusion Beat detected with high confidence. "
            "Suggest immediate cardiological evaluation. Recommended follow-up tests include a comprehensive 12-lead diagnostic ECG, "
            "echocardiogram, and consultation with a cardiac electrophysiologist."
        )
        badge_color = "#ef4444"  # Red
        badge_bg = "#fef2f2"
        border_color = "#fca5a5"
    elif risk_level == "Medium":
        recommendations = (
            "<strong>CLINICAL RECOMMENDATION:</strong> Supraventricular or Unknown Beat rhythm abnormality detected. "
            "Suggest scheduling a standard check-up with a primary care physician or cardiologist. "
            "A 24-hour Holter monitor study may be appropriate if symptoms (palpitations, dizziness) persist."
        )
        badge_color = "#f97316"  # Orange
        badge_bg = "#fff7ed"
        border_color = "#fed7aa"
    else:
        recommendations = (
            "<strong>ROUTINE RECOMMENDATION:</strong> Normal Beat rhythm pattern detected. No immediate cardiac risk "
            "indicated by the AI model. Suggest regular wellness visits and maintaining standard cardiovascular health "
            "guidelines. Report any sudden onset of palpitations or chest distress."
        )
        badge_color = "#10b981"  # Green
        badge_bg = "#ecfdf5"
        border_color = "#a7f3d0"

    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>ECG AI Clinical Report - Patient #{patient.id}</title>
    <style>
        body {{
            font-family: 'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background-color: #f8fafc;
            color: #1e293b;
            margin: 0;
            padding: 40px 20px;
            display: flex;
            justify-content: center;
        }}
        .report-container {{
            background: #ffffff;
            width: 100%;
            max-width: 800px;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
            border: 1px solid #e2e8f0;
        }}
        .header {{
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }}
        .header-logo {{
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 24px;
            font-weight: 800;
            color: #0f172a;
        }}
        .header-logo span {{
            color: #2563eb;
        }}
        .report-title {{
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: #64748b;
            font-weight: bold;
        }}
        .section-title {{
            font-size: 16px;
            font-weight: 700;
            color: #0f172a;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 8px;
            margin-top: 30px;
            margin-bottom: 15px;
        }}
        .info-grid {{
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin-bottom: 30px;
        }}
        .info-item {{
            display: flex;
            flex-direction: column;
        }}
        .info-label {{
            font-size: 12px;
            color: #64748b;
            font-weight: 600;
            text-transform: uppercase;
        }}
        .info-value {{
            font-size: 15px;
            color: #0f172a;
            font-weight: 500;
            margin-top: 4px;
        }}
        .result-box {{
            background: {badge_bg};
            border: 1px solid {border_color};
            border-radius: 8px;
            padding: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
        }}
        .result-left {{
            display: flex;
            flex-direction: column;
            gap: 5px;
        }}
        .result-label {{
            font-size: 18px;
            font-weight: 700;
            color: #0f172a;
        }}
        .result-conf {{
            font-size: 14px;
            color: #64748b;
        }}
        .risk-badge {{
            background: {badge_color};
            color: #ffffff;
            padding: 8px 16px;
            border-radius: 9999px;
            font-size: 14px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }}
        .rec-box {{
            background: #f8fafc;
            border-left: 4px solid #3b82f6;
            padding: 15px 20px;
            font-size: 14px;
            line-height: 1.6;
            border-radius: 0 8px 8px 0;
            color: #334155;
        }}
        .disclaimer {{
            margin-top: 50px;
            font-size: 11px;
            color: #94a3b8;
            line-height: 1.5;
            border-top: 1px dashed #cbd5e1;
            padding-top: 15px;
        }}
        .signatures {{
            display: flex;
            justify-content: space-between;
            margin-top: 60px;
            padding-top: 20px;
        }}
        .sig-line {{
            width: 45%;
            border-top: 1px solid #cbd5e1;
            text-align: center;
            padding-top: 8px;
            font-size: 12px;
            color: #64748b;
        }}
        .print-btn {{
            position: fixed;
            top: 20px;
            right: 20px;
            background: #2563eb;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
            transition: all 0.2s;
        }}
        .print-btn:hover {{
            background: #1d4ed8;
        }}
        @media print {{
            body {{
                background-color: #ffffff;
                padding: 0;
            }}
            .report-container {{
                box-shadow: none;
                border: none;
                padding: 0;
            }}
            .print-btn {{
                display: none;
            }}
        }}
    </style>
</head>
<body>
    <button class="print-btn" onclick="window.print()">Print Report</button>
    
    <div class="report-container">
        <div class="header">
            <div class="header-logo">
                ❤️ <span>ECG AI</span> System
            </div>
            <div class="report-title">
                Arrhythmia Diagnostic Report
            </div>
        </div>
        
        <div class="section-title">Patient Demographics</div>
        <div class="info-grid">
            <div class="info-item">
                <span class="info-label">Full Name</span>
                <span class="info-value">{patient.name}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Patient ID</span>
                <span class="info-value">#{patient.id}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Age / Gender</span>
                <span class="info-value">{patient.age} years / {patient.gender}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Examination Timestamp</span>
                <span class="info-value">{created_at}</span>
            </div>
        </div>
        
        <div class="section-title">AI Rhythm Analysis Findings</div>
        <div class="result-box">
            <div class="result-left">
                <span class="result-label">{predicted_class}</span>
                <span class="result-conf">Classification Confidence: <strong>{confidence}%</strong></span>
            </div>
            <div class="risk-badge">
                {risk_level} Risk
            </div>
        </div>
        
        <div class="section-title">Clinical Recommendations</div>
        <div class="rec-box">
            {recommendations}
        </div>
        
        <div class="signatures">
            <div class="sig-line">
                Examining Clinician Signature
            </div>
            <div class="sig-line">
                Reviewing Cardiologist & Date
            </div>
        </div>
        
        <div class="disclaimer">
            <strong>NOTICE & DISCLAIMER:</strong> This report is generated dynamically by the ECG AI classification engine using a 1D Convolutional Neural Network trained on the MIT-BIH Arrhythmia database. The classification result is an algorithmic assessment of a 187-point single-lead ECG signal segment and is intended for clinical decision support only. It does not replace independent clinical judgment or standard 12-lead cardiologist reviews.
        </div>
    </div>
</body>
</html>
"""
    return html_content
