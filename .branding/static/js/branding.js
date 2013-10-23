// $(document).ready(function(){
document.title="Aprox User's Guide"
$('.branding-header').html(
  '<div id="aprox-title"><a href="/wiki/"><span id="aprox-title-content">Aprox User Guide</span></a></div>'
);

$('footer').prepend(
  '<div id="aprox-footer"><div class="license"><a href="/static/cc-by-sa.txt"><img src="/static/images/cc-by-sa.png"/></a></div></div>'
);

$('.breadcrumb-sep').text('>');

$('#page-content').on( 'contentUpdate', function(){
  var seen = [];
  $('.start-sidebar').each(function(){
    var id = $(this).attr('id');
    if ( seen.indexOf(id) < 0 ) {
      seen.push(id);

      $(this).nextUntil('.end-sidebar').wrapAll('<div class="sidebar" id="wrapped-' + id + '"></div>');
    }
  });
});