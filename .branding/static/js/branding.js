// $(document).ready(function(){
document.title="Aprox User's Guide"
$('.branding-header').html(
  '<div id="aprox-title"><a href="/wiki/"><span id="aprox-title-content">Aprox User Guide</span></a></div>'
);

// $('footer').prepend(
//   '<div id="aprox-footer"><div class="license"><a href="/static/gplv3.txt"><img src="/static/images/gplv3.png"/></a><br/>Software</div><div class="license"><a href="/static/cc-by-sa.txt"><img src="/static/images/cc-by-sa.png"/></a><br/>Everything Else</div></div>'
// );

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