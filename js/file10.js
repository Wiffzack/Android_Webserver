
var loader = new ZipLoader( 'js/js2.zip');

loader.on( 'progress', function ( event ) {
  console.log( 'loading', event.loaded, event.total );
} );

// on load
loader.on( 'load', function ( e ) {

        Object.keys( loader.files ).forEach( function ( filename ) {

                var url = loader.extractAsBlobUrl( filename, 'text/javascript' );

				var fileRef = window.document.createElement("script");
				fileRef.setAttribute("type", "text/javascript");
				fileRef.setAttribute("src", url);
				var head = document.getElementsByTagName("head")[0] || document.documentElement;
				head.insertBefore(fileRef, head.firstChild);
				//appendChild(fileRef, data);				
				
        } );

} );

loader.on( 'error', function ( event ) {
  console.log( 'error', event.error );
} );

loader.load();
