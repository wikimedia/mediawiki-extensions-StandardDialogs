StandardDialogs.ui.HistoryInformationPage = function HistoryInformationPage( name, config ) {
	StandardDialogs.ui.HistoryInformationPage.super.call( this, name, config );
};

OO.inheritClass( StandardDialogs.ui.HistoryInformationPage, StandardDialogs.ui.BasePage );

StandardDialogs.ui.HistoryInformationPage.prototype.setupOutlineItem = function () {
	StandardDialogs.ui.HistoryInformationPage.super.prototype.setupOutlineItem.apply( this, arguments );

	if ( this.outlineItem ) {
		this.outlineItem.setLabel( mw.message( 'standarddialogs-page-info-history' ).plain() );
	}
};

StandardDialogs.ui.HistoryInformationPage.prototype.setup = function () {
	var me = this;
	var dfdData = this.getData();
	$.when( dfdData ).done( function () {
		if ( me.pageInfo != undefined ) {
			fieldLayout = new OO.ui.FieldsetLayout();
			var contentTable = $( '<table>' );
			contentTable.addClass( 'wikitable page-information' );

			for ( var p in me.pageInfo ) {
				var contrib = me.getEditors( p );
				contentTable.append(
					$( '<tr>' ).append(
						$( '<td>' ).text( mw.message( 'standarddialogs-page-info-page-contributors' ).plain() ),
						$( '<td>' ).append( contrib ) ) );

				var dateTime = new Date( me.pageInfo[ p ].revisions[ 0 ].timestamp );
				dateTime.toLocaleTimeString();

				contentTable.append(
					$( '<tr>' ).append(
						$( '<td>' ).text( mw.message( 'standarddialogs-page-info-page-last-edit' ).plain() ),
						$( '<td>' ).text( dateTime ) ) );
				contentTable.append(
					$( '<tr>' ).append(
						$( '<td>' ).text( mw.message( 'standarddialogs-page-info-page-last-editor' ).plain() ),
						$( '<td>' ).text( me.pageInfo[ p ].revisions[ 0 ].user ) ) );
			}
			fieldLayout.$element.append( contentTable );

			me.$element.append( fieldLayout.$element );
		}
	} );
};

StandardDialogs.ui.HistoryInformationPage.prototype.getEditors = function ( id ) {
	var editors = $( '<ul>' );
	if ( this.pageInfo[ id ].contributors ) {
		for ( var c in this.pageInfo[ id ].contributors ) {
			editors.append(
				$( '<li>' )
					.append( $( '<a>' )
						.text( this.pageInfo[ id ].contributors[ c ].name )
					)
			);
		}
	}
	return editors;
};

StandardDialogs.ui.HistoryInformationPage.prototype.getData = function () {
	var me = this;
	var dfd = new $.Deferred();

	var mwApi = new mw.Api();
	mwApi.postWithToken( 'csrf', {
		action: 'query',
		titles: me.pageName,
		format: 'json',
		prop: 'contributors|info|revisions'

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
registryPageInformation.register( 'history_infos', StandardDialogs.ui.HistoryInformationPage );
