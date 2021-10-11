# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Build instructions

Note, using a docker registry the building process can be done locally.

- Backup any previous setting files (mainly `.env`).
- Login to the Docker registry if you have not done so on the building machine before with command: `docker login <REGISTRY_HOST>` where `<REGISTRY_HOST>` is the host address of the Docker registry.
- Create a new `.env` file from the template by running command: `cp .env.template .env`
- Add proper values for the environment variables in the created `.env` file.
    - Some variables are only used in the building process: `ELASTICSEARCH_HOST,
CONFIG_HOST, ADAPTER_HOST, ADAPTER_TOKEN, COURSE_ID`
    - Docker image name is used both in build and deployment processes: `EDU_DASHBOARD_IMAGE`
    - The port number is not required in the deployment process: `HOST_PORT`
- Build Docker image with command: `docker-compose build`
- Push Docker image to the registry: `docker push <EDU_DASHBOARD_IMAGE>` where `<EDU_DASHBOARD_IMAGE>` is the Docker image name you had used in the `.env` file.

## Deployment instructions

Do all of the following in the deployment server.

- Login to the Docker registry if you have not done so on the deployment server before with command: `docker login <REGISTRY_HOST>` where `<REGISTRY_HOST>` is the host address of the Docker registry.
- Get the following files from the repository to a new folder:
    - nginx.conf
    - docker-compose.yml
    - .env.template.env
- Create a new `.env` file from the template by running command: `cp .env.template .env`
- Add proper values for the environment variables in the created `.env` file.
    - Only the Docker image name, `EDU_DASHBOARD_IMAGE`, and the port number, `HOST_PORT`, are required in the deployment server.
    - You must use the same Docker image name that you used when pushing the image to the Docker registry.
- Create `.htpasswd` file by running command: `htpasswd -c .htpasswd <USERNAME>` where `<USERNAME>` is the the username for the webpage. You will be asked for the password that you want to use.
    - Install htpasswd with `sudo apt install apache2-utils` if needed.
- Pull the build Docker image to the deployment server with command: `docker pull <EDU_DASHBOARD_IMAGE>` where `<EDU_DASHBOARD_IMAGE>` is the Docker image name you had used in the `.env` file.
- Deploy the dashboard with command: `docker-compose up --no-build -d`

## Removal instructions

- Stop the running service with command: `docker-compose down --remove-orphans`
- Remove the used Docker image with command: `docker rmi <EDU_DASHBOARD_IMAGE>` where `<EDU_DASHBOARD_IMAGE>` is the used Docker image name.

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `yarn build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
