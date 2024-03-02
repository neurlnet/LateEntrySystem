const borderColors = [
    "rgb(244, 67, 54)",
    "rgb(33, 150, 243)",
    "rgb(76, 175, 80)",
    "rgb(255, 152, 0)",
    "rgb(121, 85, 72)",
    "rgb(63, 81, 181)",
    "rgb(96, 125, 139)",
    "rgb(0, 188, 212)",
    "rgb(205, 220, 57)",
    "rgb(158, 158, 158)"
]

const backgroundColors = [
    "rgba(244, 67, 54, 0.4)",
    "rgba(33, 150, 243, 0.4)",
    "rgba(76, 175, 80, 0.4)",
    "rgba(255, 152, 0, 0.4)",
    "rgba(121, 85, 72, 0.4)",
    "rgba(63, 81, 181, 0.4)",
    "rgba(96, 125, 139, 0.4)",
    "rgba(0, 188, 212, 0.4)",
    "rgba(205, 220, 57, 0.4)",
    "rgba(158, 158, 158, 0.4)"
]

const getChartData = (input) => {
    const labels = []
    const datasets = []

    for(const key in input) {
        labels.push(key)
        const content = typeof(input[key]) === typeof({}) ? input[key] : [input[key]]
        Object.keys(content).forEach((dataItemKey, index) => {
            if(!datasets.find(a => a.label === dataItemKey))
            datasets.push({
                label: dataItemKey,
                backgroundColor: backgroundColors[index%backgroundColors.length],
                borderColor: borderColors[index%borderColors.length],
                lineTension: 0,
                data: []
            })
        })
    }
    
    labels.forEach((label) => {
        datasets.forEach(dataset => {
            const labelData = input[label]
            dataset.data.push(labelData[dataset.label] || labelData)
        })
    })

    return {
        labels,
        datasets
    }
}

const getChart = (type, input) => {
    return {
        type,
        data: getChartData(input)
    }
}

module.exports = {
    bar(input) {
        return getChart('bar', input)
    },
    line(input) {
        return getChart('line', input)
    },
    radar(input) {
        return getChart('radar', input)
    },
    doughnut(input) {
        return getChart('doughnut', input)
    },
    pie(input) {
        return getChart('pie', input)
    },
    polarArea(input) {
        return getChart('polarArea', input)
    }
}
