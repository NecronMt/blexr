# blexr

Project task:

Scenario

Our projects use a REST API that expose the necessary data to issue reports and demographics. We
are currently interested in creating some statistics on some basic demographics. We have found an
API that will help us achieve this, it lists all countries and you can query it they way you like.

Task

We would like to see a Report Page which has a list of countries with their current population and
when clicked will show you a detailed view of the population split into gender. The next page
which is essential is a Dashboard page. This should summarize the information for example; a pie
chart of showing the top 10 countries with the highest population. We’ll leave you to use your
creativity to decide what to put in the dashboard. An interesting thing we want to get to know is
“Which country has the highest female to male ratio?”, we would assume this is the country with
the highest male population when compared to the female population.

REST Api: http://api.population.io/

Summarizing the requirements

Dashboard page

o At least contains one graph

o Which country has the highest female to male ratio? (Bonus)

Report page (List of countries with info)

o Country Name & population

o Sortable list

o Filters (Bonus)

o Clicking on countries and open the in detailed report (Bonus)

Project is delivered in a github repository. Project uses React / Vue.

Installation and Requirements:


https://github.com/vuejs-templates/webpack

vue init webpack blexr

cd blexr

npm install

npm run dev --> Development

npm run build --> Production

https://github.com/axios/axios

npm install axios --save

https://github.com/apertureless/vue-chartjs

npm install vue-chartjs chart.js --save

https://www.npmjs.com/package/vue-tables-2

npm install vue-tables-2 --save


Note to self:

Project is complete with the above requirements.

To improve the project, I would consider the following items:

1. Chart on click event to get more detailed view of Country Data
2. Improved Chart number formatting (maybe using Javascript Math.log logarithm functio)
3. Improved data filtering for reports page since sorting didn't work on formatted text
4. Functionality could be minimised by restructuring data / functions into chunks (sorting / filtering / data retrieval / graph display)
5. Enjoy :)