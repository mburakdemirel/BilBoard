# BilBoard Developer Manual
Bilboard can be used to implement a social network for a university. This application specifically designed for Bilkent University. However, it can be used as a template for other universities as well. The application is written in Python using Django framework. It is not deployed yet but it can be run locally. Due to some requirements of the application, following steps should be followed to run the application locally


## Obtain the Source Code
You can download the source code from our release. Also, you can clone the repository to your local machine.
## Directory Structure
Directory structure of the application is as follows:
### Backend
The backend of the application is in the backend folder. The core folder of the Django project is called bilboard_backend in our project. It contains the **settings.py** file, which contains all of the project's configuration settings. Database configurations, redis configuration, installed applications, token configurations, middleware, templates, and other project-wide settings are examples of these settings. Additional directories and files in the project include application-specific folders for various web application components, **wsgi.py** and **asgi.py** for web server configurations, and **urls.py** for URL routing. The backend structure consists of the combination of many applications to make our project readable and writable. In order for these apps to be recognized, they must be defined in the installed_apps section of the billboard_backend file. For example, userapp is where all user-related tasks will be done. For example, operations such as logging in and updating user fields are done in this app. Similarly, productapp is responsible for the tasks related to the product. There are also apps such as *chatapp*, *notificationapp*, *entryapp*, *mainapp* that perform similar tasks for specific models. Unlike other applications, mainapp keeps migrations, all models in the project in models.py, helper functions in **helpers.py**, and signal events in **signals.py**. Moreover, **manage.py** is in the same subfolder with apps and it runs administrative tasks. Lastly, utility files like **README.md** are not directly involved in the integration but serve as important tools for developers to set up their environment and understand the project.
### Frontend
The frontend of this application is in the frontend folder. The source code is in the **/src** folder. In the /public folder, we have the public components such as **favicon.ico** and **index.html**. In the **/src** folder, we have **/src/components** folder. In the components folder, we have the React components. Also, in the **/src** folder, we have **/src/context** folder, which has the **ContextApi** that is used for managing the state of the application. In the components folder, we have **/src/components/assets** folder where we have files and folders related to Bootstrap. Finally, **App.js** file is in the src folder, which is the main file for our application.


## Build Instructions
Follow the instructions below to build the application locally.
### Requirements
* **Python 3.10**
* **npm 9.6.7**
* **node 18.17.1**
* **Redis 7.2.3**
* **PostgreSQL 14.10**

This application uses a separate backend and frontend. To build the application, first install the source code and dump it into a folder.
### Backend
Bilboard web application uses Redis. In order to run Redis on MacOS, you should install Redis (either using Homebrew or MacPorts) and start the redis by running redis-server command on the terminal. For linux run the following command to install the redis:
`sudo apt-get install redis`

Windows users can download Windows Subsystem Linux (WSL) which is an official Microsoft system to use Linux terminal. WSL installing instructions can be acquired through https://learn.microsoft.com/en-us/windows/wsl/install.

Python is needed to be installed on the machine. Instructions can be found at https://www.python.org/downloads/. In order to use Python via terminal, add Python to the path.\
\
\
After installing Python, you are advised to create a virtual environment. Open a terminal, then run the following code to build a virtual environment.\
`python3 -m venv env`\
\
This command will create a folder named env. Then, navigate to the env/bin folder. Activate the virtual environment by using\
`source env/bin/activate`\
\
Navigate back to the root directory and navigate to the backend folder. First, upgrade Python’s package install manager. \
`python3 -m pip install --upgrade pip`\
\
Then, install the requirements of the project.\
`python3 -m pip install -r requirements.txt`\
\
All requirements for backend are fulfilled. Use the following command to run server.\
`python3 manage.py runserver`\
\
Now the backend runs at ‘http://localhost:8000’.

### Frontend
To build the frontend of this application, first you have to install Node.js and npm. You can install the latest version from the Node website: https://nodejs.org/en.

After installing Node, navigate to the frontend folder by running `cd frontend` command in the terminal. After navigating to the frontend folder, run ‘npm install’ to install all dependencies. After the installations are done, run the frontend server using following command.\
`npm start`

You can access the site at ‘http://localhost:3000’.

