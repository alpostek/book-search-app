'use strict';

document.addEventListener('DOMContentLoaded', function () {

    var apikey = config.API_KEY;
    var searchForm = document.getElementById('js-searchform');
    var searchInput = document.getElementById('js-searchinput');
    var searchResultList = document.getElementById('js-searchresults');
    var clearResultsBtn = document.getElementById('js-clearbtn');
    var radioButtons = document.querySelectorAll('input[type="radio"');
    var preloader = document.getElementById('js-preloader');
    var submitBtn = document.querySelectorAll('input.searchbar__button')[0];
    var dynamicValidationEvents = ['keyup', 'paste', 'click', 'input', 'change'];
    var radioButtonChecked = false;
    var queryLengthValid = false;
    var radioButtonSelected = void 0;
    var searchTerm = void 0;

    function submitButtonStatus() {
        radioButtonChecked && queryLengthValid ? submitBtn.classList.remove('searchbar__button--disabled') : submitBtn.classList.add('searchbar__button--disabled');
    }

    function clearResults() {
        searchResultList.textContent = '';
    }

    function clearForm() {
        searchInput.value = '';
        queryLengthValid = false;
        clearResults();
        clearResultsBtn.classList.add('searchbar__button--hidden');
        submitBtn.classList.add('searchbar__button--disabled');
    }

    function validateQueryLength() {
        this.value.length >= 3 ? queryLengthValid = true : queryLengthValid = false;
    }

    function createResultList(resultData) {
        if (resultData.items !== undefined) {

            resultData.items.forEach(function createListElement(book, index) {
                var listElement = document.createElement('li');
                var title = '<p class="book__title">' + book.volumeInfo.title + '</p>';
                var authorsInfo = book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : '';
                var authors = '<p class="book__authors"><span>Authors:</span> ' + authorsInfo + '</p>';
                var volumeLink = '<a class="book__button" href=' + book.volumeInfo.infoLink + ' target="_blank"/>Learn more</a>';
                var cover = void 0;
                if (book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail) {
                    cover = '<div class="book__cover">\n                        <img alt="Book cover" class="book__coverImg" src=' + book.volumeInfo.imageLinks.thumbnail + '>\n                    </div>';
                } else {
                    cover = '<img src="https://via.placeholder.com/100x150"/>';
                }
                listElement.classList.add('book');
                listElement.innerHTML = cover + '\n                                        <div class="book__info">' + title + authors + volumeLink + '\n                                    </div>';
                searchResultList.appendChild(listElement);
            });
        } else {
            searchResultList.innerHTML = "<li class='book--error'><p>No results found for this query</p></li>";
        }
        clearResultsBtn.classList.remove('searchbar__button--hidden');
    }

    function searchForBooks(term, param) {
        var apiUrl = 'https://www.googleapis.com/books/v1/volumes?key=' + apikey + '&maxResults=40&q=';
        return fetch('' + apiUrl + param + term).then(function (response, data) {
            return response.json();
        }).then(function (data) {
            preloader.classList.toggle('preloader--hidden');
            createResultList(data);
        }).catch(function (error) {
            searchResultList.innerHTML = "<li class='book--error'><p>There is a problem with Google Search API</p></li>";
            console.warn(error);
        });
    }

    radioButtons.forEach(function (radioBtn) {
        radioBtn.addEventListener('change', function () {
            radioButtonSelected = this.dataset.queryparam;
            radioButtonChecked = true;
            submitButtonStatus();
        });
    });

    dynamicValidationEvents.forEach(function (event) {
        searchForm.addEventListener(event, submitButtonStatus, false);
        searchInput.addEventListener(event, validateQueryLength, false);
    });

    searchForm.addEventListener('submit', function (event) {
        event.preventDefault();
        clearResults();
        if (queryLengthValid && radioButtonChecked) {
            searchTerm = searchInput.value;
            searchForBooks(searchTerm, radioButtonSelected);
            preloader.classList.toggle('preloader--hidden');
            searchResultList.innerHTML = '';
        } else {
            searchResultList.innerHTML = "<li class='book--error'><p>Entered query is too short, please type at least 3 characters</p></li>";
        }
    });

    clearResultsBtn.addEventListener('click', clearForm);
});