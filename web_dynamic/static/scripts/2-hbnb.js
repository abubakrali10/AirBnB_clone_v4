const $ = window.$;
$(document).ready(function () {
  const checkedAmenities = {};
  $('li input[type=checkbox]').change(function () {
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
});
