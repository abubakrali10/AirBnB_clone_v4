$(document).ready(function () {
  const checkedAmenities = {}
  $('li input[type=checkbox]').change(function() {
    if ( $(this).is(':checked') ) {
        checkedAmenities[$(this).data('id')] = $(this).data('name');
	} else {
		delete checkedAmenities[$(this).data('id')];
	}
    let checked = $.map(checkedAmenities, function (val) {
		return val;
	});
	$('div.amenities h4').text(checked.join(', '));
  });
});