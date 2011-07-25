$(function(){

	$('#getStarted').click(function () {
		
		$('#firstTime').fadeOut('fast', function () {
			
			$('#editor').fadeIn('slow');
			
		});
		
	});
	
	$('#save').click(function () {
		
		alert('Woah there bad-boy, you can\'t save anything yet.');
		
	});

});
