# PlantHealth (SWE PS G4T3)

## About

This project was created as part of the Software Engineering proseminar for the summer semester 2023 at the University of Innsbruck.

Our task was to implement a system for remotely monitoring greenhouses. The four main parts of the system are described below - for more detailed information, please refer to the [project wiki](https://git.uibk.ac.at/informatik/qe/swess23/group4/g4t3/-/wikis/home).

### Sensor station

A sensor station is the combination of a mini greenhouse and an Arduino Nano equipped with sensors to monitor the greenhouse's various metrics such as air quality, soil moisture and light level. The Arduino is in possession of a Bluetooth® Low Energy radio receiver/transmitter which is used to communicate with an access point.

### Access point

The access point is a Raspberry Pi, also equipped with Bluetooth® as well as Wi-Fi capabilities. Its main responsibility is to read the sensor values transmitted by multiple sensor stations, average data over a configurable period, and pass the averaged values onto the ReST backend. Furthermore, it checks whether each sensor station's sensor values are within acceptable (configurable) bounds and instructs the corresponding sensor station to emit a warning otherwise.

### Backend

This is a web server, based on the Spring web framework. It serves the frontend web app to the browser and provides a Representational State Transfer (ReST) API for ongoing communication with the aforementioned access points and frontend.

The backend is based on the swe-skeleton project provided by UIBK. It inherits its Maven project structure, Spring Boot core, in-memory H2 database (TODO: replace with MySQL; see !112), basic functionality, and much of the Spring Security configuration.

### Frontend

The frontend is a web-based user interface that allows gardeners to manage their greenhouses, and admins to perform various administrative tasks. Unregistered users can anonymously view photos of greenhouses and add new ones, or sign up for an account should they be so inclined.

See [frontend/README.md](frontend/README.md) for additional information.

## Running the frontend and backend

This project uses Java 17 and Node.js 18 (installed automatically as part of the build process). A MySQL database is used for persistent data storage, which must be set up before starting the application.

### Step 1: Install the database

1. Set up either MySQL or MariaDB on your system. You may use Docker (recommended) or do this manually.

_(a) Docker (recommended)_ \
Run the following command to start a container with persistent storage for the database:

```
docker run -v planthealth_db:/var/lib/mysql -p 3306:3306 \
  -e MYSQL_RANDOM_ROOT_PASSWORD="true" \
  -e MYSQL_DATABASE=swe \
  -e MYSQL_USER=swe \
  -e MYSQL_PASSWORD=password \
  mariadb:latest
```
Note: if you get an error like "docker: error during connect: This error may indicate that the docker daemon is not running" on Windows, you may need to install and start [Docker Desktop](https://www.docker.com/products/docker-desktop/)

_(b) manual setup_\
Install either MySQL or MariaDB, start a MySQL CLI session as `root` user, then run the following SQL:

```
CREATE USER 'swe'@'localhost' identified by 'password';
CREATE DATABASE 'swe';
GRANT ALL PRIVILEGES ON 'swe' TO 'swe'@'localhost';
```

All of the necessary tables will be automatically created in step 2.

### Step 2: Build and run the web server

2. Run `mvn spring-boot:run` on a command line shell to build and start the project. The React frontend will be compiled statically and available at `http://localhost:8080`.

### Login

A login page is available at `http://localhost:8080/login`.\
There are multiple users available by default, their names are found in `/src/main/resources/data.sql`.\
The default password for all users is `passwd`. `admin` and `elvis` are the only users with administrative privileges.

## Development

### Backend

#### Dependencies

- JDK 17 or later
- Maven

The Java project should work out-of-the-box in VSCode (with the Java and Spring Boot extensions) and IntelliJ Idea.\
If `yarn` fails to run during the build process, you may need to install Node.js on your machine.\
Additionally, try `mvn clean` as a troubleshooting step if Spring fails to start up for no apparent reason.

### Frontend

#### Dependencies

- Node.js 18 or later
- yarn

A hot-reload-enabled React.js development server may be started from the [frontend](frontend/) directory using the shell command `yarn start` or `yarn mock`.

The development server is accessible at `http://localhost:3000`. Spring is set up to accept CORS requests and cookies from this URL, meaning that there should be no problems with login or authorization.

For additional information, see [frontend/README.md](frontend/README.md)

### Raspberry Pi (Access Point)

#### Dependencies

- Python 3.9
- pip3
- ... (see [raspberry/README.md](raspberry/README.md))

The Python code found in [raspberry](raspberry/) should run on most Linux computers equipped with Bluetooth® 4.0 or later, but Bleak may not be compatible with all Bluetooth® adapters.

For additional information, see [raspberry/README.md](raspberry/README.md)

### Arduino (Sensor Station)

#### Dependencies

- VSCode with PlatformIO extension

The PlatformIO project found in [arduino](arduino/) should require no further setup.

## Credits

Team members:

- REDACTED-1 (Frontend)
- deneb (Arduino)
- REDACTED-2 (Access point)
- REDACTED-3 (Backend)
- REDACTED-4 (Backend)

### swe-skeleton: provided by UIBK

Contributors:
Christian Sillaber,
Michael Brunner,
Clemens Sauerwein,
Andrea Mussmann,
Alexander Blaas
