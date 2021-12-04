# The PULU Project backend

## For regular users

This repository consists of the necessary tools to run the PULU website, also known as the frontend. The frontend repository can be found [here](https://github.com/vives-projectwerk-2021/pulu-frontend). What can be expected from the backend can be found below:

- Forming the backbone of the website (where all the actual functionality is hidden)

- Being the middleman between the actual sensors in the field and the user interface on the website

- Being the manager of the databases we use for this project, meaning everything is controlled by the backend

- Functioning as the request handler that processes the requests from the website

- Running scripts

- Encrypting and/or decrypting data

- Processing user input

These functionalities above are some examples of what a backend can do. The backend used in this project is no different. We are expecting to incorperate multiple of the above statements into the programming of the backend.

Lastly you can find more information about this project destined for developers below.

## For developers

### Installing the backend

To install the backend the following steps can be followed:

#### Cloning the repository

cloning the repository can be done via HTML or SSH (if the right [SSH keys](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account) are provided/configured).

For HTML use:

```bash
git clone https://github.com/vives-projectwerk-2021/pulu-backend.git 
```

For SSH use:

```bash
git clone git@github.com:vives-projectwerk-2021/pulu-backend.git
```

### Running the backend

After you have succesfully cloned the repository the next step is actually running the backend. This can be done locally by executing the following commands.

```bash
cd pulu-backend
npm install
node src/server.js
```

After installing the dependencies the project is now running at **port 3000**. To test your backend you can use an API Client such as Postman or Insomnia. We have already created some [standard HTTP requests](#postman-requests) for you to test out the backend using Postman.

### Postman Requests

Below you can see the workings of some of the Postman requests.

### Versions

| Version | Date       | Sprint |  Description   |
|:--------|:----------:|:------:|----------------|
| 1.0.0   | 08/10/2021 |    1   |                |
| 2.0.0   | 15/10/2021 |    2   |                |
| 3.0.0   | 08/11/2021 |    3   |                |

### Other

This project has been made possible by the Vives Hogeschool at Bruges. The PULU project was carefully supervised by Nico De Witte and Sille Van Landschoot and executed by the students of the third year bachelors degree.

![Vives Logo](img/vives_logo.jpg)
