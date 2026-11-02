import json
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from .services.gemini import ask_text, ask_json

def home(request):
    return render(request, 'index.html')

def body(request):
    try:
        return json.loads(request.body.decode('utf-8'))
    except Exception:
        return {}

@csrf_exempt
def ai_api(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=405)

    data = body(request)
    task = data.get('task')
    d = data.get('data', {})

    try:
        if task == 'resume':
            prompt = (
                "Act as a senior technical recruiter and ATS optimization specialist.\n"
                "Convert the candidate details below into high-scoring, professional ATS resume bullet points.\n"
                f"Name: {d.get('name')}\n"
                f"Contact: {d.get('contact')}\n"
                f"Education: {d.get('education')}\n"
                f"Skills: {d.get('skills')}\n"
                f"Experience/Projects: {d.get('experience')}\n"
                f"Objective: {d.get('objective')}\n\n"
                "Formatting Instructions:\n"
                "- Rewrite experience and projects using strong action verbs (Engineered, Architected, Optimized).\n"
                "- Quantify impacts following the Google X-Y-Z formula: 'Accomplished [X], as measured by [Y], by doing [Z]'.\n"
                "- Do not invent facts, companies, or institutions.\n"
                "- Output clean, structured markdown bullets ready for ATS parsing."
            )
            return JsonResponse({'result': ask_text(prompt)})

        if task == 'notes':
            prompt = (
                "Convert this study material into short exam-oriented Markdown notes. "
                "Use headings (##, ###), bullet points, definitions, and code blocks where applicable. "
                "Do not invent facts.\n\n"
                f"{d.get('text')}"
            )
            return JsonResponse({'result': ask_text(prompt)})

        if task == 'ppt':
            schema = {
                'type': 'object',
                'properties': {
                    'title': {'type': 'string'},
                    'slides': {
                        'type': 'array',
                        'items': {
                            'type': 'object',
                            'properties': {
                                'title': {'type': 'string'},
                                'bullets': {
                                    'type': 'array',
                                    'items': {'type': 'string'}
                                }
                            },
                            'required': ['title', 'bullets']
                        }
                    }
                },
                'required': ['title', 'slides']
            }
            prompt = f"Create exactly 6 university presentation slides about {d.get('topic')}. Each slide must have 3-5 concise bullets. Return JSON strictly matching the schema."
            return JsonResponse({'result': ask_json(prompt, schema)})

        if task == 'mindmap':
            schema = {
                'type': 'object',
                'properties': {
                    'title': {'type': 'string'},
                    'branches': {
                        'type': 'array',
                        'items': {
                            'type': 'object',
                            'properties': {
                                'name': {'type': 'string'},
                                'children': {
                                    'type': 'array',
                                    'items': {'type': 'string'}
                                }
                            },
                            'required': ['name', 'children']
                        }
                    }
                },
                'required': ['title', 'branches']
            }
            prompt = f"Convert this syllabus into a hierarchical mind-map. Use only supplied information. Return JSON strictly matching schema.\n{d.get('text')}"
            return JsonResponse({'result': ask_json(prompt, schema)})

        if task == 'quiz':
            schema = {
                'type': 'object',
                'properties': {
                    'questions': {
                        'type': 'array',
                        'items': {
                            'type': 'object',
                            'properties': {
                                'question': {'type': 'string'},
                                'options': {
                                    'type': 'array',
                                    'items': {'type': 'string'}
                                },
                                'answer': {'type': 'integer'},
                                'explanation': {'type': 'string'}
                            },
                            'required': ['question', 'options', 'answer', 'explanation']
                        }
                    }
                },
                'required': ['questions']
            }
            prompt = f"Create 8 MCQs from the following material. Exactly 4 options each. answer is zero-based correct-option index (0, 1, 2, or 3). Return JSON only.\n{d.get('text')}"
            return JsonResponse({'result': ask_json(prompt, schema)})

        if task == 'chat':
            history_list = d.get('history', [])[-10:]
            history = '\n'.join([f"{m.get('role')}: {m.get('content')}" for m in history_list])
            subject = d.get("subject", "Computer Science & Engineering")
            question = d.get("question", "")

            prompt = (
                f"You are a university subject tutor for {subject}.\n"
                "Explain clearly, structurally, and with examples.\n\n"
                f"Student Question:\n{question}\n\n"
                f"Previous conversation:\n{history}\n\n"
                "Formatting Requirements:\n"
                "1. Use markdown headings (###), bold text, and clean lists.\n"
                "2. For algorithms, workflows, architectural designs, lifecycles, or processes, ALWAYS include a valid Mermaid diagram using code blocks like:\n"
                "```mermaid\n"
                "graph TD\n"
                "    A[Start / Component] --> B[Step / Process]\n"
                "    B --> C[Decision]\n"
                "```\n"
                "3. Avoid unstructured raw text walls."
            )
            return JsonResponse({'result': ask_text(prompt)})

        if task == 'flashcards':
            schema = {
                'type': 'object',
                'properties': {
                    'cards': {
                        'type': 'array',
                        'items': {
                            'type': 'object',
                            'properties': {
                                'question': {'type': 'string'},
                                'answer': {'type': 'string'}
                            },
                            'required': ['question', 'answer']
                        }
                    }
                },
                'required': ['cards']
            }
            prompt = f"Create 10 concise revision flashcards from this material. Return JSON strictly matching schema.\n{d.get('text')}"
            return JsonResponse({'result': ask_json(prompt, schema)})

        if task == 'planner':
            schema = {
                'type': 'object',
                'properties': {
                    'schedule': {
                        'type': 'array',
                        'items': {
                            'type': 'object',
                            'properties': {
                                'day': {'type': 'string'},
                                'time': {'type': 'string'},
                                'subject': {'type': 'string'},
                                'activity': {'type': 'string'}
                            },
                            'required': ['day', 'time', 'subject', 'activity']
                        }
                    }
                },
                'required': ['schedule']
            }
            prompt = (
                f"Create a realistic 7-day study plan. Subjects: {d.get('subjects')}. "
                f"Hours/day: {d.get('hours')}. Exam/targets: {d.get('dates')}. "
                "Do not exceed available hours. Return JSON strictly matching schema."
            )
            return JsonResponse({'result': ask_json(prompt, schema)})

        return JsonResponse({'error': 'Unknown task'}, status=400)

    except Exception as exc:
        return JsonResponse({'error': str(exc)}, status=500)