About `app`:
List of events was pre-populated in the database via seed script.
For state managment was choosed **Angualr Signals**. 
You can registered yourself and check participants on per event.

<p align='center'>
 <a href="#">
    <img src="https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white" />
  </a>&nbsp;&nbsp;
  <a href="#">
  <img alt="GitHub Repo stars" src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white">
</a>&nbsp;&nbsp;
  <a href="#">
  <img alt="GitHub Repo stars" src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white">
</a>&nbsp;&nbsp;
  <a href="#">
  <img alt="GitHub Repo stars" src="https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white">
</a>&nbsp;&nbsp;


</p>


**Events board page**: 
- have ability to sort events by: title, event date (works via the backend) :white_check_mark:.
- have posibility to choose page or limit events on page(works via the backend) :white_check_mark:.
- add infinite scroll pagination (when a user scrolls the page, it
automatically loads more events) :white_check_mark:.
- implementation third part API, for call and get new events (doesn't find needed free api ) :negative_squared_cross_mark:

**Events participants modal**: 
- have ability to filter participants by: name or email (works via the frotnend) :white_check_mark:.
- handled hint of current-day registration(works via the backend) :white_check_mark:;

**Events registration modal**: 
- have ability to register user for event(works via the backend) :white_check_mark:.
- added validation (on Front and Back side) :white_check_mark:;

*Responsive design*



# EventClient

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.0.3.

Clone this repository by SSH: `git@github.com:brolo1313/event-booking-client.git` or `https://github.com/brolo1313/event-booking-client.git`.
Then run `npm i`.

## Development Environment
Run `npm run dev` for a dev server. Navigate to http://localhost:4202/. The application will automatically reload if you change any of the source files.

## Production Environment
Run `npm run prod` for a production server. Navigate to http://localhost:4201. The application will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## DEMO

https://event-booking-client-gamma.vercel.app/

BACKEND SOURCE
https://github.com/brolo1313/event-booking-server
