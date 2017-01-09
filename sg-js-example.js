$SG(document).ready(function(){
  	$SG( '.insert-audio-1' ).html('<source src="http://projects.rcc.uchicago.edu/aclyu/vot/' + '[url("a1")]' + '.wav"></source>');
  	$SG( '.insert-audio-2' ).html('<source src="http://projects.rcc.uchicago.edu/aclyu/vot/' +  '[url("a2")]' + '.wav"></source>');
  	var audio3 = $SG( '.insert-audio-3' );
  	console.log(audio3);
  	audio3.html('<source src="http://projects.rcc.uchicago.edu/aclyu/vot/' + '[url("a3")]' + '.wav"></source>');
 });
