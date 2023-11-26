import updateModel from "../utils/updateModel.js"

function init(getData) {   

    const slider = document.querySelector('#slider-term')
    const data = getData()

    noUiSlider.create(slider, {
        start: data.time,
        connect: 'lower',
        tooltips: true,
        step: 1,
        range: {
            min: data.minYear,
            max: data.maxYear
        },
        format: wNumb({
            decimal: 0,
            thousand: ' ',
            suffix: ''
        })
    })

    slider.noUiSlider.on('slide', function() {

        let sliderVaule = slider.noUiSlider.get()
        sliderVaule = sliderVaule.split('.')[0]
        sliderVaule = parseInt(sliderVaule.replace(/ /g, ''))   
             
        updateModel(slider, {time: sliderVaule, onUpdate: 'timeSlider'})
    }) 

    return slider
}

export default init