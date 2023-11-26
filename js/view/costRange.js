import updateModel from "./../utils/updateModel.js"

function init(getData) {   

    const slider = document.querySelector('#slider-cost')
    const data = getData()

    noUiSlider.create(slider, {
        start: data.cost,
        connect: 'lower',
        tooltips: true,
        step: 100000,
        range: {
            min: data.minPrice,
            '1%': [400000, 100000],
            '50%': [10000000, 500000],
            max: data.maxPrice
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
             
        updateModel(slider, {cost: sliderVaule, onUpdate: 'costSlider'})
    }) 

    return slider
}

export default init