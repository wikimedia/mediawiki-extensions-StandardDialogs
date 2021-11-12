StandardDialogs.ui.BasicInformationPage = function BasicInformationPage( name, config ) {
	StandardDialogs.ui.BasicInformationPage.super.call( this, name, config );
};

OO.inheritClass( StandardDialogs.ui.BasicInformationPage, StandardDialogs.ui.BasePage );

StandardDialogs.ui.BasicInformationPage.prototype.setupOutlineItem = function () {
	StandardDialogs.ui.BasicInformationPage.super.prototype.setupOutlineItem.apply( this, arguments );

	if ( this.outlineItem ) {
		this.outlineItem.setLabel( mw.message( 'standarddialogs-page-info-general' ).plain() );
	}
};

StandardDialogs.ui.BasicInformationPage.prototype.setup = function () {
	var me = this;
	var dfdData = this.getData();
	$.when( dfdData ).done( function () {
		if ( me.pageInfo != undefined ) {
			fieldLayout = new OO.ui.FieldsetLayout();
			var contentTable = $( '<table>' );
			contentTable.addClass( 'wikitable page-information' );

			for ( var p in me.pageInfo ) {
				contentTable.append(
					$( '<tr>' ).append(
						$( '<td>' ).text( mw.message( 'standarddialogs-page-info-page-title' ).plain() ),
						$( '<td>' ).text( me.pageInfo[ p ].title ) ) );

				contentTable.append(
					$( '<tr>' ).append(
						$( '<td>' ).text( mw.message( 'standarddialogs-page-info-page-length' ).plain() ),
						$( '<td>' ).text( me.pageInfo[ p ].length ) ) );

				contentTable.append(
					$( '<tr>' ).append(
						$( '<td>' ).text( mw.message( 'standarddialogs-page-info-page-id' ).plain() ),
						$( '<td>' ).text( me.pageInfo[ p ].pageid ) ) );

				contentTable.append(
					$( '<tr>' ).append(
						$( '<td>' ).text( mw.message( 'standarddialogs-page-info-page-language' ).plain() ),
						$( '<td>' ).text( me.pageInfo[ p ].pagelanguage ) ) );
				contentTable.append(
					$( '<tr>' ).append(
						$( '<td>' ).text( mw.message( 'standarddialogs-page-info-page-model' ).plain() ),
						$( '<td>' ).text( me.pageInfo[ p ].contentmodel ) ) );
				contentTable.append(
					$( '<tr>' ).append(
						$( '<td>' ).text( mw.message( 'standarddialogs-page-info-page-watch' ).plain() ),
						$( '<td>' ).text( me.pageInfo[ p ].watchers ) ) );
				if ( me.pageInfo[ p ].redirects ) {
					contentTable.append(
						$( '<tr>' ).append(
							$( '<td>' ).text( mw.message( 'standarddialogs-page-info-page-redirects' ).plain() ),
							$( '<td>' ).text( me.pageInfo[ p ].redirects ) ) );
				} else {
					contentTable.append(
						$( '<tr>' ).append(
							$( '<td>' ).text( mw.message( 'standarddialogs-page-info-page-redirects' ).plain() ),
							$( '<td>' ).text( 0 ) ) );
				}
			}
			fieldLayout.$element.append( contentTable );

			me.$element.append( fieldLayout.$element );
		}
	} );
};

StandardDialogs.ui.BasicInformationPage.prototype.getData = function () {
	var me = this;
	var dfd = new $.Deferred();

	var mwApi = new mw.Api();
	mwApi.postWithToken( 'csrf', {
		action: 'query',
		titles: me.pageName,
		format: 'json',
		prop: 'info|redirects|pageviews',
		inprop: 'watchers|visitingwatchers'
	} ).fail( function () {
		dfd.reject( [ new OO.ui.Error( arguments[ 0 ], { recoverable: false } ) ] );
	} )
		.done( function ( resp ) {
			me.pageInfo = resp.query.pages;
			dfd.resolve( arguments );
		} );
	return dfd.promise();
};

// register
registryPageInformation.register( 'basic_infos', StandardDialogs.ui.BasicInformationPage );
