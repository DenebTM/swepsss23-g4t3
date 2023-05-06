# PlantHealth (SWE PS G4T3)

## About

This project was created as part of the Software Engineering proseminar for the summer semester 2023 at the University of Innsbruck.

The goal was to implement a system for monitoring greenhouses. The three main components of the system are described below; for more detailed information, please refer to the [project wiki](https://git.uibk.ac.at/informatik/qe/swess23/group4/g4t3/-/wikis/home).

### Sensor station

A sensor station is the combination of a mini greenhouse and an Arduino Nano, equipped with sensors to monitor the greenhouse's various vitals such as air quality, soil moisture and light level. It possesses a Bluetooth® Low Energy radio receiver/transmitter, which is used to communicate with an...

### Access point

This is a Raspberry Pi, also equipped with Bluetooth® as well as Wi-Fi capabilities. Its main responsibility is to read the sensor values transmitted by multiple sensor stations, average data over a configurable period, and pass the averaged values onto the ReSt backend. Furthermore, it checks if each sensor station's sensor values are within acceptable (configurable) bounds, and commands the corresponding sensor station to emit a warning otherwise.

### Backend

This is a web server, based on the (awful) Spring web framework. It serves the frontend web app to the browser and provides a Representational State (ReSt) API for ongoing communication with the aforementioned access points and frontend.

This component is based on the swa-skeleton project provided by UIBK. It inherits its Maven project structure, Spring Boot core, in-memory H2 database (TODO: replace with MySQL; see !112), basic functionality, and most of the Spring Security configuration.

## Running the back- and front-end

This project uses Java 17 and Node.js 18 (installed automatically as part of the build process).

Run `mvn spring-boot:run` on a command line shell to build and start the project. The React frontend will be compiled statically and available at `http://localhost:8080`.

### Login

A login page is available at `http://localhost:8080/login`.\
There are multiple users available by default, their names are found in `/src/main/resources/data.sql`.\
The default password for all users is 'passwd'. 'admin' is the only user with administrative privileges.

## Development

### Back-end

#### Dependencies

- JDK 17 or later
- Maven

The Java project should work out of the box in VSCode (with the Java and Spring Boot extensions) and IntelliJ Idea.\
If `yarn` fails to run during the build process, you may need to install Node.js on your machine.\
Additionally, try `mvn clean` as a troubleshooting step if Spring fails to start up for no apparent reason.

### Front-end

#### Dependencies

- Node.js 18 or later
- yarn

A hot-reload-enabled React.js development server may be started from the `/frontend` directory using the shell command `yarn start` or `yarn mock`.

The development server is accessible on `http://localhost:3000`. It will not respond to `/api` or `/handle-login`, but should work the same otherwise. Spring is set up to accept CORS requests and cookies from this URL, meaning that there should be no problems with login or authorization.

For the development server to work, both Node.js and yarn must be installed on your machine (the latter may in most cases be installed by `npm install --global yarn`).

For additional information, see [frontend/README.md](frontend/README.md)

### Raspberry Pi (Access Point)

#### Dependencies

- Python 3.9
- pip3
- ... (see [raspberry/README.md](raspberry/README.md))

The Python code found in [raspberry](raspberry/) should run just as well on most Linux computers equipped with Bluetooth® 4.0 or later, but Bleak may not be compatible with all Bluetooth® adapters.

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

### swa-skeleton: provided by UIBK

Contributors:
Christian Sillaber,
Michael Brunner,
Clemens Sauerwein,
Andrea Mussmann,
Alexander Blaas
