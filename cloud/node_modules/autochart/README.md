# AutoChart

Ever wanted to create a very simple GraphJs chart in seconds chart in seconds to display a dataset you already have? Not for a fancy B2C display but just to see what it's like?

AutoChart is a minimalistic no-dependances package which can accept both objects and array data structure to create a simple graph for you to see.

NodeJS users, you might want to try out [quickChart](https://www.npmjs.com/package/quickchart) to visualize autochart data inside a browser.

The available chart types are `bar`, `line`, `radar`, `doughnut`, `pie` and `polarArea`.

## Installation

```bash
npm i autochart
```

## Usage

`autochart(data)`

```javascript
const autochart = require('autochart')

const data = {
    A: {a: 1, b: 2},
    B: {a: 2, c: 3}
}

autochart.bar(data)
autochart.line(data)
autochart.radar(data)
autochart.doughnut(data)
autochart.pie(data)
autochart.polarArea(data)
```

`data` can be either an object or an array, in one or two dimensions :

```javascript
const objectChart = autochart.bar({
    A: {a:1, b:2},
    B: {a:2, b:3}
})

/* Returns */
{
    type: "bar",
    data: {
        labels: [
            "A",
            "B"
        ],
        datasets: [
            {
                label: "a",
                backgroundColor: "#F44336",
                data: [
                    1,
                    2
                ]
            },
            {
                label: "b",
                backgroundColor: "#2196F3",
                data: [
                    2,
                    3
                ]
            }
        ]
    }
}
```

```javascript
const arrayChart = autoChart.bar([1, 2])

/* Returns */
{
    type: "bar",
    data: {
        labels: [
            "0",
        ],
        datasets: [
            {
                label: "0",
                backgroundColor: "#F44336",
                data: [
                    1,
                    2
                ]
            }
        ]
    }
}
```

Note : hybrid types are possible and missing values are OK

## License

MIT © Ivan Sedletzki - Please use and share at will

Special thanks to Dinesh Pandiyan for npm-module-boilerplate
