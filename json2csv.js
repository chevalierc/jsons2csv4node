var fs = require( "fs" );

var get_jsons_into_memory = function ( dir ) {
    var jsons = []
    var files = fs.readdirSync( dir )
    files.forEach( function ( file ) {
        var file_loc = dir + "/" + file
        var json = JSON.parse( fs.readFileSync( file_loc, 'utf8' ) )
        jsons.push( json )
    } );
    return jsons
}

var get_header = function ( json ) {
    var headers = []
    for ( header in json ) {
        headers.push( header )
    }
    return headers
}

var write_header_to_stream = function ( stream, headers ) {
    var line = ""
    for ( var i = 0; i < headers.length; i++ ) {
        var header = headers[ i ]
        if ( i != 0 ) line += ","
        line += header
    }
    line += "\n"
    stream.write( line )
}

var write_body_to_csv = function ( stream, headers, jsons ) {
    for ( var i = 0; i < jsons.length; i++ ) {
        var json = jsons[ i ]

        var line = ""
        for ( var j = 0; j < headers.length; j++ ) {
            var header = headers[ j ]
            if ( j != 0 ) line += ","
            if ( json[ header ] ) {
                line += '"' + json[ header ] + '"'
            }

        }
        line += "\n"
            // console.log( line )
            // console.log( "WRITING CSVs: %s/%s", i + 1, jsons.length )
        stream.write( line )
    }
}

var run = function () {
    var json_dir = process.argv[ 2 ]
    var output = process.argv[ 3 ]
        // var json_dir = "./jsons/"
        // var output = "./output.csv"

    var stream = fs.createWriteStream( output );

    var jsons = get_jsons_into_memory( json_dir )
    var headers = get_header( jsons[ 0 ] )

    write_header_to_stream( stream, headers )
    write_body_to_csv( stream, headers, jsons )

    stream.end()
}

run()
