# Progressive Dinner Solver
![Image of the Progressive Dinner Solver](screenshot.png?raw=true "Screenshot of the Progressive Dinner Solver")

Program to automatically create schedules and emails for "running dinners".

There are many names for events, where you visit three different places and have one course at each location - (e.g. "Running Dinner", "rudiRockt", "Dinner-on-the-Run", "Darmstadt kocht!", "Run&Dine", "Switching Tables", etc.).

### Basic idea
You are assigned a teampartner - one of you has a kitchen and enough space to host 6 people. You are assigned a course (starters, main or dessert) and a route by the "Progressive Dinner Solver". You receive an Email, where you are going to have your starter, your main dish and your dinner, and you meet four new people (two other teams) at each location. Therefore, you will meet 13 new people in total (4 per course plus your team partner).

This is happening all over town with at least 18 people participating. You always need 18 + n * 6 people for the dinner solver to work.

In the end, there is usually an afterparty somewhere.

## How it works & What it does
You have a csv file of all the people that participate. This could, for example, be created by google forms or by a wordpress site (using contact form and flamingo).

You then upload the data to our website - **note that no data is going to our servers**, everything happens on your computer.
Our program then adds location information by using nominatim, selects kitchens and teampartners, assigns routes and returns another csv file which you can use for automatically writing emails to all participants (e.g. using Mail Merge for Thunderbird.)

There is more info on how it works on the welcome page of the website.

In case you have any questions, feel free to contact [info@herebefore.de](mailto:info@herebefore.de).

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
