window.registryPageInformation = new OO.Registry();
$( document ).on( 'click', '.page-tree-action-info', ( e ) => {
	const rlModules = require( './pageInfoPanelModuleRegistry.json' );
	if ( !e.currentTarget.dataset.title ) {
		return;
	}
	const title = e.currentTarget.dataset.title;

	mw.loader.using( 'ext.standardDialogs.ui.PageInformationDialog' ).done( () => {
		mw.loader.using( rlModules ).done( () => {
			const diag = new StandardDialogs.ui.PageInformationDialog( {
				pageName: title,
				panelRegistry: registryPageInformation
			} );
			diag.show();
		} );
	} );
	e.defaultPrevented = true;
	return false;
} );
