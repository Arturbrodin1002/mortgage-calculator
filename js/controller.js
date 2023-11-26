import * as Model from "./model.js";
import updateResultsView from './view/updateResultsView.js';
import programs from './view/radioPrograms.js'
import { updateMinPercents } from "./view/utils.js";

import costInput from './view/costInput.js'
import costRange from './view/costRange.js'

import paymentInput from './view/paymentInput.js'
import paymentRange from './view/paymentRange.js'

import timeInput from './view/timeInput.js'
import timeRange from './view/timeRange.js'

window.onload = function () {
	const getData = Model.getData;

	// Init programs
	programs(getData);

	// Init Cost input
    const cleaveCost = costInput(getData);
    const sliderCost = costRange(getData);

	const cleavePayment = paymentInput(getData)
	const sliderPayment = paymentRange(getData)

	const cleaveTime = timeInput(getData)
	const sliderTime = timeRange(getData)

	Model.setData({})
	const results = Model.getResults()
	updateResultsView(results)

	document.addEventListener('updateForm', (e) => {
		Model.setData(e.detail);

		const data = Model.getData();
		const results = Model.getResults();

		// Update all form view based on model
        updateFormAndSliders(data);

		// Update results block
		updateResultsView(results);
    });

    function updateFormAndSliders(data) {
		// Update radio btns
        if (data.onUpdate === 'radioProgram') {
            updateMinPercents(data)

			sliderPayment.noUiSlider.updateOptions({
				range: {
					min: data.minPaymentPercents * 100,
					max: data.maxPaymentPercents * 100
				}
			})
        }

		// costInput
		if (data.onUpdate !== 'inputCost') {
			cleaveCost.setRawValue(data.cost);
		}

		// costSlider
		if (data.onUpdate !== 'costSlider') {
			sliderCost.noUiSlider.set(data.cost);
		}

		// inputPayment 
		if (data.onUpdate !== 'inputPayment') {
			cleavePayment.setRawValue(data.payment)
		}

		// sliderPayment 
		if (data.onUpdate !== 'paymentSlider') {
			sliderPayment.noUiSlider.set(data.paymentPercents * 100)
		}

		if (data.onUpdate !== 'inputTime') {
			cleaveTime.setRawValue(data.time)
		}

		if (data.onUpdate !== 'timeSlider') {
			sliderTime.noUiSlider.set(data.time)
		}
	}

	// order form 
	const openFormBtn = document.querySelector('#openFormBtn')
	const orderForm = document.querySelector('#orderForm')
	const submitBtn = document.querySelector('#submitFormBtn')

	openFormBtn.addEventListener('click', function() {
		openFormBtn.classList.add('none')
		orderForm.classList.remove('none')
	})

	orderForm.addEventListener('submit', function(e) {
		e.preventDefault()

		const formData = new FormData(orderForm)
		
		submitBtn.setAttribute('disabled', true)
		submitBtn.innerText = 'Заявка отправляется...'
		
		document.querySelectorAll('input').forEach(function(input) {
			input.setAttribute('disabled', true)
		})

		fetchData()

		async function fetchData() {
			const data = Model.getData()
			const results = Model.getResults()

			let url = checkOnUrl(document.location.href) 
			

			function checkOnUrl(url) {
				let urlArrayDot = url.split('.')
				console.log('urlArrayDot:', urlArrayDot);

				if (urlArrayDot[urlArrayDot.length - 1] == 'html') {
					urlArrayDot.pop()
					let newUrl = urlArrayDot.join('.')
					console.log('newUrl:', newUrl);
					let urlArraySlash = newUrl.split('/')
					urlArraySlash.pop()
					newUrl = urlArraySlash.join('/') + '/'

					return newUrl
				}

				return url
			}

			const response = await fetch(url + 'mail.php', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json;charset=utf-8',
				},
				body: JSON.stringify({
					form: {
						name: formData.get('name'),
						email: formData.get('email'),
						phone: formData.get('phone'),
					},
					data,
					results,
				}),
			});

			const result = await response.text();
			console.log(result);

			submitBtn.removeAttribute('disabled', true);
			submitBtn.innerText = 'Оформить заявку';

			orderForm.querySelectorAll('input').forEach((input) => {
				input.removeAttribute('disabled', true);
			});

			orderForm.reset()
			orderForm.classList.add('none')


			if (result == 'SUCCESS') {
				document.querySelector('#success').classList.remove('none')
			}else {
				document.querySelector('#error').classList.remove('none')
			}
		}	
	})

}