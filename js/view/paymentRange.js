import updateModel from "./../utils/updateModel.js"

function init(getData) {   
    const slider = document.querySelector('#slider-downpayment')

    noUiSlider.create(slider, {
        start: getData().paymentPercents * 100,
        connect: 'lower',
        tooltips: true,
        step: 1,
        range: {
            min: getData().minPaymentPercents * 100,
            max: getData().maxPaymentPercents * 100
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
             
        updateModel(slider, {paymentPercents: sliderVaule, onUpdate: 'paymentSlider'})
    }) 

    return slider
}

export default init