StandardDialogs.ui.PropertiesInformationPage = function PropertiesInformationPage( name, config ) {
	StandardDialogs.ui.PropertiesInformationPage.super.call( this, name, config );
};

OO.inheritClass( StandardDialogs.ui.PropertiesInformationPage, StandardDialogs.ui.BasePage );

StandardDialogs.ui.PropertiesInformationPage.prototype.setupOutlineItem = function () {
	StandardDialogs.ui.PropertiesInformationPage.super.prototype
		.setupOutlineItem.apply( this, arguments );

	if ( this.outlineItem ) {
		this.outlineItem.setLabel( mw.message( 'standarddialogs-page-info-properties' ).plain() );
	}
};

StandardDialogs.ui.PropertiesInformationPage.prototype.setup = function () {
	var me = this;
	var dfdData = this.getData();
	$.when( dfdData ).done( function () {
		if ( me.pageInfo !== undefined ) {
			var fieldLayout = new OO.ui.FieldsetLayout();
			var contentTable = $( '<table>' );
			contentTable.addClass( 'wikitable page-information' );

			for ( var p in me.pageInfo ) {
				var templates = me.getTemplates( p );
				contentTable.append(
					$( '<tr>' ).append(
						$( '<td>' ).text( mw.message( 'standarddialogs-page-info-page-templates' ).plain() ),
						$( '<td>' ).append( templates ) ) );

				var categories = me.getCategories( p );
				contentTable.append(
					$( '<tr>' ).append(
						$( '<td>' ).text( mw.message( 'standarddialogs-page-info-page-categories' ).plain() ),
						$( '<td>' ).append( categories ) ) );
				var links = me.getInternalLinks( p );
				contentTable.append(
					$( '<tr>' ).append(
						$( '<td>' ).text( mw.message( 'standarddialogs-page-info-page-internal' ).plain() ),
						$( '<td>' ).append( links ) ) );

				if ( me.pageInfo[ p ].pageprops.page_image_free ) {
					contentTable.append(
						$( '<tr>' ).append(
							$( '<td>' ).text( mw.message( 'standarddialogs-page-info-page-images' ).plain() ),
							$( '<td>' ).text( me.pageInfo[ p ].pageprops.page_image_free ) ) );
				} else {
					contentTable.append(
						$( '<tr>' ).append(
							$( '<td>' ).text( mw.message( 'standarddialogs-page-info-page-images' ).plain() ),
							$( '<td>' ).text() ) );
				}

				var extLinks = me.getExternalLinks( p );
				contentTable.append(
					$( '<tr>' ).append(
						$( '<td>' ).text( mw.message( 'standarddialogs-page-info-page-external' ).plain() ),
						$( '<td>' ).append( extLinks ) ) );
			}
			fieldLayout.$element.append( contentTable );

			me.$element.append( fieldLayout.$element );
		}
	} );
};

StandardDialogs.ui.PropertiesInformationPage.prototype.getData = function () {
	var me = this;
	var dfd = new $.Deferred();
	var mwApi = new mw.Api();
	mwApi.postWithToken( 'csrf', {
		action: 'query',
		titles: me.pageName,
		format: 'json',
		prop: 'categories|templates|info|links|pageprops|extlinks'

	} ).fail( function () {
		dfd.reject( [ new OO.ui.Error( arguments[ 0 ], { recoverable: false } ) ] );
	} )
		.done( function ( resp ) {
			me.pageInfo = resp.query.pages;
			dfd.resolve( arguments );
		} );
	return dfd.promise();
};

StandardDialogs.ui.PropertiesInformationPage.prototype.getTemplates = function ( id ) {
	var templates = $( '<ul>' );
	if ( this.pageInfo[ id ].templates ) {
		for ( var i = 0; i < this.pageInfo[ id ].templates.length; i++ ) {
			var title = mw.Title.newFromText( this.pageInfo[ id ].templates[ i ].title );
			templates.append(
				$( '<li>' )
					.append( $( '<a>' )
						.attr( {
							href: title.getUrl()
						} )
						.text( this.pageInfo[ id ].templates[ i ].title ) ) );
		}
	}
	return templates;
};

StandardDialogs.ui.PropertiesInformationPage.prototype.getCategories = function ( id ) {
	var categories = $( '<ul>' );
	if ( this.pageInfo[ id ].categories ) {
		for ( var i = 0; i < this.pageInfo[ id ].categories.length; i++ ) {
			var title = mw.Title.newFromText( this.pageInfo[ id ].categories[ i ].title );
			categories.append(
				$( '<li>' )
					.append( $( '<a>' )
						.attr( {
							href: title.getUrl()
						} )
						.text( this.pageInfo[ id ].categories[ i ].title ) ) );
		}
	}
	return categories;
};

StandardDialogs.ui.PropertiesInformationPage.prototype.getInternalLinks = function ( id ) {
	var links = $( '<ul>' );
	if ( this.pageInfo[ id ].links ) {
		for ( var i = 0; i < this.pageInfo[ id ].links.length; i++ ) {
			var title = mw.Title.newFromText( this.pageInfo[ id ].links[ i ].title );
			links.append(
				$( '<li>' )
					.append( $( '<a>' )
						.attr( {
							href: title.getUrl()
						} )
						.text( this.pageInfo[ id ].links[ i ].title ) ) );
		}
	}
	return links;
};

StandardDialogs.ui.PropertiesInformationPage.prototype.getExternalLinks = function ( id ) {
	var links = $( '<ul>' );
	if ( this.pageInfo[ id ].extlinks ) {
		for ( var key in this.pageInfo[ id ].extlinks ) {
			links.append(
				$( '<li>' )
					.append( $( '<a>' )
						.attr( {
							href: Object.values( this.pageInfo[ id ].extlinks[ key ] )
						} )
						.text( Object.values( this.pageInfo[ id ].extlinks[ key ] ) ) ) );
		}
	}
	return links;
};

// register
registryPageInformation.register( 'properties_infos', StandardDialogs.ui.PropertiesInformationPage );
