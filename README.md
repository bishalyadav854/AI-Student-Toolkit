# 🎓 AI Student Toolkit

**Your smart learning companion powered by Artificial Intelligence.**

AI Student Toolkit is a web application designed to help students learn more efficiently using AI-powered tools. Built with Django and Google's Gemini AI, the platform provides an interactive way to access AI assistance for academic and learning-related tasks.

🌐 **Live Website:** [Visit AI Student Toolkit](https://ai-student-toolkit-wd7o.onrender.com)

## ✨ Features

- 🤖 **AI-Powered Assistance** — Get intelligent responses to your questions using Google Gemini AI.
- 📚 **Student-Focused Tools** — Designed to support students with their daily academic tasks.
- ⚡ **Fast Responses** — Generate AI-powered answers through an integrated API.
- 🌐 **Web-Based Platform** — Access the application through a web browser.
- 📱 **Responsive Interface** — Use the website on supported desktop and mobile browsers.
- ☁️ **Cloud Deployment** — Hosted on Render for online accessibility.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Python | Core programming language |
| Django | Backend web framework |
| Google Gemini AI | AI-powered responses |
| HTML, CSS, JavaScript | Frontend development |
| SQLite | Local development database |
| Render | Cloud hosting and deployment |
| Git & GitHub | Version control and source code management |


## 🚀 Live Demo

Visit the deployed application:

[AI Student Toolkit — Live Website] https://ai-student-toolkit-wd7o.onrender.com

## 💻 Run Locally

Follow these steps to run the project on your computer.

### 1. Clone the Repository

```bash
git clone https://github.com/bishalyadav854/AI-Student-Toolkit.git
cd AI-Student-Toolkit
```

### 2. Create a Virtual Environment

```bash
python -m venv venv
```

Activate it on Windows:

```powershell
venv\Scripts\Activate.ps1
```

On macOS or Linux:

```bash
source venv/bin/activate
```

### 3. Install Dependencies

```bash
python -m pip install -r requirements.txt
```

### 4. Configure Environment Variables

Create a `.env` file in the project root and add your Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-flash-lite-latest
```

Obtain an API key from [Google AI Studio](https://aistudio.google.com/).

**Important:** Never upload your `.env` file or expose your API key publicly. Keep secrets in environment variables.

### 5. Apply Database Migrations

```bash
python manage.py migrate
```

### 6. Start the Development Server

```bash
python manage.py runserver
```

Open the following URL in your browser:

```text
http://127.0.0.1:8000/
```

## ☁️ Deployment on Render

This project can be hosted on [Render](https://render.com/).

1. Push the project to GitHub.
2. Create a new **Web Service** on Render and connect your repository.
3. Configure the build command to install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Configure the start command according to your production setup. For example:

   ```bash
   gunicorn <your_project_name>.wsgi:application
   ```

   Replace `<your_project_name>` with the Django project package containing `wsgi.py`. Ensure Gunicorn is included in your requirements.

5. Add the required environment variables in the Render dashboard, including `GEMINI_API_KEY`, `GEMINI_MODEL`, and your production Django settings.
6. Deploy the service and open the generated Render URL.

**Production note:** Configure `DEBUG=False`, allowed hosts, HTTPS, static files, and a persistent production database as appropriate. Render's local filesystem may be ephemeral, so do not rely on SQLite files surviving redeployments unless persistent storage is configured.

## 🔐 Security

- Store API keys and Django secrets in environment variables.
- Never commit `.env` files or other credentials to GitHub.
- Disable Django debug mode in production.
- Configure allowed hosts and trusted origins for the deployed domain.
- Apply appropriate authentication, rate limiting, and API usage controls where required.

## 🎯 Project Goals

- Make AI assistance more accessible to students.
- Simplify everyday learning tasks.
- Explore the integration of generative AI with web development.
- Demonstrate practical skills in Python, Django, API integration, and cloud deployment.

## 🔮 Future Improvements

- Add more AI-powered study tools.
- Generate summaries and practice questions from study material.
- Introduce user accounts and personalized learning history.
- Add document upload and processing features.
- Improve the interface and accessibility.
- Expand support for additional AI models and educational workflows.

## 👨‍💻 Author

**Bishal Kumar Yadav**

B.Tech — Computer Science and Engineering

GitHub: [@bishalyadav854](https://github.com/bishalyadav854)

## 📄 License

This project is available for educational and personal learning purposes. Add a `LICENSE` file to specify the terms under which others may use, modify, and distribute the code.
