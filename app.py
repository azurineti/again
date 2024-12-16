from flask import Flask, request, jsonify, send_from_directory
import json
import random
import os

app = Flask(__name__)

# Load questions
with open(os.path.join(os.path.dirname(__file__), '../questions.json'), 'r', encoding='utf-8') as f:
    questions = json.load(f)

current_question = 0
correct_answers = 0

@app.route('/')
def serve_frontend():
    return send_from_directory('../frontend', 'index.html')

@app.route('/<path:path>')
def serve_static_files(path):
    return send_from_directory('../frontend', path)

@app.route('/start', methods=['POST'])
def start_quiz():
    global current_question, correct_answers, questions
    random.shuffle(questions)
    current_question = 0
    correct_answers = 0
    return jsonify({"message": "Quiz started!", "total_questions": len(questions)})

@app.route('/question', methods=['GET'])
def get_question():
    if current_question < len(questions):
        question_data = questions[current_question]
        return jsonify({
            "question": question_data["question"],
            "answers": question_data["answers"],
            "current_question": current_question + 1,
            "total_questions": len(questions)
        })
    else:
        return jsonify({"message": "No more questions!"})

@app.route('/answer', methods=['POST'])
def check_answer():
    global current_question, correct_answers
    data = request.json
    user_answer = data.get('answer')
    correct_answer = questions[current_question]["answers"][0]

    if user_answer == correct_answer:
        correct_answers += 1
        result = "Correct"
    else:
        result = "Incorrect"

    current_question += 1

    return jsonify({
        "result": result,
        "correct_answer": correct_answer,
        "correct_answers": correct_answers,
        "total_questions": len(questions)
    })

@app.route('/results', methods=['GET'])
def get_results():
    return jsonify({
        "correct_answers": correct_answers,
        "total_questions": len(questions)
    })

if __name__ == "__main__":
    app.run(debug=True)
