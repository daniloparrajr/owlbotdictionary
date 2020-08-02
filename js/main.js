(function () {
	'use strict';

	let xhr = function (token) {
		let xhr = new XMLHttpRequest();
		const xhrObject = {
			'search': function (url, callback, loading) {
				xhr.onload = function () {
					if (this.status == 200) {
						callback(JSON.parse(this.responseText));
					}

					if (this.status == 404) {
						loader.classList.remove('show');
						noResults.classList.add('show');
					}
				}
				xhr.onprogress = loading;

				xhr.open('GET', url, true);
				xhr.setRequestHeader('Authorization', token);
				xhr.send();
			}
		}
		return xhrObject;
	}


	const request = xhr('Token 9d77d7386fbe58cd2f835fda04192d2e3b17308b');
	const searchField = document.getElementById('searchField');
	const searchForm = document.getElementById('searchForm');
	const template = document.getElementById('resultTemplate');
	const definitions = document.querySelector('.result__definitions');
	const resultWord = document.querySelector('.result__word');
	const resultPronunciation = document.querySelector('.result__pronunciation');
	const result = document.querySelector('.result');
	const loader = document.querySelector('.js-loader');
	const noResults = document.querySelector('.js-404');

	function insertResult(data) {
		setTimeout(function () {
			result.classList.add('show');
			loader.classList.remove('show');
			noResults.classList.remove('show');

			resultWord.textContent = data.word;

			if (data.pronunciation !== null) {
				resultPronunciation.style = "display: block;";
				resultPronunciation.textContent = '/' + data.pronunciation + '/';
			} else {
				resultPronunciation.style = "display: none;";
			}

			definitions.innerHTML = '';

			data.definitions.forEach(definition => {
				let templateClone = template.content.cloneNode(true);
				let content = '';

				if (definition.type !== null) {
					templateClone.querySelector('.result__type').textContent = definition.type;
				} else {
					templateClone.querySelector('.result__type').remove();
				}

				if (definition.definition !== null) {
					content = definition.definition;

					if (definition.emoji !== null) {
						content += ' ' + definition.emoji;
					}

					templateClone.querySelector('.result__definition').textContent = content;
				} else {
					templateClone.querySelector('.result__definition').remove();
				}

				if (definition.example !== null) {
					templateClone.querySelector('.result__example').textContent = '"' + definition.example + '"';
				} else {
					templateClone.querySelector('.result__example').remove();
				}

				if (definition.image_url !== null) {
					templateClone.querySelector('.result__image').src = definition.image_url;
					templateClone.querySelector('.result__image').alt = data.word;
				} else {
					templateClone.querySelector('.result__image').remove();
				}

				definitions.appendChild(templateClone);
			});
		}, 400);
	}

	function loadingResult() {
		result.classList.remove('show');
		loader.classList.add('show');
	}

	searchForm.addEventListener('submit', function (e) {
		e.preventDefault();
		request.search('https://owlbot.info/api/v4/dictionary/' + searchField.value + '?format=json', insertResult, loadingResult);
	});
})();