# How to run this project
First of all, creating a virtual environment is recommended. You can create so by the following steps:
- Make sure that you are within the backend folder if not run `cd backend`.
- Then, run `python3 -m venv myvenv` this will create a virtual environment named myenv within the backend folder. (If you name it something else make sure to add it in the .gitignore file)
- If you have MacOS or Linux use `source myvenv/bin/activate`, if you use Windows use `myvenv\Scripts\activate` to activate the virtual environment.
- Then run `python -m pip install --upgrade pip` to make sure that you are using the latest version of pip.
- After that run `pip install -r requirements.txt` to install all the dependencies in requirements.txt