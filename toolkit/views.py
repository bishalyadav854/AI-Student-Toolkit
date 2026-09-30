import json
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from .services.gemini import ask_text, ask_json

def home(request):
    return render(request, 'index.html')

def body(request):
    try: return json.loads(request.body.decode('utf-8'))
    except Exception: return {}

def ai_api(request):
    if request.method != 'POST': return JsonResponse({'error':'POST required'}, status=405)
    data = body(request); task = data.get('task'); d = data.get('data', {})
    try:
        if task == 'resume':
            prompt=f'''Write a polished student resume using ONLY this information. Never invent facts.\nName: {d.get('name')}\nContact: {d.get('contact')}\nEducation: {d.get('education')}\nSkills: {d.get('skills')}\nExperience/Projects: {d.get('experience')}\nObjective: {d.get('objective')}\nUse clear professional headings and concise wording.'''
            return JsonResponse({'result':ask_text(prompt)})
        if task == 'notes':
            prompt=f'''Convert this study material into short exam-oriented Markdown notes. Use headings, bullets, definitions and examples where supported. Do not invent facts.\n\n{d.get('text')}'''
            return JsonResponse({'result':ask_text(prompt)})
        if task == 'ppt':
            schema={'type':'object','properties':{'title':{'type':'string'},'slides':{'type':'array','items':{'type':'object','properties':{'title':{'type':'string'},'bullets':{'type':'array','items':{'type':'string'}}},'required':['title','bullets']}}},'required':['title','slides']}
            prompt=f'Create exactly 6 university presentation slides about {d.get("topic")}. Each has 3-5 concise bullets. Return JSON matching the schema.'
            return JsonResponse({'result':ask_json(prompt,schema)})
        if task == 'mindmap':
            schema={'type':'object','properties':{'title':{'type':'string'},'branches':{'type':'array','items':{'type':'object','properties':{'name':{'type':'string'},'children':{'type':'array','items':{'type':'string'}}},'required':['name','children']}}},'required':['title','branches']}
            prompt=f'Convert this syllabus into a hierarchical mind-map. Use only supplied information. Return JSON.\n{d.get("text")}'
            return JsonResponse({'result':ask_json(prompt,schema)})
        if task == 'quiz':
            schema={'type':'object','properties':{'questions':{'type':'array','items':{'type':'object','properties':{'question':{'type':'string'},'options':{'type':'array','items':{'type':'string'}},'answer':{'type':'integer'},'explanation':{'type':'string'}},'required':['question','options','answer','explanation']}}},'required':['questions']}
            prompt=f'Create 8 MCQs from the following material. Exactly 4 options each. answer is zero-based correct-option index. Return JSON only.\n{d.get("text")}'
            return JsonResponse({'result':ask_json(prompt,schema)})
        if task == 'chat':
            history='\n'.join(f"{m.get('role')}: {m.get('content')}" for m in d.get('history',[])[-10:])
            prompt=f'''You are a helpful university tutor for {d.get("subject","Computer Science")}. Explain simply, accurately and with examples. Previous conversation:\n{history}\nStudent question:\n{d.get("question")}'''
            return JsonResponse({'result':ask_text(prompt)})
        if task == 'flashcards':
            schema={'type':'object','properties':{'cards':{'type':'array','items':{'type':'object','properties':{'question':{'type':'string'},'answer':{'type':'string'}},'required':['question','answer']}}},'required':['cards']}
            prompt=f'Create 10 concise revision flashcards from this material. Return JSON.\n{d.get("text")}'
            return JsonResponse({'result':ask_json(prompt,schema)})
        if task == 'planner':
            schema={'type':'object','properties':{'schedule':{'type':'array','items':{'type':'object','properties':{'day':{'type':'string'},'time':{'type':'string'},'subject':{'type':'string'},'activity':{'type':'string'}},'required':['day','time','subject','activity']}}},'required':['schedule']}
            prompt=f'''Create a realistic 7-day study plan. Subjects: {d.get('subjects')}. Hours/day: {d.get('hours')}. Exam/targets: {d.get('dates')}. Do not exceed available hours. Return JSON.'''
            return JsonResponse({'result':ask_json(prompt,schema)})
        return JsonResponse({'error':'Unknown task'}, status=400)
    except Exception as exc:
        return JsonResponse({'error':str(exc)}, status=500)

ai_api = csrf_exempt(ai_api)
