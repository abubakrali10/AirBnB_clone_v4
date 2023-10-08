const $ = window.$;
$(document).ready(function () {
  const checkedAmenities = {};
  $('input.amenity_input').change(function () {
    if ($(this).is(':checked')) {
      checkedAmenities[$(this).data('id')] = $(this).data('name');
    } else {
      delete checkedAmenities[$(this).data('id')];
    }
    const checked = $.map(checkedAmenities, function (val) {
      return val;
    });
    $('div.amenities h4').text(checked.join(', '));
  });

  const checkedcities = {};
  $('input.city_input').change(function () {
    if ($(this).is(':checked')) {
      checkedcities[$(this).data('id')] = $(this).data('name');
    } else {
      delete checkedcities[$(this).data('id')];
    }
    const checked = $.map(checkedcities, function (val) {
      return val;
    });
    $('div.locations h4').text(checked.join(', '));
  });

  const checkedstates = {};
  $('input.state_input').change(function () {
    if ($(this).is(':checked')) {
      checkedstates[$(this).data('id')] = $(this).data('name');
      $(`input[state-id=${$(this).data('id')}]`).each((index, element) => {
        $(element).attr('checked', true);
        checkedcities[$(element).data('id')] = $(element).data('name');
      });
    } else {
      delete checkedstates[$(this).data('id')];
      $(`input[state-id=${$(this).data('id')}]`).each((index, element) => {
        $(element).attr('checked', false);
        delete checkedcities[$(element).data('id')];
      });
    }
    const checked = $.map(checkedstates, function (val) {
      return val;
    });
    $('div.locations h4').text(checked.join(', '));
  });

  const apiStatus = $('div#api_status');
  $.ajax({
    type: 'GET',
    dataType: 'json',
    url: 'http://0.0.0.0:5001/api/v1/status/',
    success: (data) => {
      apiStatus.addClass('available');
    },
    error: (xhr, status, error) => {
      apiStatus.removeClass('available');
    }
  });

  function placeSearch (body) {
    $.ajax({
      type: 'POST',
      contentType: 'application/json',
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      data: body,
      success: (data) => {
        const section = $('section.places');
        for (let i = 0; i < data.length; i++) {
          const article = $('<article>').html(
            `<div class="title_box">
              <h2>${data[i].name}</h2>
              <div class="price_by_night">${data[i].price_by_night}</div>
            </div>
            <div class="information">
              <div class="max_guest">${data[i].max_guest} Guest${data[i].max_guest > 1 ? 's' : ''}</div>
              <div class="number_rooms">${data[i].number_rooms} Bedroom${data[i].number_rooms > 1 ? 's' : ''}</div>
              <div class="number_bathrooms">${data[i].number_bathrooms} Bathroom${data[i].number_bathrooms > 1 ? 's' : ''}</div>
            </div>
            <div class="description">
              ${data[i].description}
            </div>
            <div class="reviews">
              <div class="head">
                <h2>Reviews</h2>
                <span class="review_btn" place-id=${data[i].id}>Show</span>
            </div>
            <ul place-id=${data[i].id}>
            </ul>
            </div>`
          );
          section.prepend(article);
        }
      }
    });
  }

  $('.places').on('click', '.reviews .review_btn', (event) => {
    const place = event.target;
    if ($(place).text() === 'Show') {
      $(place).text('Hide');
      $.ajax({
        type: 'GET',
        dataType: 'json',
        url: `http://0.0.0.0:5001/api/v1/places/${$(place).attr('place-id')}/reviews`,
        success: (data) => {
          for (let i = 0; i < data.length; i++) {
            const splitDate = data[i].created_at.split('-');
            const li = $('<li>').html(
                `<h3>From User in ${splitDate[1]} - ${splitDate[0]}</h3>
                  <p>${data[i].text}</p>`
            );
            $(`ul[place-id=${$(place).attr('place-id')}]`).append(li);
          }
        }
      });
    } else {
      $(place).text('Show');
      $(`ul[place-id=${$(place).attr('place-id')}]`).empty();
    }
  });

  placeSearch('{}');

  $('button').on('click', () => {
    $('section.places').empty();
    placeSearch(JSON.stringify({
      amenities: Object.keys(checkedAmenities),
      cities: Object.keys(checkedstates),
      states: Object.keys(checkedstates)
    }));
  });
});
